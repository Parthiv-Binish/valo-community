import { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Icon from './Icon'

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogg)(?:[?#]|$)/i
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif|avif|bmp|svg)(?:[?#]|$)/i

function resolveUrl(value) {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const clean = value
    .replace(/^\/+/, '')
    .replace(/^community-media\//i, '')
  return supabase.storage.from('community-media').getPublicUrl(clean).data.publicUrl
}

function isVideoUrl(url) {
  try {
    return VIDEO_EXTENSIONS.test(new URL(url).pathname)
  } catch {
    return VIDEO_EXTENSIONS.test(url)
  }
}

export default function PostMedia({ url, mediaType, compact = false }) {
  const [failed, setFailed] = useState(false)
  const resolved = useMemo(() => resolveUrl(url), [url])
  if (!resolved || failed) {
    if (!url) return null
    return (
      <div className={`flex min-h-32 items-center justify-center bg-[#09090d] px-5 text-center ${compact ? 'max-h-48' : ''}`}>
        <div>
          <Icon name="image" size={22} className="mx-auto text-neutral-700" />
          <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-neutral-600">Media unavailable</p>
        </div>
      </div>
    )
  }

  const video = mediaType === 'video' || isVideoUrl(resolved) || (!mediaType && !IMAGE_EXTENSIONS.test(resolved))
  return (
    <div className="relative overflow-hidden border-y border-white/[.06] bg-black">
      {video ? (
        <video
          src={resolved}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className={`mx-auto block max-h-[680px] w-full object-contain ${compact ? 'max-h-72' : ''}`}
        />
      ) : (
        <img
          src={resolved}
          alt="Post media"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`mx-auto block max-h-[680px] w-full object-contain ${compact ? 'max-h-72' : ''}`}
        />
      )}
    </div>
  )
}
