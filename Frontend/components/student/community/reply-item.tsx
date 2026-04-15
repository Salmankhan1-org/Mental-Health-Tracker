"use client";

import { ThreadStats } from "@/types/types";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ReplyInput } from "./reply-input";
import { ToastFunction } from "@/helper/toast-function";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmActionDialog } from "@/components/counsellor/appointments/confirm-action-dialog";

export interface Reply {
  id: string;
  author: string;
  isAnonymous: boolean;
  content: string;
  timestamp: Date | string;
  anonymousIdentity: string | undefined | null;
  isEdited: boolean;
  stats: ThreadStats;
  isMine: boolean;
  parentReplyId?: string; // For nested replies
  replies?: Reply[]; // Nested replies
}

interface ReplyItemProps {
  reply: Reply;
  depth?: number;
  onDeleteSuccess?: (id: string) => void;
  setThreadStats: (updater: (prev: ThreadStats) => ThreadStats) => void;
}

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const generateInitialColor = (name: string) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
    "bg-red-100 text-red-700",
  ];
  const code = name.charCodeAt(0);
  return colors[code % colors.length];
};

export function ReplyItem({
  reply,
  depth = 0,
  onDeleteSuccess,
  setThreadStats,
}: ReplyItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [nestedReplies, setNestedReplies] = useState<Reply[]>(
    reply.replies || [],
  );
  const [loading, setLoading] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState("");
  const [localReply, setLocalReply] = useState(reply);
  const [supportCount, setSupportCount] = useState(
    reply.stats?.supportCount || 0,
  );
  const [userReaction, setUserReaction] = useState(
    reply.stats?.userReaction || null,
  );
  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isSupported = userReaction === "support";

  const { user } = useSelector((state: RootState) => state?.auth);

  const totalReplies = localReply.stats?.replyCount || nestedReplies.length;

  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (nestedReplies.length === 0 && totalReplies > 0) {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/replies/${reply.id}/nested`,
          { withCredentials: true },
        );
        if (res.data.success) {
          const formatted = res.data.data.map((r: any) => ({
            id: r.id,
            author: r.author || "User",
            content: r.content,
            timestamp: r.timestamp,
            isAnonymous: r.isAnonymous,
            anonymousIdentity: r.anonymousIdentity,
            isEdited: r.isEdited,
            supportCount: r.stats?.supportCount || 0,
            stats: r.stats || {
              supportCount: 0,
              replyCount: 0,
              userReaction: null,
            },
          }));
          setNestedReplies(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch nested replies:", error);
      } finally {
        setLoading(false);
      }
    }

    setShowReplies(true);
  };

  // delete Reply
  const onDelete = async (deleteId: string) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/reply/${deleteId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        ToastFunction("success", response.data.message);
        if (deleteId !== localReply.id) {
          setNestedReplies((prev) => prev.filter((r) => r.id !== deleteId));
          // Update the count locally
          setLocalReply((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              replyCount: Math.max(0, (prev.stats?.replyCount || 0) - 1),
            },
          }));
        }

        // 2. Notify the parent to remove THIS component from its list
        if (onDeleteSuccess) {
          onDeleteSuccess(deleteId);
        }

        setThreadStats((prev: ThreadStats) => ({
          ...prev,
          replyCount: prev.replyCount - 1,
        }));

        setDeleteId("");
      }
    } catch (error) {
      ToastFunction("error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNestedReply = async (
    content: string,
    isAnonymous: boolean,
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/reply/${reply.id}`,
        { content, isAnonymous },
        { withCredentials: true },
      );

      if (response.data.success) {
        const newReply = response.data.data;

        // 1. Format the new reply to match your Reply interface
        const formattedReply: Reply = {
          id: newReply._id,
          author: isAnonymous
            ? newReply.anonymousIdentity || "Quiet Willow"
            : user?.name,
          content: newReply.content,
          timestamp: newReply.createdAt,
          isAnonymous: newReply.isAnonymous,
          anonymousIdentity: newReply.anonymousIdentity,
          isMine: newReply.isMine,
          isEdited: false,
          stats: newReply.stats || {
            supportCount: 0,
            replyCount: 0,
            userReaction: null,
          },
        };

        // 2. Update local state immediately
        setNestedReplies((prev) => [formattedReply, ...prev]);

        setLocalReply((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            replyCount: (prev.stats?.replyCount || 0) + 1,
          },
        }));

        // 3. UI Enhancements
        setShowReplies(true); // Ensure they are visible
        setIsReplying(false); // Close input
        ToastFunction("success", response.data.message);
      }
    } catch (error) {
      ToastFunction("error", error);
    }
  };

  const updateReplySupport = (
    replies: Reply[],
    replyId: string,
    isNowSupported: boolean,
  ): Reply[] => {
    return replies.map((r) => {
      if (r.id === replyId) {
        const stats = { ...r.stats };
        if (isNowSupported) {
          stats.supportCount += 1;
          stats.userReaction = "support";
        } else {
          stats.supportCount = Math.max(0, stats.supportCount - 1);
          stats.userReaction = null;
        }
        return { ...r, stats };
      }
      if (r.replies) {
        return {
          ...r,
          replies: updateReplySupport(r.replies, replyId, isNowSupported),
        };
      }
      return r;
    });
  };

  const handleOnSupport = useCallback(
    async (id: string, type: string, onModelType: string) => {
      const wasSupported = userReaction === "support";
      const newReaction = wasSupported ? null : "support";
      const newCount = wasSupported
        ? Math.max(0, supportCount - 1)
        : supportCount + 1;

      // IMMEDIATE UI updates
      setUserReaction(newReaction);
      setSupportCount(newCount);
      setAnimatingReaction("support");

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/react/${id}`,
          { type, onModelType },
          { withCredentials: true },
        );

        if (response.data.success) {
          // Sync with server
          setSupportCount(response.data.data?.supportCount ?? newCount);
          setUserReaction(response.data.data?.userReaction ?? newReaction);
          ToastFunction("success", response.data.message);
        }
      } catch (error) {
        // Rollback
        setUserReaction(wasSupported ? "support" : null);
        setSupportCount(wasSupported ? supportCount + 1 : supportCount - 1);
        ToastFunction("error", error);
      }
    },
    [supportCount, userReaction],
  ); // Depend on current values

  useEffect(() => {
    if (
      reply.stats?.supportCount !== localReply.stats?.supportCount ||
      reply.stats?.userReaction !== localReply.stats?.userReaction
    ) {
      setLocalReply(reply);
    }
  }, [
    reply.id,
    reply.stats?.supportCount,
    reply.stats?.userReaction,
    reply.content,
  ]);

  useEffect(() => {
    setSupportCount(reply.stats?.supportCount || 0);
    setUserReaction(reply.stats?.userReaction || null);
  }, [reply.id]);
  return (
    <motion.div
      initial={{ opacity: 0, x: depth > 0 ? -10 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${depth > 0 ? "ml-4 md:ml-8 border-l-2 border-gray-200 pl-4 md:pl-6" : ""}`}
    >
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 ${generateInitialColor(
            reply.author,
          )}`}
        >
          {reply.isAnonymous ? "A" : getInitial(reply.author)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                {reply.isAnonymous
                  ? reply.anonymousIdentity || "Quiet Willow"
                  : reply.author}
              </span>
              {reply.isAnonymous && (
                <span className="inline-block px-1.5 py-0.5 rounded text-gray-600 text-xs bg-gray-100">
                  Anonymous
                </span>
              )}
              <span className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(reply.timestamp), {
                  addSuffix: true,
                })}
              </span>
              {reply.isEdited && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  Edited
                </span>
              )}
            </div>
            {reply.isMine && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none text-gray-500">
                    <MoreHorizontal size={20} />
                    <span className="sr-only">Open menu</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    // onSelect={(e) => {
                    //   setSelectedThread({_id, moodLabel, topic, isAnonymous, content})
                    // }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil size={14} />
                    <span>Edit Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      setDeleteId(reply.id);
                    }}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100"
                  >
                    <Trash2 size={14} />
                    <span>Delete Post</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-gray-700 text-sm  leading-relaxed">
            {reply.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => {
                // setAnimatingReaction('support');
                handleOnSupport(localReply.id, "support", "ThreadReply");
              }}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-xs font-medium group"
            >
              <motion.div
                animate={
                  animatingReaction === "support"
                    ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                onAnimationComplete={() => setAnimatingReaction("")}
              >
                <FaHeart
                  size={14}
                  className={
                    isSupported
                      ? "text-blue-600 transition-colors duration-300"
                      : "text-gray-500"
                  }
                />
              </motion.div>

              <span>{supportCount}</span>
            </button>

            {depth < 2 && (
              <button
                onClick={() => setIsReplying(true)}
                className="flex items-center gap-1 text-gray-600 hover:text-teal-600 transition-colors text-xs font-medium group"
              >
                <MessageCircle
                  size={14}
                  className="group-hover:text-teal-600"
                />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Nested Replies Toggle - Now using dynamic stats */}
          {totalReplies > 0 && (
            <button
              onClick={handleToggleReplies}
              disabled={loading}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors text-xs font-semibold mt-3 disabled:text-gray-400"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : showReplies ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              <span>
                {loading
                  ? "Loading..."
                  : `${showReplies ? "Hide" : "Show"} ${totalReplies} ${totalReplies === 1 ? "reply" : "replies"}`}
              </span>
            </button>
          )}

          {isReplying && (
            <ReplyInput
              onSubmit={(content, isAnonymous) => {
                handleAddNestedReply(content, isAnonymous);
              }}
              onCancel={() => setIsReplying(false)}
              isNested={true}
              replyingTo={
                localReply.isAnonymous
                  ? localReply.anonymousIdentity || "Quiet Willow"
                  : localReply.author
              }
            />
          )}

          {/* Nested Replies Rendering */}
          {depth < 2 && showReplies && nestedReplies.length > 0 && (
            <div className="mt-4 space-y-2">
              {nestedReplies.map((nestedReply) => (
                <div key={nestedReply.id}>
                  <ReplyItem
                    reply={nestedReply}
                    depth={depth + 1}
                    onDeleteSuccess={(deletedId) => {
                      // Remove the deleted child from local state
                      setNestedReplies((prev) =>
                        prev.filter((r) => r.id !== deletedId),
                      );
                      // Update the reply count for the UI toggle
                      setLocalReply((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          replyCount: Math.max(
                            0,
                            (prev.stats?.replyCount || 0) - 1,
                          ),
                        },
                      }));
                    }}
                    setThreadStats={setThreadStats}
                    // onReply={onReply}
                    // onShowReplyForm={onShowReplyForm}
                    // showReplyForm={showReplyForm}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConfirmActionDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId("")}
        onConfirm={() => onDelete(deleteId)}
        loading={isDeleting}
        title="Delete Thread Reply"
        description="This action cannot be undone and it will delete this reply and it's Sub-Replies and you will not be able to see this again."
        confirmText="Delete Reply"
      />
    </motion.div>
  );
}
