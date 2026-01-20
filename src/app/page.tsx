'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CreateThread from '@/components/CreateThread'
import ThreadListNew from '@/components/ThreadListNew'
import PrivateThreadManager from '@/components/PrivateThreadManager'
import { useThreadRefresh } from '@/hooks/useThreadRefresh'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'public' | 'private' | 'create'>('public')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useThreadRefresh(refreshTrigger)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleThreadCreated = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('public')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Social Share</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-300 font-medium hidden sm:block">
                  {user.email?.split('@')[0]}
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex bg-gray-800 p-1 mb-8">
            <button
              onClick={() => setActiveTab('public')}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'public'
                  ? 'bg-gray-900 text-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2v-1a2 2 0 012-2H3.055M9 3v4a2 2 0 002 2v6a2 2 0 002-2V3m-6 8h6" />
                </svg>
                <span>Public Threads</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'private'
                  ? 'bg-gray-900 text-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2v-1a2 2 0 012-2H3.055M9 3v4a2 2 0 002 2v6a2 2 0 002-2V3m-6 8h6" />
                </svg>
                <span>Private Threads</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-gray-900 text-indigo-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Thread</span>
              </span>
            </button>
          </div>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'public' && <ThreadListNew refreshTrigger={refreshTrigger} />}
          {activeTab === 'private' && <PrivateThreadManager />}
          {activeTab === 'create' && <CreateThread onThreadCreated={handleThreadCreated} />}
        </div>
      </main>
    </div>
  )
}
