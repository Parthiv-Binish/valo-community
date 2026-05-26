import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ComingSoonPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 select-none">
      
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Radar Scanning Loop Concept */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-[#ff4655] pointer-events-none"
          />
          <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#ff4655] shadow-xl shadow-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-2xl tracking-wider text-white uppercase">
            MODULE // <span className="text-[#ff4655]">COMING SOON</span>
          </h1>
          <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            Radar scanning for upcoming live nodes
          </p>
        </div>

        {/* Content Body */}
        <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mx-auto font-body">
          This feature matrix is currently under construction inside our staging terminal. Signatures and user tracking systems are coming online soon.
        </p>

        {/* Fallback Home Call To Action Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.97]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Return to Feed
          </Link>
        </div>

      </div>
    </div>
  )
}