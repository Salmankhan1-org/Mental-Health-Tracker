'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    content: string
    emotion: string
    topic: string
    isAnonymous: boolean
  }) => void
}

const emotions = [
  'Overwhelmed',
  'Anxious',
  'Stressed',
  'Sad',
  'Frustrated',
  'Confused',
  'Hopeful',
  'Motivated',
]

const topics = ['Anxiety', 'Stress', 'Exams', 'Relationships', 'Other']

export function CreateThreadModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateThreadModalProps) {
  const [content, setContent] = useState('')
  const [emotion, setEmotion] = useState('')
  const [topic, setTopic] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = () => {
    if (!content.trim() || !emotion || !topic) {
      alert('Please fill in all fields')
      return
    }

    onSubmit({
      content,
      emotion,
      topic,
      isAnonymous,
    })

    // Reset form
    setContent('')
    setEmotion('')
    setTopic('')
    setIsAnonymous(false)
    onClose()
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
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Create Support Thread
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Current Emotion */}
                <div className="space-y-2">
                  <label htmlFor="emotion" className="text-sm font-semibold text-gray-900">
                    How are you feeling? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="emotion"
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select your current emotion...</option>
                    {emotions.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <label htmlFor="topic" className="text-sm font-semibold text-gray-900">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select a topic...</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-semibold text-gray-900">
                    Share your thoughts <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    placeholder="Write what's on your mind... Let others know how you're feeling and what support you need."
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 500))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-32"
                  />
                  <p className="text-xs text-gray-500">
                    {content.length}/500 characters
                  </p>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-900 cursor-pointer block mb-1">
                      Post Anonymously
                    </label>
                    <p className="text-xs text-gray-500">
                      Your identity will be hidden from the community
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-teal-600"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
                  >
                    Share Thread
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

