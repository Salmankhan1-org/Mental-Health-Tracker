'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Wind, MessageCircle } from 'lucide-react'

interface SupportThreadCardProps {
  id: string
  moodLabel: string
  topic: string
  author: string
  isAnonymous: boolean
  content: string
  supportCount: number
  relateCount: number
  hugCount: number
  replyCount: number
  onSupport: (id: string) => void
  onRelate: (id: string) => void
  onHug: (id: string) => void
  onViewReplies: (id: string) => void
  index?: number
}

const topicColorMap: Record<string, string> = {
  'Anxiety': 'bg-blue-100 text-blue-700',
  'Stress': 'bg-purple-100 text-purple-700',
  'Exams': 'bg-amber-100 text-amber-700',
  'Relationships': 'bg-rose-100 text-rose-700',
}

export function SupportThreadCard({
  id,
  moodLabel,
  topic,
  author,
  isAnonymous,
  content,
  supportCount,
  relateCount,
  hugCount,
  replyCount,
  onSupport,
  onRelate,
  onHug,
  onViewReplies,
  index = 0,
}: SupportThreadCardProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm flex items-center justify-center flex-shrink-0">
              {isAnonymous ? 'A' : getInitial(author)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">
                  {isAnonymous ? 'Quiet Willow' : author}
                </span>
                {isAnonymous && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    Posted Anonymously
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mood and Topic Labels */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
            Feeling: {moodLabel}
          </div>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              topicColorMap[topic] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {topic}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-5 text-sm">
          {content}
        </p>

        {/* Interaction Bar */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onSupport(id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors group"
            aria-label="Support this thread"
          >
            <Heart size={18} className="group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
              Support ({supportCount})
            </span>
          </button>

          <button
            onClick={() => onRelate(id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors group"
            aria-label="Relate to this thread"
          >
            <Users size={18} className="group-hover:text-purple-600 transition-colors" />
            <span className="text-sm font-medium group-hover:text-purple-600 transition-colors">
              Relate ({relateCount})
            </span>
          </button>

          <button
            onClick={() => onHug(id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-rose-50 transition-colors group"
            aria-label="Send a hug"
          >
            <Wind size={18} className="group-hover:text-rose-600 transition-colors" />
            <span className="text-sm font-medium group-hover:text-rose-600 transition-colors">
              Hug ({hugCount})
            </span>
          </button>

          <button
            onClick={() => onViewReplies(id)}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 transition-colors group"
            aria-label="View and reply to this thread"
          >
            <MessageCircle size={18} className="group-hover:text-teal-600 transition-colors" />
            <span className="text-sm font-medium group-hover:text-teal-600 transition-colors">
              ({replyCount})
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
