import { useEffect, useState } from 'react'

export default function LoadingScreen({ isAppReady }) {
  const [shouldRender, setShouldRender] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isAppReady) {
      setIsExiting(true)

      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isAppReady])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[99999] h-full w-full overflow-hidden bg-[#050505] select-none pointer-events-none font-mono text-white">

      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,70,85,0.10),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(255,70,85,0.05),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* Cinematic split panels */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#050505] border-r border-white/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isExiting ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#ff4655]/40 to-transparent" />
      </div>

      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#050505] border-l border-white/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isExiting ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#ff4655]/40 to-transparent" />
      </div>

      {/* Main cinematic content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-5 py-8 transition-all duration-300 ${
          isExiting ? 'scale-[0.96] opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Background VALO wordmark */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <div className="text-[22vw] font-black uppercase tracking-[0.18em] text-[#ff4655]/[0.018]">
            VALO
          </div>
        </div>

        {/* Top telemetry */}
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-10 sm:right-10 sm:top-8">
          <div className="flex items-center gap-2 text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 sm:text-[8px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.8)] animate-pulse" />
            VCT // COMMUNITY NETWORK
          </div>

          <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/15 sm:text-[8px]">
            SYS.LOC // SCRN_MAIN
          </div>
        </div>

        {/* Brand core */}
        <div className="relative z-10 flex max-w-full flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Outer tactical rings */}
            <div className="pointer-events-none absolute -inset-8 rounded-full border border-[#ff4655]/[0.08] sm:-inset-12" />
            <div className="pointer-events-none absolute -inset-14 rounded-full border border-dashed border-white/[0.035] sm:-inset-20 animate-spin-slow" />

            {/* Crosshair */}
            <div className="pointer-events-none absolute -left-10 top-1/2 h-px w-8 bg-gradient-to-r from-transparent to-[#ff4655]/30 sm:-left-16 sm:w-12" />
            <div className="pointer-events-none absolute -right-10 top-1/2 h-px w-8 bg-gradient-to-l from-transparent to-[#ff4655]/30 sm:-right-16 sm:w-12" />
            <div className="pointer-events-none absolute left-1/2 -top-10 h-8 w-px bg-gradient-to-b from-transparent to-[#ff4655]/30 sm:-top-16 sm:h-12" />
            <div className="pointer-events-none absolute left-1/2 -bottom-10 h-8 w-px bg-gradient-to-t from-transparent to-[#ff4655]/30 sm:-bottom-16 sm:h-12" />

            <img
              src="https://iili.io/Bp6m8Xa.png"
              alt="VALO Community"
              className="relative z-10 h-40 w-40 max-w-[68vw] object-contain sm:h-56 sm:w-56 md:h-[320px] md:w-[320px] animate-pulse-slow clean-native-logo"
            />

            {/* Logo scan beam */}
            <div
              className="absolute inset-y-[-10%] left-[-120%] z-20 w-[70%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                animation: 'tacticalGlint 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1)',
                mixBlendMode: 'screen'
              }}
            />

            <div className="pointer-events-none absolute -inset-10 rounded-full bg-[#ff4655]/10 blur-[70px] sm:-inset-16 sm:blur-[100px]" />
          </div>

          <div className="mt-7 flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.35em] text-white/30 sm:text-[9px]">
            <span className="h-px w-7 bg-[#ff4655]/40 sm:w-10" />
            LIVE · TRACK · PREDICT
            <span className="h-px w-7 bg-[#ff4655]/40 sm:w-10" />
          </div>
        </div>

        {/* Bottom boot console */}
        <div className="absolute bottom-9 z-10 w-[min(88vw,430px)] sm:bottom-12">
          <div className="mb-2 flex items-center justify-between text-[7px] font-bold uppercase tracking-[0.2em] sm:text-[8px]">
            <span className="text-white/25">SYSTEM INITIALIZATION</span>
            <span className="text-[#ff4655]">ONLINE</span>
          </div>

          <div className="relative h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
            <div className="absolute inset-y-0 left-0 w-full origin-left animate-loading-bar bg-gradient-to-r from-[#ff4655]/30 via-[#ff4655] to-white shadow-[0_0_14px_rgba(255,70,85,0.7)]" />
          </div>

          <div className="mt-2 grid grid-cols-3 text-[6px] font-bold uppercase tracking-[0.16em] text-white/15 sm:text-[7px]">
            <span>STREAM GRID</span>
            <span className="text-center">RADAR ENGINE</span>
            <span className="text-right">LIVE FEED</span>
          </div>
        </div>

        {/* HUD corners */}
        <div className="absolute left-5 top-5 h-6 w-6 border-l border-t border-[#ff4655]/30 sm:left-10 sm:top-8 sm:h-8 sm:w-8" />
        <div className="absolute right-5 top-5 h-6 w-6 border-r border-t border-[#ff4655]/15 sm:right-10 sm:top-8 sm:h-8 sm:w-8" />
        <div className="absolute bottom-5 left-5 h-6 w-6 border-b border-l border-white/[0.08] sm:bottom-8 sm:left-10 sm:h-8 sm:w-8" />
        <div className="absolute bottom-5 right-5 h-6 w-6 border-b border-r border-[#ff4655]/30 sm:bottom-8 sm:right-10 sm:h-8 sm:w-8" />

        <div className="absolute bottom-5 left-8 text-[6px] font-bold uppercase tracking-[0.2em] text-white/15 sm:bottom-8 sm:left-16 sm:text-[7px]">
          BOOT SEQUENCE // 01
        </div>
      </div>

      <style>{`
        @keyframes tacticalGlint {
          0% { transform: translateX(-120%) skewX(-25deg); opacity: 0; }
          15% { opacity: 1; }
          38% { transform: translateX(280%) skewX(-25deg); opacity: 0; }
          100% { transform: translateX(280%) skewX(-25deg); opacity: 0; }
        }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.018); }
        }

        @keyframes loadingBar {
          0% { transform: scaleX(0); }
          45% { transform: scaleX(0.45); }
          78% { transform: scaleX(0.82); }
          100% { transform: scaleX(1); }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-pulse-slow {
          animation: pulseSlow 2.2s infinite ease-in-out;
        }

        .animate-loading-bar {
          animation: loadingBar 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }

        .clean-native-logo {
          filter: drop-shadow(0 0 30px rgba(255, 70, 85, 0.32));
          -webkit-filter: drop-shadow(0 0 30px rgba(255, 70, 85, 0.32));
        }

        @media (min-width: 640px) {
          .clean-native-logo {
            filter: drop-shadow(0 0 42px rgba(255, 70, 85, 0.42));
            -webkit-filter: drop-shadow(0 0 42px rgba(255, 70, 85, 0.42));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow,
          .animate-loading-bar,
          .animate-spin-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
