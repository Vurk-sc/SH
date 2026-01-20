'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { createThread } from '@/utils/threadUtils'

interface CreateThreadProps {
  onThreadCreated?: () => void
}

export default function CreateThread({ onThreadCreated }: CreateThreadProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) return

    setLoading(true)

    const result = await createThread(title, content, isPrivate, user.id)

    if (result.success) {
      setTitle('')
      setContent('')
      setIsPrivate(false)
      alert('Thread created successfully!')
      if (onThreadCreated) {
        onThreadCreated()
      } else {
        router.push('/')
      }
    } else {
      alert('Failed to create thread. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 max-w-2xl mx-auto">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Thread</h2>
            <p className="text-gray-400 text-sm">Start a new conversation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Thread Title
            </label>
            <input
              type="text"
              placeholder="Give your thread a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-4 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Thread Content
            </label>
            <textarea
              placeholder="What's this thread about? Share some context to get the conversation started..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-4 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-lg"
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-700 border border-gray-600">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-600 focus:ring-indigo-500"
              />
              <div>
                <label htmlFor="private" className="text-sm font-semibold text-white cursor-pointer">
                  Make this thread private
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Only invited members can see and post in this thread
                </p>
              </div>
            </div>
            {isPrivate && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1 1 1H5a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2v6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Private</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setTitle('')
                setContent('')
                setIsPrivate(false)
              }}
              className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </span>
              ) : (
                'Create Thread'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
