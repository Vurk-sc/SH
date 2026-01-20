'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'

interface Thread {
  id: string
  title: string
  content: string
  is_private: boolean
  created_at: string
  author: {
    username: string
  }
  author_id: string
}

export default function ThreadPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchThread()
  }, [params.id])

  const fetchThread = async () => {
    const { data, error } = await supabase
      .from('threads')
      .select(`
        *,
        author:profiles!author_id(username)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching thread:', error)
      router.push('/')
    } else {
      setThread(data)
    }
    setLoading(false)
  }

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDeleteThread = async () => {
    if (!thread || !user || thread.author_id !== user.id) return

    if (!confirm('Are you sure you want to delete this thread? This will also delete all posts.')) return

    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', thread.id)

      if (error) {
        throw error
      }

      router.push('/')
    } catch (error: any) {
      console.error('Error deleting thread:', error)
      alert(`Failed to delete thread: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-white">Loading thread...</div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-white">Thread not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => router.push('/')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Threads</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-300 font-medium hidden sm:block">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                    router.push('/auth/login')
                  })
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 border border-gray-700 p-8 mb-8 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-white leading-tight">{thread.title}</h1>
            <div className="flex items-center space-x-3">
              {thread.is_private && (
                <span className="bg-yellow-600 text-yellow-100 text-xs px-3 py-1 flex items-center shrink-0">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2V9z" clipRule="evenodd" />
                  </svg>
                  Private
                </span>
              )}
              {user?.id === thread.author_id && (
                <button
                  onClick={handleDeleteThread}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  title="Delete Thread"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
          <div className="flex items-center space-x-3 pt-6 border-t border-gray-700">
            <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {thread.author?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">{thread.author?.username || 'Unknown'}</p>
              <p className="text-gray-500 text-sm">{new Date(thread.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {user && (
            <div className="bg-gray-800 border border-gray-700 overflow-hidden">
              <PostForm threadId={thread.id} onPostCreated={handlePostCreated} />
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Discussion</span>
            </h2>
            <PostList threadId={thread.id} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
