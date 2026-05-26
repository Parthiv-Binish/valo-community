import { motion } from 'framer-motion'

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 bg-[#060607] flex flex-col items-center justify-center px-4 select-none z-50 overflow-hidden">
      
      {/* Immersive Gaming Ambient Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181c_1px,transparent_1px),linear-gradient(to_bottom,#18181c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent animate-pulse" />

      {/* Main Tactical UI Container Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="relative max-w-md w-full bg-[#0c0d10] border border-neutral-800 p-8 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Valorant-Style Outer Corner Bracket Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff4655]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff4655]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neutral-700" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neutral-700" />

        {/* Diagonal Tech-Strip Pattern Header background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-gradient-to-r from-transparent via-[#ff4655] to-transparent" />

        <div className="text-center space-y-6 relative z-10">
          
          {/* Animated Neon Warning Node Badge */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute inset-0 border border-dashed border-[#ff4655]/20 rounded-full"
            />
            <div className="w-12 h-12 bg-[#ff4655]/10 border border-[#ff4655]/40 rounded-none flex items-center justify-center text-[#ff4655] transform rotate-45 shadow-[0_0_20px_rgba(255,70,85,0.15)]">
              <span className="transform -rotate-45 font-mono font-black text-xl">!</span>
            </div>
          </div>

          {/* Valorant Font Styled Headers */}
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl tracking-widest text-white uppercase flex items-center justify-center gap-2">
              SYSTEM // <span className="text-[#ff4655]">OFFLINE</span>
            </h1>
            <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
              Index Connection Interrupted // Code: 503
            </p>
          </div>

          {/* Information Feed Box */}
          <div className="bg-black/60 border border-neutral-900 p-4 rounded-none relative">
            <div className="absolute left-0 inset-y-0 w-[2px] bg-[#ff4655]" />
            <p className="text-neutral-400 font-mono text-[11px] uppercase tracking-wide text-left leading-relaxed">
              Admins are restructuring cloud tables and optimizing scraper vectors. Node firewalls are closed to normal user traffic.
            </p>
          </div>

          {/* Diagnostic Loading Sweep Bar */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-neutral-950 border border-neutral-900 p-[1px] relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#ff4655] to-transparent"
              />
            </div>
            <div className="w-full flex items-center justify-between font-mono text-[8px] text-neutral-600 tracking-wider uppercase font-bold">
              <span>Sync Status: RETRYING</span>
              <span>MAAC_SYS_OVERRIDE</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}