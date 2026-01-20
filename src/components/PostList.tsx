'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CustomAudioPlayer from './CustomAudioPlayer'

interface Post {
  id: string
  content: string
  image_url: string | null
  video_url: string | null
  audio_url: string | null
  created_at: string
  author: {
    username: string
  }
}

interface PostListProps {
  threadId: string
  refreshTrigger?: number
}

export default function PostList({ threadId, refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [threadId, refreshTrigger])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(username)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 border border-gray-700">
          <div className="w-16 h-16 bg-gray-700 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-gray-400">Be the first to share something in this thread!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      {post.author?.username || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {post.content && (
                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </div>
              )}

              {post.image_url && (
                <div className="mb-4">
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="w-full hover:shadow-md transition-shadow duration-200"
                  />
                </div>
              )}

              {post.video_url && (
                <div className="mb-4">
                  <video
                    src={post.video_url}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              {post.audio_url && (
                <div className="mb-4">
                  <div className="bg-gray-700 p-4 border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2V6m0 13h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">Audio File</p>
                        <CustomAudioPlayer src={post.audio_url} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
