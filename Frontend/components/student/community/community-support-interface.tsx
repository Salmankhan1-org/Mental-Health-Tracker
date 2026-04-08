'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Loader } from 'lucide-react'
import { SupportThreadCard } from './support-thread-card'
import { CreateThreadModal } from './create-thread-modal'

interface Thread {
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
}

const topicList = ['All Topics', 'Anxiety', 'Stress', 'Exams', 'Relationships']

// Mock data
const mockThreads: Thread[] = [
  {
    id: '1',
    moodLabel: 'Overwhelmed',
    topic: 'Exams',
    author: 'Alex Chen',
    isAnonymous: true,
    content:
      'I have three major exams coming up next week and I feel completely overwhelmed. I&apos;ve tried to study but I keep procrastinating and getting anxious. I&apos;m worried I&apos;ll fail. Does anyone else struggle with exam anxiety? Any tips on how to manage it?',
    supportCount: 24,
    relateCount: 18,
    hugCount: 12,
    replyCount: 8,
  },
  {
    id: '2',
    moodLabel: 'Stressed',
    topic: 'Relationships',
    author: 'Jordan',
    isAnonymous: false,
    content:
      'Going through a rough patch with my best friend. We had a misunderstanding and haven&apos;t spoken in weeks. I really miss our friendship but don&apos;t know how to fix things. It&apos;s affecting my mental health and I feel lonely.',
    supportCount: 31,
    relateCount: 27,
    hugCount: 19,
    replyCount: 14,
  },
  {
    id: '3',
    moodLabel: 'Anxious',
    topic: 'Anxiety',
    author: 'Morgan',
    isAnonymous: true,
    content:
      'Having panic attacks more frequently lately. Sometimes they come out of nowhere and I don&apos;t know how to deal with them. My heart races, I can&apos;t breathe, and I think something&apos;s wrong with me. Has anyone found techniques that help?',
    supportCount: 42,
    relateCount: 35,
    hugCount: 28,
    replyCount: 11,
  },
  {
    id: '4',
    moodLabel: 'Frustrated',
    topic: 'Stress',
    author: 'Casey',
    isAnonymous: false,
    content:
      'Feeling burnt out from balancing work, studies, and personal life. Everything feels like too much right now. I don&apos;t have time for myself and I&apos;m constantly tired. Looking for advice on how to better manage my time and stress.',
    supportCount: 19,
    relateCount: 22,
    hugCount: 15,
    replyCount: 6,
  },
]

export function CommunitySupportInterface() {
  const [selectedTopic, setSelectedTopic] = useState('All Topics')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>(mockThreads)
  const [isLoading, setIsLoading] = useState(false)

  // Filter threads based on selected topic and search query
  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const matchesTopic =
        selectedTopic === 'All Topics' || thread.topic === selectedTopic
      const matchesSearch =
        thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.topic.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTopic && matchesSearch
    })
  }, [selectedTopic, searchQuery, threads])

  const handleCreateThread = (data: {
    content: string
    emotion: string
    topic: string
    isAnonymous: boolean
  }) => {
    const newThread: Thread = {
      id: String(threads.length + 1),
      moodLabel: data.emotion,
      topic: data.topic,
      author: data.isAnonymous ? 'Anonymous' : 'You',
      isAnonymous: data.isAnonymous,
      content: data.content,
      supportCount: 0,
      relateCount: 0,
      hugCount: 0,
      replyCount: 0,
    }
    setThreads([newThread, ...threads])
  }

  const handleSupport = (id: string) => {
    setThreads(
      threads.map((thread) =>
        thread.id === id
          ? { ...thread, supportCount: thread.supportCount + 1 }
          : thread
      )
    )
  }

  const handleRelate = (id: string) => {
    setThreads(
      threads.map((thread) =>
        thread.id === id
          ? { ...thread, relateCount: thread.relateCount + 1 }
          : thread
      )
    )
  }

  const handleHug = (id: string) => {
    setThreads(
      threads.map((thread) =>
        thread.id === id ? { ...thread, hugCount: thread.hugCount + 1 } : thread
      )
    )
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateThread}
      />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Community Support
              </h1>
              <p className="text-gray-600 mt-1">
                Share your feelings and support others on their journey
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={20} />
              Create Support Thread
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search topics, emotions, or posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filter by Topic</h3>
              <div className="space-y-2">
                {topicList.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedTopic === topic
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Topic Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Active Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {topicList.slice(1).map((topic) => {
                    const count = threads.filter(
                      (t) => t.topic === topic
                    ).length
                    return (
                      <span
                        key={topic}
                        className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                      >
                        {topic} ({count})
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feed Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {filteredThreads.length > 0 ? (
              <div className="space-y-4">
                {filteredThreads.map((thread, index) => (
                  <SupportThreadCard
                    key={thread.id}
                    {...thread}
                    onSupport={handleSupport}
                    onRelate={handleRelate}
                    onHug={handleHug}
                    index={index}
                  />
                ))}

                {/* Load More Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center pt-4"
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Questions'
                    )}
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No threads found. Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

