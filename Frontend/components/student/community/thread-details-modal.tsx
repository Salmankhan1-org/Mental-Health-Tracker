'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Users, Wind, Reply as ReplyIcon } from 'lucide-react'
import { ReplyItem, Reply } from './reply-item'
import { ReplyInput } from './reply-input'
import { ThreadStats, ThreadUser } from '@/types/types'
import { ToastFunction } from '@/helper/toast-function'
import axios from 'axios'

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
    stats: ThreadStats, 
  }
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
}: ThreadDetailModalProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [threadReplyOpen, setThreadReplyOpen] = useState(false)


    const handleAddReply = async(content:string, isAnonymous:boolean)=>{
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/community/threads/${thread._id}/reply`,
                {content, isAnonymous},
                {withCredentials: true}
            );

            if(response.data.success){
                ToastFunction('success', response.data.message);
            }
        } catch (error) {
            ToastFunction('error', error);
        }
    }
    const handleShowReplyForm = (parentId: string) => {
        setReplyingToId(replyingToId === parentId ? null : parentId)
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
                    //   onClick={onThreadSupport}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors group text-sm"
                    >
                      <Heart
                        size={16}
                        className="group-hover:text-blue-600 transition-colors"
                      />
                      <span className="group-hover:text-blue-600 transition-colors">
                        Support ({thread.stats.supportCount})
                      </span>
                    </button>

                    <button
                    //   onClick={onThreadRelate}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors group text-sm"
                    >
                      <Users
                        size={16}
                        className="group-hover:text-purple-600 transition-colors"
                      />
                      <span className="group-hover:text-purple-600 transition-colors">
                        Relate ({thread.stats.relateCount})
                      </span>
                    </button>

                    <button
                    //   onClick={onThreadHug}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-rose-50 transition-colors group text-sm"
                    >
                      <Wind
                        size={16}
                        className="group-hover:text-rose-600 transition-colors"
                      />
                      <span className="group-hover:text-rose-600 transition-colors">
                        Hug ({thread.stats.replyCount})
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

                {/* Replies Section */}
                {/* <div className="p-6">
                  {replies.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-4">
                        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                      </h3>
                      {replies.map((reply) => (
                        <div key={reply.id}>
                          <ReplyItem
                            reply={reply}
                            onReply={(parentId) =>
                              handleAddReply('', false, parentId)
                            }
                            onSupport={onReplySupport}
                            onShowReplyForm={handleShowReplyForm}
                            showReplyForm={replyingToId === reply.id}
                          />
                          {replyingToId === reply.id && (
                            <ReplyInput
                              onSubmit={(content, isAnonymous) => {
                                handleAddReply(content, isAnonymous, reply.id)
                              }}
                              onCancel={() => setReplyingToId(null)}
                              isNested
                              replyingTo={
                                reply.isAnonymous
                                  ? 'Quiet Willow'
                                  : reply.author
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No replies yet. Be the first to respond!
                      </p>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
