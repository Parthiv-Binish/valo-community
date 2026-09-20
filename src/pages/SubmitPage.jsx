import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { submitStreamerLink } from '../services/streamerService'
import { detectPlatform } from '../utils/format'

const EXAMPLES = {
  youtube: ['https://youtube.com/@YourChannel', 'https://www.youtube.com/@creator'],
  kick: ['https://kick.com/username', 'https://kick.com/shroud'],
}

// Returns an error string, or null when the link is acceptable for the platform.
function validateStreamerUrl(platform, raw) {
  let parsed
  try {
    parsed = new URL(raw)
  } catch {
    return 'That does not look like a valid link. Paste the full URL, including https://'
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    return 'Only http(s) links are accepted.'
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '')
  if (platform === 'youtube') {
    if (host !== 'youtube.com' && host !== 'youtu.be') {
      return 'Please paste a YouTube channel link (youtube.com/@name or youtube.com/channel/…).'
    }
  } else if (platform === 'kick') {
    if (host !== 'kick.com') {
      return 'Please paste a Kick channel link (kick.com/username).'
    }
    if (parsed.pathname.replace(/\//g, '') === '') {
      return 'Include the channel name, e.g. kick.com/username.'
    }
  }
  return null
}

export default function SubmitPage() {
  const [platform, setPlatform] = useState('youtube')
  const [url, setUrl] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  const detectedPlatform = detectPlatform(url)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    if (honeypot) {
      setStatus('success')
      setUrl('')
      return
    }

    const invalid = validateStreamerUrl(platform, url.trim())
    if (invalid) {
      setErrMsg(invalid)
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrMsg('')

    try {
      await submitStreamerLink({ platform, url: url.trim() })
      setStatus('success')
      setUrl('')
    } catch (err) {
      setErrMsg(err.message || 'Submission failed. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

            <div className="relative">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] shadow-[0_0_40px_rgba(74,222,128,0.08)]">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400">
                Transmission Received
              </div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Submitted!
              </h2>
              <p className="mx-auto mt-3 max-w-sm font-mono text-xs leading-6 text-neutral-500">
                Your streamer link has been sent to the admin for review. It will appear on the homepage once approved.
              </p>

              <button
                onClick={() => setStatus('idle')}
                className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white px-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-all hover:bg-neutral-200 active:scale-95"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl animate-fade-in pb-8">

        {/* Header */}
        <section className="relative mb-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_0%,rgba(255,70,85,0.11),transparent_38%),radial-gradient(circle_at_95%_100%,rgba(255,70,85,0.045),transparent_35%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/60 to-transparent" />

          <div className="relative p-5 sm:p-7">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff4655]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.75)]" />
              Community Contribution
            </div>

            <div className="flex items-start gap-4">
              <div className="hidden h-12 w-1 shrink-0 rounded-full bg-[#ff4655] shadow-[0_0_18px_rgba(255,70,85,0.3)] sm:block" />
              <div>
                <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Submit a Streamer
                </h1>
                <p className="mt-2 max-w-xl font-mono text-[11px] leading-5 text-neutral-500 sm:text-xs">
                  Know a VALORANT streamer we should feature? Send us their link and our admin will review it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-5 shadow-2xl shadow-black/20 sm:p-7"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Platform selector */}
          <div>
            <label className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Platform
            </label>

            <div className="grid grid-cols-2 gap-3">
              {['youtube', 'kick'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPlatform(p); setUrl(''); setStatus('idle'); setErrMsg('') }}
                  className={`group relative flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl border transition-all duration-200 ${
                    platform === p
                      ? 'border-[#ff4655]/40 bg-[#ff4655]/[0.07] shadow-[0_0_25px_rgba(255,70,85,0.07)]'
                      : 'border-white/[0.07] bg-[#0d0d0e] hover:border-white/[0.13] hover:bg-[#111112]'
                  }`}
                >
                  {platform === p && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff4655] to-transparent" />
                  )}

                  <img
                    src={p === 'youtube'
                      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930'
                      : 'https://kick.com/img/kick-logo.svg'
                    }
                    alt={p}
                    className="h-5 w-auto object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />

                  <span className={`font-display text-sm font-bold capitalize ${
                    platform === p ? 'text-[#ff4655]' : 'text-neutral-500 group-hover:text-white'
                  }`}>
                    {p}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* URL input */}
          <div className="mt-6">
            <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Streamer Link
            </label>

            <div className={`relative rounded-2xl border transition-all ${
              detectedPlatform && detectedPlatform !== platform
                ? 'border-yellow-500/40 bg-yellow-500/[0.03]'
                : 'border-white/[0.07] bg-[#0d0d0e] focus-within:border-[#ff4655]/40 focus-within:shadow-[0_0_25px_rgba(255,70,85,0.06)]'
            }`}>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-700">
                URL
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (status === 'error') setStatus('idle') }}
                placeholder={EXAMPLES[platform][0]}
                required
                className="w-full bg-transparent py-4 pl-14 pr-4 font-mono text-xs text-white outline-none placeholder:text-neutral-700 sm:text-sm"
              />
            </div>

            {detectedPlatform && detectedPlatform !== platform && (
              <p className="mt-2 flex items-start gap-2 font-mono text-[10px] leading-4 text-yellow-400">
                <span>!</span>
                <span>Looks like a {detectedPlatform} URL — did you mean to select {detectedPlatform}?</span>
              </p>
            )}

            <p className="mt-2 font-mono text-[10px] text-neutral-700">
              Example: <span className="text-neutral-500">{EXAMPLES[platform][0]}</span>
            </p>
          </div>

          {/* Honeypot */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-red-500/15 bg-red-950/20 px-4 py-3.5 text-xs text-red-300">
              <div className="absolute inset-y-0 left-0 w-0.5 bg-red-500/60" />
              <div className="pl-2 font-mono leading-5">
                <span className="mr-2 text-red-400">⚠</span>
                {errMsg}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !url.trim()}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#ff4655]/30 bg-[#ff4655] px-5 font-display text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(255,70,85,0.10)] transition-all hover:bg-[#ff5967] hover:shadow-[0_0_35px_rgba(255,70,85,0.16)] disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-white/[0.04] disabled:text-neutral-600 disabled:shadow-none active:scale-[0.99]"
          >
            {status === 'loading' ? (
              <>
                <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </>
            ) : (
              <>
                Submit for Review
                <span className="ml-2 text-white/60">→</span>
              </>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#09090a]/70 p-4 sm:p-5">
          <div className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-700">
            Submission Protocol
          </div>

          <div className="space-y-3">
            <p className="flex items-start gap-3 font-mono text-[10px] leading-5 text-neutral-500">
              <span className="mt-0.5 shrink-0"><ChecklistIcon /></span>
              <span>Submissions are reviewed by our admin team.</span>
            </p>
            <p className="flex items-start gap-3 font-mono text-[10px] leading-5 text-neutral-500">
              <span className="mt-0.5 shrink-0"><TrueIcon /></span>
              <span>Approved streamers appear live on the homepage.</span>
            </p>
            <p className="flex items-start gap-3 font-mono text-[10px] leading-5 text-neutral-500">
              <span className="mt-0.5 shrink-0"><InfoIcon /></span>
              <span>We feature VALORANT content creators only.</span>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function ChecklistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4M21 12a9 9 0 1 1-18 0" />
    </svg>
  )
}

function TrueIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7M12 20a8 8 0 1 1-16 0 8 8 0 0 1 16 0" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12" y2="16" />
    </svg>
  )
}
