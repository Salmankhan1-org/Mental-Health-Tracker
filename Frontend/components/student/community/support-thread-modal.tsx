"use client";

import {
  SelectedThread,
  ThreadReplies,
  ThreadStats,
  ThreadUser,
} from "@/types/types";
import { motion } from "framer-motion";
import { Heart, Users, Wind, MessageCircle } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfirmActionDialog } from "@/components/counsellor/appointments/confirm-action-dialog";
import { useState } from "react";
import { ToastFunction } from "@/helper/toast-function";
import axios from "axios";
import { CreateThreadModal } from "./create-thread-modal";
import { ThreadDetailModal } from "./thread-details-modal";

interface SupportThreadCardProps {
  _id: string;
  moodLabel: string;
  topic: string;
  user: ThreadUser;
  isAnonymous: boolean;
  isMine: boolean;
  anonymousIdentity: string;
  content: string;
  stats: ThreadStats;
  handleFetchFilteredThreads: () => void;
  setSelectedThread: (thread: SelectedThread) => void;
  index: number;
}

const topicColorMap: Record<string, string> = {
  Anxiety: "bg-blue-100 text-blue-700",
  Stress: "bg-purple-100 text-purple-700",
  Exams: "bg-amber-100 text-amber-700",
  Relationships: "bg-rose-100 text-rose-700",
};

export function SupportThreadCard({
  _id,
  moodLabel,
  topic,
  user,
  isAnonymous,
  anonymousIdentity,
  content,
  isMine,
  stats,
  handleFetchFilteredThreads,
  setSelectedThread,
  index = 0,
}: SupportThreadCardProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openThreadDetailsModal, setOpenThreadDetailsModal] = useState(false);
  const [threadStats, setThreadStats] = useState<ThreadStats>(stats);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(
    null,
  );

  const isSupportActive = threadStats.userReaction === "support";
  const isRelateActive = threadStats.userReaction === "relate";
  const isHugActive = threadStats.userReaction === "hug";

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/${id}/delete`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        ToastFunction("success", response.data.message);
        handleFetchFilteredThreads();
        setDeleteId("");
      }
    } catch (error) {
      ToastFunction("error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onUpdate = (id: string) => {};

  const handleOnReact = async (
    id: string,
    type: string,
    onModelType: string,
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/community/threads/react/${id}`,
        { type, onModelType },
        { withCredentials: true },
      );

      if (response.data.success) {
        setThreadStats((prev: any) => {
          const updated = { ...prev };
          const oldReaction = prev.userReaction; // e.g., 'support'
          const newReaction = response.data.data; // e.g., 'support' or null

          if (oldReaction && !newReaction) {
            updated[`${oldReaction}Count`] = Math.max(
              0,
              updated[`${oldReaction}Count`] - 1,
            );
          } else if (
            oldReaction &&
            newReaction &&
            oldReaction !== newReaction
          ) {
            updated[`${oldReaction}Count`] = Math.max(
              0,
              updated[`${oldReaction}Count`] - 1,
            );
            updated[`${newReaction}Count`] += 1;
          } else if (!oldReaction && newReaction) {
            updated[`${newReaction}Count`] += 1;
          }

          updated.userReaction = newReaction;
          return updated;
        });

        ToastFunction("success", response.data.message);
      }
    } catch (error) {
      ToastFunction("error", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-3 shadow-sm hover:shadow-md transition-shadow">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm flex items-center justify-center shrink-0">
              {isAnonymous ? "A" : getInitial(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">
                  {isAnonymous ? anonymousIdentity : user.name}
                </span>
                {isAnonymous && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    Posted Anonymously
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            {isMine && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none text-gray-500">
                    <MoreHorizontal size={20} />
                    <span className="sr-only">Open menu</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      setSelectedThread({
                        _id,
                        moodLabel,
                        topic,
                        isAnonymous,
                        content,
                      });
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil size={14} />
                    <span>Edit Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(_id)}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100"
                  >
                    <Trash2 size={14} />
                    <span>Delete Post</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mood and Topic Labels */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
            Feeling: {moodLabel}
          </div>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              topicColorMap[topic] || "bg-gray-100 text-gray-700"
            }`}
          >
            {topic}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-5 text-sm">{content}</p>

        {/* Interaction Bar */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setAnimatingReaction("support");
              handleOnReact(_id, "support", "Thread");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <motion.div
              animate={
                animatingReaction === "support"
                  ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              onAnimationComplete={() => setAnimatingReaction(null)}
            >
              <FaHeart
                size={18}
                className={
                  isSupportActive
                    ? "text-blue-600 transition-colors duration-300"
                    : "text-gray-500"
                }
              />
            </motion.div>

            <span className={`text-sm font-medium `}>
              Support ({threadStats.supportCount})
            </span>
          </button>

          <button
            onClick={() => {
              setAnimatingReaction("relate");
              handleOnReact(_id, "relate", "Thread");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <motion.div
              animate={
                animatingReaction === "relate" ? { scale: [1, 1.3, 1] } : {}
              }
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setAnimatingReaction(null)}
            >
              <FaUsers
                size={18}
                className={isRelateActive ? "text-purple-600" : "text-gray-500"}
              />
            </motion.div>

            <span className={`text-sm font-medium`}>
              Relate ({threadStats.relateCount})
            </span>
          </button>

          <button
            onClick={() => {
              setAnimatingReaction("hug");
              handleOnReact(_id, "hug", "Thread");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <motion.div
              animate={
                animatingReaction === "hug"
                  ? { scale: [1, 1.4, 1], y: [0, -5, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              onAnimationComplete={() => setAnimatingReaction(null)}
            >
              <Wind
                size={18}
                className={isHugActive ? "text-rose-600" : "text-gray-500"}
              />
            </motion.div>

            <span className={`text-sm font-medium`}>
              Hug ({threadStats.hugCount})
            </span>
          </button>

          <button
            onClick={() => setOpenThreadDetailsModal(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 transition-colors group"
            aria-label="Reply to this thread"
          >
            <MessageCircle
              size={18}
              className="group-hover:text-teal-600 transition-colors"
            />
            <span className="text-sm font-medium group-hover:text-teal-600 transition-colors">
              ({threadStats.replyCount})
            </span>
          </button>
        </div>
      </div>

      <ConfirmActionDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId("")}
        onConfirm={() => onDelete(deleteId)}
        loading={isDeleting}
        title="Delete Community Thread"
        description="This action cannot be undone and it will delete this thread and you will not be able to see this again."
        confirmText="Delete Thread"
      />

      <ThreadDetailModal
        isOpen={openThreadDetailsModal}
        onClose={() => setOpenThreadDetailsModal(false)}
        thread={{
          _id,
          moodLabel,
          isMine,
          isAnonymous,
          anonymousIdentity,
          user,
          content,
          topic,
        }}
        threadStats={threadStats}
        setThreadStats={setThreadStats}
        handleOnReact={handleOnReact}
      />
    </motion.div>
  );
}
