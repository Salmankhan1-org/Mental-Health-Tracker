'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, X } from 'lucide-react'

interface ReplyInputProps {
  onSubmit: (content: string, isAnonymous: boolean) => void
  onCancel: () => void
  isNested?: boolean
  replyingTo?: string
}

export function ReplyInput({
  onSubmit,
  onCancel,
  isNested = false,
  replyingTo,
}: ReplyInputProps) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      onSubmit(content, isAnonymous)
      setContent('')
      setIsAnonymous(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${isNested ? 'ml-4 md:ml-8 border-l-2 border-gray-200 pl-4 md:pl-6' : ''} py-4`}
    >
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        {replyingTo && (
          <p className="text-xs text-gray-600 mb-3">
            Replying to <span className="font-semibold">{replyingTo}</span>
          </p>
        )}

        {/* Text Input */}
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 500))}
          placeholder="Share your response or thoughts..."
          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-20"
        />

        <p className="text-xs text-gray-500 mt-2">
          {content.length}/500 characters
        </p>

        {/* Anonymous Toggle and Buttons */}
        <div className="flex items-center justify-between mt-4 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
            />
            <span className="text-xs font-medium text-gray-700">
              Post anonymously
            </span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white transition-colors text-sm font-medium disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
