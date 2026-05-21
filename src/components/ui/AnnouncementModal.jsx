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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-valo-card border border-valo-border rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-valo-red" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-900"
          title="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center text-center mt-2 space-y-3">
          <div className="w-12 h-12 rounded-full bg-valo-red/10 border border-valo-red/30 flex items-center justify-center text-valo-red shadow-inner">
            <MegaphoneIcon />
          </div>
          
          <div className="space-y-1">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-xs text-valo-red font-display font-bold uppercase tracking-wider">
                {content.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Text Body Paragraph Frame Container */}
        <div className="mt-4 my-2 overflow-y-auto pr-1 text-sm text-neutral-300 space-y-3 font-body leading-relaxed border-t border-neutral-800/60 pt-4">
          <p className="whitespace-pre-line text-center sm:text-left">
            {content.body_text}
          </p>
        </div>

        <div className="mt-5">
          <button
            onClick={handleClose}
            className="w-full bg-valo-red hover:bg-valo-red/90 text-white font-display font-bold uppercase text-sm py-2.5 rounded-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
          >
            Got It, Let's Go!
          </button>
        </div>

      </div>
    </div>
  )
}

function MegaphoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2zM11.6 16.8 9 22H4l2.5-5M3 11h3v2H3z"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}