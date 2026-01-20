'use client'

import { useState, useRef, useEffect } from 'react'

interface CustomAudioPlayerProps {
    src: string
}

export default function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const setAudioData = () => {
            setDuration(audio.duration)
            setCurrentTime(audio.currentTime)
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime)

        // Events
        audio.addEventListener('loadedmetadata', setAudioData)
        audio.addEventListener('timeupdate', setAudioTime)
        audio.addEventListener('ended', () => setIsPlaying(false))

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData)
            audio.removeEventListener('timeupdate', setAudioTime)
        }
    }, [])

    const togglePlayPause = () => {
        const prevValue = isPlaying
        setIsPlaying(!prevValue)
        if (!prevValue) {
            audioRef.current?.play()
        } else {
            audioRef.current?.pause()
        }
    }

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value)
        setCurrentTime(time)
        if (audioRef.current) {
            audioRef.current.currentTime = time
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="w-full bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-inner">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center space-x-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <div className="flex-grow space-y-2">
                    {/* Progress Bar */}
                    <div className="relative group">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                        />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Mute/Volume (Visual only for now or could be extended) */}
                <div className="hidden sm:flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
