'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

interface PrivateThread {
  id: string
  title: string
  content: string
  created_at: string
  author_id: string
  author: {
    username: string
  }
  thread_members: {
    profiles: {
      username: string
      id: string
    }
  }[]
  posts: {
    count: number
  }[]
}

export default function PrivateThreadManager() {
  const { user } = useAuth()
  const router = useRouter()
  const [privateThreads, setPrivateThreads] = useState<PrivateThread[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState<string | null>(null)
  const [newMember, setNewMember] = useState('')

  useEffect(() => {
    fetchPrivateThreads()
  }, [])

  const fetchPrivateThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          author:profiles!author_id(username),
          thread_members(
            profiles(username, id)
          ),
          posts!thread_id(count)
        `)
        .eq('is_private', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching private threads:', error.message)
      } else {
        const filtered = data?.filter(thread =>
          thread.author_id === user?.id ||
          thread.thread_members?.some((m: any) => m.profiles?.id === user?.id)
        ) || []

        setPrivateThreads(filtered || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (threadId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newMember)
      .single()

    if (!profile) {
      alert('User not found')
      return
    }

    const { error } = await supabase
      .from('thread_members')
      .insert({
        thread_id: threadId,
        user_id: profile.id,
      })

    if (error) {
      console.error('Error adding member:', error)
      alert('Failed to add member. They might already be in the thread.')
    } else {
      setNewMember('')
      setShowAddMember(null)
      fetchPrivateThreads()
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading private threads...</div>
  }

  return (
    <div className="space-y-6">
      {privateThreads.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 border border-gray-700">
          <div className="w-20 h-20 bg-gray-700 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2v-1a2 2 0 012-2H3.055M9 3v4a2 2 0 002-2v6a2 2 0 002-2V3m-6 8h6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No private threads yet</h3>
          <p className="text-gray-400">Private threads are only visible to invited members.</p>
        </div>
      ) : (
        privateThreads.map((thread) => (
          <div
            key={thread.id}
            className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all duration-200"
          >
            <div className="p-6">
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/thread/${thread.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white flex-1">{thread.title}</h3>
                  <span className="bg-yellow-600 text-yellow-100 text-xs px-3 py-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v6a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2V9z" clipRule="evenodd" />
                    </svg>
                    Private
                  </span>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{thread.content}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Members: </span>
                    <span className="text-gray-300">
                      {thread.author.username} (Author)
                      {thread.thread_members?.length > 0 && ', '}
                      {thread.thread_members?.map((m: any) => m.profiles.username).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {thread.author_id === user?.id && (
                    <div className="flex items-center space-x-2">
                      {showAddMember === thread.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Username"
                            value={newMember}
                            onChange={(e) => setNewMember(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => addMember(thread.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-xs font-semibold"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowAddMember(null)
                              setNewMember('')
                            }}
                            className="text-gray-400 hover:text-white px-2 py-1 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddMember(thread.id)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                          + Add Member
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="bg-gray-700 px-2 py-0.5">
                      {Array.isArray(thread.posts) ? thread.posts[0]?.count || 0 : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

