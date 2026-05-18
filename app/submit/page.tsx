'use client'

import { useState } from 'react'
import { submitStreamerLink } from '../services/streamerService'
import { detectPlatform } from '../lib/format'

const EXAMPLES = {
  youtube: ['https://youtube.com/@YourChannel', 'https://www.youtube.com/@creator'],
  kick: ['https://kick.com/username', 'https://kick.com/shroud'],
}

export default function SubmitPage() {
  const [platform, setPlatform] = useState<'youtube' | 'kick'>('youtube')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const detectedPlatform = detectPlatform(url) as 'youtube' | 'kick' | null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setStatus('loading')
    setErrMsg('')

    try {
      await submitStreamerLink({ platform, url: url.trim() })
      setStatus('success')
      setUrl('')
    } catch (err) {
      setErrMsg((err as Error).message || 'Submission failed. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-valo-dark p-6 flex items-center">
        <div className="max-w-md mx-auto text-center animate-fade-in w-full">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Submitted!</h2>
          <p className="text-valo-muted text-sm mb-8 font-body leading-relaxed">
            Your streamer link has been sent to the admin for review. It will appear on the homepage once approved.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStatus('idle')}
              className="valo-btn"
            >
              Submit Another
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-valo-dark p-6">
      <div className="max-w-lg mx-auto animate-fade-in">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-8 bg-valo-red rounded-full" />
            <h1 className="font-display font-bold text-2xl text-white">Submit a Streamer</h1>
          </div>
          <p className="text-valo-muted text-sm font-body leading-relaxed pl-4">
            Know a VALORANT streamer we should feature? Send us their link and our admin will review it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-valo-card border border-valo-border rounded-xl p-6 space-y-5">
          {/* Platform selector */}
          <div>
            <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-3">
              Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['youtube', 'kick'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPlatform(p)
                    setUrl('')
                  }}
                  className={`
                    flex items-center justify-center gap-3 py-3 rounded-lg border-2 transition-all duration-150
                    ${
                      platform === p
                        ? 'border-valo-red bg-valo-red/10'
                        : 'border-valo-border hover:border-valo-muted'
                    }
                  `}
                >
                  <img
                    src={
                      p === 'youtube'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/500px-YouTube_2024.svg.png'
                        : 'https://kick.com/img/kick-logo.svg'
                    }
                    alt={p}
                    className="h-5 object-contain"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span
                    className={`font-display font-semibold capitalize text-sm ${
                      platform === p ? 'text-valo-red' : 'text-valo-muted'
                    }`}
                  >
                    {p}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* URL input */}
          <div>
            <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">
              Streamer Link
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={EXAMPLES[platform][0]}
              required
              className={`input-field ${
                detectedPlatform && detectedPlatform !== platform ? 'border-yellow-500/50' : ''
              }`}
            />
            {detectedPlatform && detectedPlatform !== platform && (
              <p className="text-yellow-400 text-xs mt-1 font-body">
                Looks like a {detectedPlatform} URL — did you mean to select {detectedPlatform}?
              </p>
            )}
            <p className="text-valo-muted text-xs mt-2 font-body">Example: {EXAMPLES[platform][0]}</p>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-sm text-red-300 font-body">
              {errMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !url.trim()}
            className="valo-btn w-full py-3 font-display text-sm tracking-wider"
          >
            {status === 'loading' ? 'Submitting…' : 'Submit for Review'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-4 bg-valo-card/50 border border-valo-border rounded-lg p-4 text-xs text-valo-muted font-body leading-relaxed space-y-1">
          <p className="flex items-start gap-2">
            <span>📋</span> Submissions are reviewed by our admin team.
          </p>
          <p className="flex items-start gap-2">
            <span>✅</span> Approved streamers appear live on the homepage.
          </p>
          <p className="flex items-start gap-2">
            <span>🎮</span> We feature VALORANT content creators only.
          </p>
        </div>
      </div>
    </main>
  )
}
