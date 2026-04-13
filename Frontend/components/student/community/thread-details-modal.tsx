'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Users, Wind, Reply as ReplyIcon, Loader2 } from 'lucide-react'
import { ReplyItem, Reply } from './reply-item'
import { ReplyInput } from './reply-input'
import { ThreadReplies, ThreadStats, ThreadUser } from '@/types/types'
import { ToastFunction } from '@/helper/toast-function'
import axios from 'axios'
import { IoIosArrowDown } from "react-icons/io";

interface ThreadDetailModalProps {
  isOpen: boolean
  onClose: () => void
  thread: {
    _id : string, 
    moodLabel : string,
    topic : string,
    user: ThreadUser, 
    isAnonymous: boolean,
    isMine: boolean,
    anonymousIdentity: string,
    content: string,
  },
  threadStats: ThreadStats, 
  setThreadStats: (updater: (prev: ThreadStats) => ThreadStats) => void
  handleOnReact: (id:string, type:string, onModelType:string) => void

}

const topicColorMap: Record<string, string> = {
  'Anxiety': 'bg-blue-100 text-blue-700',
  'Stress': 'bg-purple-100 text-purple-700',
  'Exams': 'bg-amber-100 text-amber-700',
  'Relationships': 'bg-rose-100 text-rose-700',
}

const getInitial = (name: string) => name.charAt(0).toUpperCase()

export function ThreadDetailModal({
  isOpen,
  onClose,
  thread,
  threadStats,
  setThreadStats,
  handleOnReact
}: ThreadDetailModalProps) {
    const [replyingToId, setReplyingToId] = useState<string | null>(null)
    const [threadReplyOpen, setThreadReplyOpen] = useState(false)
    const [replies, setReplies] = useState<ThreadReplies[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchReplies = async (isInitial = false) => {
        setLoading(true);
        try {
            // Calculate skip based on current replies length
            const skip = isInitial ? 0 : replies.length;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/community/threads/${thread._id}/replies?skip=${skip}&limit=3`,
                {withCredentials: true}
            );
            
            if (res.data.success) {
                setReplies(prev => isInitial ? res.data.data.replies : [...prev, ...res.data.data.replies]);
                setHasMore(res.data.data.hasMore);
            }
        } catch (err) {
            ToastFunction('error',err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => { fetchReplies(true); }, [thread._id]);


    const handleAddReply = async(content:string, isAnonymous:boolean)=>{
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/community/threads/${thread._id}/reply`,
                {content, isAnonymous},
                {withCredentials: true}
            );

            if(response.data.success){
                setThreadStats((prev:ThreadStats)=>({...prev, replyCount:prev.replyCount+1}));
                setReplies(prev=>[response.data.data, ...prev]);
                ToastFunction('success', response.data.message);
            }
        } catch (error) {
            ToastFunction('error', error);
        }
    }
   

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Thread Discussion</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Original Post */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm flex items-center justify-center flex-shrink-0">
                      {thread.isAnonymous ? 'A' : getInitial(thread.user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          {thread.isAnonymous ? thread.anonymousIdentity : thread.user.name}
                        </span>
                        {thread.isAnonymous && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            Posted Anonymously
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mood and Topic */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                      Feeling: {thread.moodLabel}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        topicColorMap[thread.topic] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {thread.topic}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 leading-relaxed text-sm mb-5">
                    {thread.content}
                  </p>

                  {/* Thread Interaction Bar */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 flex-wrap">
                    <button
                      onClick={()=>handleOnReact(thread._id, 'support','Thread')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors group text-sm"
                    >
                      <Heart
                        size={16}
                        className="group-hover:text-blue-600 transition-colors"
                      />
                      <span className="group-hover:text-blue-600 transition-colors">
                        Support ({threadStats.supportCount})
                      </span>
                    </button>

                    <button
                        onClick={()=>handleOnReact(thread._id, 'relate','Thread')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors group text-sm"
                    >
                      <Users
                        size={16}
                        className="group-hover:text-purple-600 transition-colors"
                      />
                      <span className="group-hover:text-purple-600 transition-colors">
                        Relate ({threadStats.relateCount})
                      </span>
                    </button>

                    <button
                      onClick={()=>handleOnReact(thread._id, 'hug','Thread')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-rose-50 transition-colors group text-sm"
                    >
                      <Wind
                        size={16}
                        className="group-hover:text-rose-600 transition-colors"
                      />
                      <span className="group-hover:text-rose-600 transition-colors">
                        Hug ({threadStats.hugCount})
                      </span>
                    </button>

                    <button
                      onClick={() => setThreadReplyOpen(!threadReplyOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 transition-colors group text-sm ml-auto"
                    >
                      <ReplyIcon size={16} className="group-hover:text-teal-600" />
                      <span className="group-hover:text-teal-600">Reply</span>
                    </button>
                  </div>

                  {/* Thread Reply Input */}
                  {threadReplyOpen && (
                    <div className="mt-4">
                      <ReplyInput
                        onSubmit={(content, isAnonymous) => {
                          handleAddReply(content, isAnonymous)
                          setThreadReplyOpen(false)
                        }}
                        onCancel={() => setThreadReplyOpen(false)}
                        replyingTo={thread?.user?.name}
                      />
                    </div>
                  )}
                </div>

                {/* Reply  */}
               <div className="p-6">
                {replies.length > 0 ? (
                    <div className="space-y-4">
                    {/* Header matching your UI */}
                    <h3 className="font-semibold text-gray-900 text-sm mb-4">
                        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                    </h3>

                    {replies.map((reply) => (
                        <div key={reply._id || reply._id}>
                        <ReplyItem
                            
                            reply={{
                            ...reply,
                            id: reply._id,
                            author: reply.user?.name || "User",
                            anonymousIdentity: reply.anonymousIdentity,
                            timestamp: reply.createdAt,
                            stats: reply.stats,
                            }}
                            // onReply={(content, isAnonymous, replyId) => {
                            //     handleAddReplyToThreadReply(content, isAnonymous, replyId)
                            // }}
                            onSupport={()=>{}}
                            // onShowReplyForm={handleShowReplyForm}
                            // showReplyForm={replyingToId === reply._id}
                        />


                        {/* {replyingToId === reply._id && (
                            <ReplyInput
                            onSubmit={(content, isAnonymous) => {
                                handleAddReplyToThreadReply(content, isAnonymous, reply._id)
                            }}
                            onCancel={() => setReplyingToId(null)}
                            isNested={true}
                            replyingTo={
                                reply.isAnonymous
                                ? (reply.anonymousIdentity || 'Quiet Willow')
                                : reply.user?.name
                            }
                            />
                        )} */}
                        </div>
                    ))}

                    {/* Show More Button - Preserving Design */}
                    {hasMore && (
                        <div className="pt-2 text-center border-t border-gray-100 mt-4">
                        <button
                            onClick={() => fetchReplies()}
                            disabled={loading}
                            className="text-sm font-medium cursor-pointer text-teal-600 hover:text-teal-700 disabled:text-gray-400 transition-colors py-2"
                        >
                            {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                            </span>
                            ) : (
                            <span className='flex gap-1 items-center'>
                                Show More <IoIosArrowDown/>
                            </span>
                            )}
                        </button>
                        </div>
                    )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                        No replies yet. Be the first to respond!
                    </p>
                    </div>
                )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
