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
    <div className="fixed inset-0 bg-[#000000] z-[99999] overflow-hidden select-none pointer-events-none font-mono">
      
      {/* 🎬 LEFT SPLIT PANEL - PURE TRUE PITCH BLACK */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#000000] border-r border-[#ff4655]/10 transition-transform duration-700 cubic-bezier(0.85, 0, 0.15, 1)
          ${isExiting ? '-translate-x-full' : 'translate-x-0'}
        `}
      />

      {/* 🎬 RIGHT SPLIT PANEL - PURE TRUE PITCH BLACK */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#000000] border-l border-[#ff4655]/10 transition-transform duration-700 cubic-bezier(0.85, 0, 0.15, 1)
          ${isExiting ? 'translate-x-full' : 'translate-x-0'}
        `}
      />

      {/* 🎯 RADAR CONTAINER CONTENT */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300
          ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        {/* PURE CRIMSON RED HUD BACKGROUND WATERMARK */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-0">
          <h2 className="text-[14vw] font-black text-[#ff4655]/[0.012] tracking-[0.25em] uppercase select-none">
            V A L O
          </h2>
        </div>

        {/* 🌟 ULTRA-SCALE MASSIVE LOGO CONTAINER */}
        <div className="relative z-10 mb-6 max-w-lg md:max-w-3xl">
          
          {/* Main Presentational Logo Graphics Asset (Color-Untouched Native Look) */}
          <img
            src="https://iili.io/Bp6m8Xa.png"
            alt="VALO Community"
            className="h-72 w-72 md:h-[400px] md:w-[400px] object-contain relative z-10 animate-pulse-slow clean-native-logo"
          />
          
          {/* Angled Dark Red Light Shimmer Interceptor Beam */}
          <div 
            className="absolute inset-0 z-20 w-[300%] h-full bg-gradient-to-r from-transparent via-[#ff4655]/25 to-transparent pointer-events-none"
            style={{ 
              animation: 'tacticalGlint 2.4s infinite cubic-bezier(0.4, 0, 0.2, 1)',
              mixBlendMode: 'color-dodge'
            }}
          />

          {/* Volumetric Red Ambient Glow Backing behind the transparency */}
          <div className="absolute inset-[-20px] bg-[#ff4655]/15 blur-[100px] rounded-full z-0 pointer-events-none" />
        </div>

        {/* 🛠️ BOTTOM RED HUD PROGRESS LOADING BAR */}
        <div className="absolute bottom-16 flex flex-col items-center gap-3 z-10">
          
          {/* Tactical Red Progress Bar */}
          <div className="w-64 h-[2px] bg-[#ff4655]/10 relative overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 bg-[#ff4655] w-full origin-left animate-loading-bar shadow-[0_0_10px_#ff4655]" />
          </div>

          {/* Real-time Loading Status Meta Layout */}
          <div className="flex items-center gap-2 text-[#ff4655]/40 text-[9px] tracking-[0.25em] font-bold uppercase">
            <span className="w-1.5 h-1.5 bg-[#ff4655] inline-block animate-pulse shrink-0" />
            <span>Establishing Agent Interface</span>
            <span className="text-[#ff4655]/20">//</span>
            <span className="text-[#ff4655]">0% // 100%</span>
          </div>

        </div>

        {/* 📐 HIGH-CONTRAST VALORANT RED HUD CORNER ANGLES */}
        <div className="absolute top-12 left-12 w-6 h-6 border-t-2 border-l-2 border-[#ff4655]/30" />
        <div className="absolute bottom-12 right-12 w-6 h-6 border-b-2 border-r-2 border-[#ff4655]/30" />
        
        {/* Red Decorative Grid coordinate tags */}
        <div className="absolute top-12 right-12 text-[9px] text-[#ff4655]/15 tracking-widest select-none uppercase font-bold">
          SYS.LOC // SCRN_MAIN_v2.6
        </div>
        <div className="absolute bottom-12 left-12 text-[9px] text-[#ff4655]/15 tracking-widest select-none uppercase font-bold">
          AUTHENTICATING CREDENTIALS...
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
        
        /* Hardware accelerated clean look with native logo profiles */
        .clean-native-logo {
          filter: drop-shadow(0px 0px 40px rgba(255, 70, 85, 0.45));
          -webkit-filter: drop-shadow(0px 0px 40px rgba(255, 70, 85, 0.45));
        }
      `}</style>

    </div>
  )
}
