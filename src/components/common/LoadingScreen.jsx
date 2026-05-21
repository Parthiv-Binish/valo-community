import { useEffect, useState } from 'react'

export default function LoadingScreen({ isAppReady }) {
  const [shouldRender, setShouldRender] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isAppReady) {
      // 1. Trigger the cinematic slide/split transition down the middle
      setIsExiting(true)
      
      // 2. Unmount completely from the DOM after the screen wipe completes
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 800)
      
      return () => clearTimeout(timer)
    }
  }, [isAppReady])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 bg-[#000000] z-[99999] overflow-hidden select-none pointer-events-none font-mono w-full h-full">
      
      {/* 🎬 LEFT SPLIT PANEL - PURE DARK TACTICAL VALO BLACK */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#000000] border-r border-[#ff4655]/10 transition-transform duration-700 cubic-bezier(0.85, 0, 0.15, 1)
          ${isExiting ? '-translate-x-full' : 'translate-x-0'}
        `}
      />

      {/* 🎬 RIGHT SPLIT PANEL - PURE DARK TACTICAL VALO BLACK */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#000000] border-l border-[#ff4655]/10 transition-transform duration-700 cubic-bezier(0.85, 0, 0.15, 1)
          ${isExiting ? 'translate-x-full' : 'translate-x-0'}
        `}
      />

      {/* 🎯 CONTENT CONTAINER WRAPPER */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-300
          ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        {/* RED HUD BACKGROUND WATERMARK - Hidden on small mobile screens to prevent visual clutter */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-0 hidden sm:block">
          <h2 className="text-[14vw] font-black text-[#ff4655]/[0.012] tracking-[0.25em] uppercase select-none">
            V A L O
          </h2>
        </div>

        {/* 🌟 SCALED RESPONSIVE LOGO CONTAINER */}
        <div className="relative z-10 mb-8 sm:mb-12 max-w-full flex items-center justify-center">
          
          {/* Main Logo Asset - Responsively scaled across breakpoints from mobile up to desktop */}
          <img
            src="https://iili.io/Bp6m8Xa.png"
            alt="VALO Community"
            className="h-44 w-44 sm:h-64 sm:w-64 md:h-[400px] md:w-[400px] max-w-[85vw] object-contain relative z-10 animate-pulse-slow clean-native-logo"
          />
          
          {/* Angled Dark Red Light Shimmer Interceptor Beam */}
          <div 
            className="absolute inset-0 z-20 w-[300%] h-full bg-gradient-to-r from-transparent via-[#ff4655]/25 to-transparent pointer-events-none"
            style={{ 
              animation: 'tacticalGlint 2.4s infinite cubic-bezier(0.4, 0, 0.2, 1)',
              mixBlendMode: 'color-dodge'
            }}
          />

          {/* Volumetric Red Ambient Glow Backing (Adjusted blur to keep responsive rendering fast) */}
          <div className="absolute inset-[-10px] sm:inset-[-20px] bg-[#ff4655]/15 blur-[60px] sm:blur-[100px] rounded-full z-0 pointer-events-none" />
        </div>

        {/* 🛠️ BOTTOM RED HUD PROGRESS LOADING BAR */}
        <div className="absolute bottom-12 sm:bottom-16 flex flex-col items-center gap-3 z-10 px-4 w-full max-w-xs sm:max-w-none">
          
          {/* Responsive Width Progress Track Container */}
          <div className="w-full sm:w-64 h-[2px] bg-[#ff4655]/10 relative overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 bg-[#ff4655] w-full origin-left animate-loading-bar shadow-[0_0_10px_#ff4655]" />
          </div>

          {/* Real-time Loading Status Meta Layout */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5 text-[#ff4655]/40 text-[8px] sm:text-[9px] tracking-[0.25em] font-bold uppercase text-center">
            <span className="w-1.5 h-1.5 bg-[#ff4655] inline-block animate-pulse shrink-0 hidden sm:block" />
            <span>Establishing Agent Interface</span>
            <span className="text-[#ff4655]/20">//</span>
            <span className="text-[#ff4655]">0% // 100%</span>
          </div>

        </div>

        {/* 📐 VALORANT RED HUD CORNER ANGLES - Inward spacing scales down smoothly on mobile */}
        <div className="absolute top-6 left-6 sm:top-12 sm:left-12 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-[#ff4655]/20" />
        <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-[#ff4655]/20" />
        
        {/* Red Decorative Grid Coordinate Meta Labels */}
        <div className="absolute top-6 right-6 sm:top-12 sm:right-12 text-[8px] sm:text-[9px] text-[#ff4655]/15 tracking-widest select-none uppercase font-bold">
          SYS.LOC // SCRN_MAIN
        </div>
        <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 text-[8px] sm:text-[9px] text-[#ff4655]/15 tracking-widest select-none uppercase font-bold hidden xs:block">
          AUTHENTICATING...
        </div>

      </div>

      {/* 💡 CUSTOM TACTICAL STYLING & ANIMATIONS PIPELINES */}
      <style>{`
        @keyframes tacticalGlint {
          0% { transform: translateX(-150%) skewX(-25deg); }
          30% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite ease-in-out;
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes loadingBar {
          0% { transform: scaleX(0); }
          40% { transform: scaleX(0.4); }
          75% { transform: scaleX(0.85); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loadingBar 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        
        .clean-native-logo {
          filter: drop-shadow(0px 0px 30px rgba(255, 70, 85, 0.35));
          -webkit-filter: drop-shadow(0px 0px 30px rgba(255, 70, 85, 0.35));
        }
        @media (min-width: 640px) {
          .clean-native-logo {
            filter: drop-shadow(0px 0px 40px rgba(255, 70, 85, 0.45));
            -webkit-filter: drop-shadow(0px 0px 40px rgba(255, 70, 85, 0.45));
          }
        }
      `}</style>

    </div>
  )
}
