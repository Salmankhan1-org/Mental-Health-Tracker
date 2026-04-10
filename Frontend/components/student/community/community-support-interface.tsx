'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Loader, ChevronRight, ChevronLeft } from 'lucide-react'
import { CreateThreadModal } from './create-thread-modal'
import { SupportThreadCard } from './support-thread-modal'
import axios from 'axios'
import { ToastFunction } from '@/helper/toast-function'
import { PaginationData, SelectedThread, Thread } from '@/types/types'
import ReactPaginate from 'react-paginate'
import { SupportThreadSkeleton } from './support-thread-skeleton'
import { UpdateThreadModal } from './update-thread-modal'




const topicList = ['Anxiety', 'Stress', 'Exams', 'Relationships']


export function CommunitySupportInterface() {
  const [selectedTopics, setselectedTopics] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData|null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedThread, setSelectedThread] = useState<SelectedThread|null>(null)




    const handleFetchFilteredThreads = useCallback(async () => {
    try {
        setIsLoading(true);

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/community/threads/filter`, {
            searchTerm: searchQuery,
            topics: selectedTopics, // This is the array from your square-tick selection
            page: page,
            limit: 5,
            }, {
            withCredentials: true
        });

        if (response.data.success) {
            const newThreads = response.data.data.threads;
            setThreads(newThreads);
            
            setPaginationData(response.data.data.pagination);
        }
    } catch (error) {
        ToastFunction("error", error);
    } finally {
        setIsLoading(false);
    }
    }, [selectedTopics, debouncedSearch, page]);



    useEffect(() => {
        handleFetchFilteredThreads();
    }, [handleFetchFilteredThreads]);

 
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); 
        }, 1000);

     
        return () => clearTimeout(handler);
    }, [searchQuery]);

  

  const handleSupport = (id: string) => {
    // setThreads(
    //   threads.map((thread) =>
    //     thread.id === id
    //       ? { ...thread, supportCount: thread.supportCount + 1 }
    //       : thread
    //   )
    // )
  }

  const handleRelate = (id: string) => {
    // setThreads(
    //   threads.map((thread) =>
    //     thread.id === id
    //       ? { ...thread, relateCount: thread.relateCount + 1 }
    //       : thread
    //   )
    // )
  }

  const handleHug = (id: string) => {
    // setThreads(
    //   threads.map((thread) =>
    //     thread.id === id ? { ...thread, hugCount: thread.hugCount + 1 } : thread
    //   )
    // )
  }


  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination UI Component
  const PaginationUI = () => (
    paginationData && paginationData.totalPages > 1 ? (
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ChevronRight size={18} />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={paginationData.totalPages}
        previousLabel={<ChevronLeft size={18} />}
        renderOnZeroPageCount={null}
        forcePage={page - 1}
        containerClassName="flex items-center cursor-pointer justify-center gap-2 my-6"
        pageLinkClassName="px-3 py-1.5 rounded-md border border-gray-200 text-sm hover:bg-teal-50 hover:text-teal-600 transition-colors"
        activeLinkClassName="bg-teal-600 !text-white border-teal-600"
        previousLinkClassName="p-1.5 rounded-md border border-gray-200 hover:bg-gray-100 block"
        nextLinkClassName="p-1.5 rounded-md border border-gray-200 hover:bg-gray-100 block"
        disabledLinkClassName="opacity-30 cursor-not-allowed"
      />
    ) : null
  );

 

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Community Support
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Share your feelings and support others on their journey
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 p-2 text-sm bg-teal-600 cursor-pointer hover:bg-teal-700 text-white  rounded-lg transition-colors duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={16} />
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
                {topicList.map((topic) => {
                    // Check if this specific topic is in the selection array
                    const isSelected = selectedTopics.includes(topic);

                    const toggleTopic = (topic:any) => {
                    if (isSelected) {
                        // Remove topic if already selected
                        setselectedTopics(selectedTopics.filter((t) => t !== topic));
                    } else {
                        // Add topic if not selected
                        setselectedTopics([...selectedTopics, topic]);
                    }
                    };

                    return (
                    <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        isSelected
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "text-gray-700 hover:bg-gray-100 border border-transparent"
                        }`}
                    >
                        <span>{topic}</span>
                        
                        {/* The Square Tick (Checkbox) */}
                        <div 
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isSelected 
                            ? "bg-teal-600 border-teal-600 shadow-sm" 
                            : "bg-white border-gray-300"
                        }`}
                        >
                        {isSelected && (
                            <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                            ></path>
                            </svg>
                        )}
                        </div>
                    </button>
                    );
                })}
                </div>

              {/* Topic Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Active Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {topicList.slice(0).map((topic) => {
                    const count = threads.filter(
                      (t:any) => t.topic === topic
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
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {paginationData?.total || 0} Conversations Found
                </p>
                <PaginationUI />
            </div>
            {isLoading ? (
                [...Array(3)].map((_, i) => <SupportThreadSkeleton key={i} />)
              ) : threads.length > 0 ? (
                <>
                  {threads.map((thread: any, index: number) => (
                    <SupportThreadCard
                      key={thread._id} // Changed to MongoDB _id
                      {...thread}
                      onSupport={handleSupport}
                      onRelate={handleRelate}
                      onHug={handleHug}
                      handleFetchFilteredThreads={handleFetchFilteredThreads}
                      index={index}
                      setSelectedThread={setSelectedThread}
                    />
                  ))}
                  
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">No threads found for these filters.</p>
                </div>
              )}
          </motion.div>
        </div>
      </div>
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleFetchFilteredThreads = {handleFetchFilteredThreads}
      />

      {selectedThread && (
        <UpdateThreadModal 
        isOpen={!!selectedThread}
        onClose={()=>setSelectedThread(null)}
        handleFetchFilteredThreads = {handleFetchFilteredThreads}
        threadData={selectedThread}
         />
      )}
    </div>
  )
}

