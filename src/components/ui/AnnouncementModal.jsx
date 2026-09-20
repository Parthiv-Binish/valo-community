// src/components/ui/AnnouncementModal.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    async function fetchLatestAnnouncement() {
      try {
        // Fetch the single latest active announcement from Supabase
        const { data, error } = await supabase
          .from('site_announcements')
          .select('version_key, title, subtitle, body_text')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error || !data) return

        // Check if the local user browser has already closed this version target
        const hasSeenCurrentVersion = localStorage.getItem(data.version_key)

        if (!hasSeenCurrentVersion) {
          setContent(data)
          setIsOpen(true)
        }
      } catch (err) {
        console.error('Failed to resolve database announcement query parameters:', err)
      }
    }

    fetchLatestAnnouncement()
  }, [])

  const handleClose = () => {
    if (content?.version_key) {
      // Pin this dynamic database version tracking key inside localStorage
      localStorage.setItem(content.version_key, 'true')
    }
    setIsOpen(false)
  }

  if (!isOpen || !content) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
    >
      {/* Atmospheric red HUD glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4655]/10 blur-[90px]" />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0a0a]/95 shadow-[0_24px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {/* Top HUD line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#ff4655] to-transparent" />

        {/* Header */}
        <div className="relative px-5 pb-4 pt-6 sm:px-7 sm:pb-5 sm:pt-7">
          <div className="flex items-start gap-4 pr-8">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ff4655]/25 bg-[#ff4655]/10 text-[#ff4655] shadow-[0_0_30px_rgba(255,70,85,0.08)] sm:h-14 sm:w-14">
              <div className="absolute inset-1 rounded-lg border border-[#ff4655]/10" />
              <MegaphoneIcon />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="mb-1 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#ff4655]">
                Community Update
              </p>

              <h2
                id="announcement-title"
                className="font-display text-xl font-black uppercase leading-tight tracking-tight text-white sm:text-2xl"
              >
                {content.title}
              </h2>

              {content.subtitle && (
                <p className="mt-1.5 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  {content.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-neutral-500 transition-all hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white active:scale-95 sm:right-5 sm:top-5"
            title="Close"
            aria-label="Close announcement"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Dynamic announcement body */}
        <div className="mx-5 min-h-0 overflow-y-auto border-y border-white/[0.06] px-1 py-5 sm:mx-7 sm:py-6">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-4 sm:px-5">
            <p className="whitespace-pre-line font-body text-sm leading-7 text-neutral-300 sm:text-[15px]">
              {content.body_text}
            </p>
          </div>
        </div>

        {/* Footer action */}
        <div className="px-5 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-5">
          <button
            onClick={handleClose}
            className="group relative w-full overflow-hidden rounded-xl border border-[#ff4655]/30 bg-[#ff4655] px-4 py-3 font-display text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(255,70,85,0.14)] transition-all duration-200 hover:border-[#ff4655]/70 hover:shadow-[0_12px_35px_rgba(255,70,85,0.22)] active:scale-[0.99]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative z-10">Got It, Let's Go!</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function MegaphoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2zM11.6 16.8 9 22H4l2.5-5M3 11h3v2H3z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
