'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export interface Reply {
  id: string
  author: string
  isAnonymous: boolean
  content: string
  timestamp: string
  supportCount: number
  parentReplyId?: string // For nested replies
  replies?: Reply[] // Nested replies
}

interface ReplyItemProps {
  reply: Reply
  depth?: number
  onReply: (parentId: string) => void
  onSupport: (replyId: string) => void
  onShowReplyForm: (parentId: string) => void
  showReplyForm?: boolean
}

const getInitial = (name: string) => name.charAt(0).toUpperCase()

const generateInitialColor = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-red-100 text-red-700',
  ]
  const code = name.charCodeAt(0)
  return colors[code % colors.length]
}

export function ReplyItem({
  reply,
  depth = 0,
  onReply,
  onSupport,
  onShowReplyForm,
  showReplyForm = false,
}: ReplyItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const hasReplies = reply.replies && reply.replies.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: depth > 0 ? -10 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${depth > 0 ? 'ml-4 md:ml-8 border-l-2 border-gray-200 pl-4 md:pl-6' : ''}`}
    >
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-full font-semibold text-xs flex items-center justify-center flex-shrink-0 ${generateInitialColor(
            reply.author
          )}`}
        >
          {reply.isAnonymous ? 'A' : getInitial(reply.author)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">
              {reply.isAnonymous ? 'Quiet Willow' : reply.author}
            </span>
            {reply.isAnonymous && (
              <span className="inline-block px-1.5 py-0.5 rounded text-gray-600 text-xs bg-gray-100">
                Anonymous
              </span>
            )}
            <span className="text-gray-500 text-xs">{reply.timestamp}</span>
          </div>

          {/* Reply Text */}
          <p className="text-gray-700 text-sm mt-2 leading-relaxed">
            {reply.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => onSupport(reply.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-xs font-medium group"
            >
              <Heart
                size={14}
                className="group-hover:fill-blue-600 transition-colors"
              />
              <span className="group-hover:text-blue-600 transition-colors">
                {reply.supportCount}
              </span>
            </button>

            <button
              onClick={() => onShowReplyForm(reply.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-teal-600 transition-colors text-xs font-medium group"
            >
              <MessageCircle size={14} className="group-hover:text-teal-600" />
              <span>Reply</span>
            </button>
          </div>

          {/* Nested Replies Toggle */}
          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors text-xs font-medium mt-3"
            >
              {showReplies ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              <span>
                {showReplies ? 'Hide' : 'Show'} {reply.replies?.length} repl
                {reply.replies?.length === 1 ? 'y' : 'ies'}
              </span>
            </button>
          )}

          {/* Nested Replies */}
          {showReplies && hasReplies && (
            <div className="mt-4 space-y-2">
              {reply.replies?.map((nestedReply) => (
                <ReplyItem
                  key={nestedReply.id}
                  reply={nestedReply}
                  depth={depth + 1}
                  onReply={onReply}
                  onSupport={onSupport}
                  onShowReplyForm={onShowReplyForm}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
