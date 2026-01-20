'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Thread {
  id: string
  title: string
  content: string
  is_private: boolean
  created_at: string
  author: {
    username: string
  }
  posts: {
    count: number
  }[]
}

interface ThreadListProps {
  refreshTrigger?: number
}

export default function ThreadListNew({ refreshTrigger }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchThreads()
  }, [refreshTrigger])

  const fetchThreads = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          author:profiles!author_id(username),
          posts!thread_id(count)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Thread fetch error:', error.message)
        alert(`Failed to load threads: ${error.message || 'Unknown error'}`)
      } else {
        setThreads((data as any) || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Failed to load threads')
    } finally {
      setLoading(false)
    }
  }

  const handleThreadClick = (threadId: string) => {
    router.push(`/thread/${threadId}`)
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Loading threads...</div>
    )
  }

  return (
    <div className="space-y-6">
      {threads.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 border border-gray-700">
          <div className="w-20 h-20 bg-gray-700 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 002-2v-1a2 2 0 012-2H3.055M9 3v4a2 2 0 002 2h6a2 2 0 002-2V3m-6 8h6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No threads yet</h3>
          <p className="text-gray-400">Be the first to create a thread and start the conversation!</p>
        </div>
      ) : (
        threads.map((thread) => (
          <div
            key={thread.id}
            className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all duration-200 cursor-pointer"
            onClick={() => handleThreadClick(thread.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white flex-1">
                  {thread.title}
                </h3>
              </div>
              {thread.content && (
                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{thread.content}</p>
              )}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {thread.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-400 font-medium">
                    {thread.author?.username || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="bg-gray-700 px-2 py-1">
                    {Array.isArray(thread.posts) ? thread.posts[0]?.count || 0 : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
