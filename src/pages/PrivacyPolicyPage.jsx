import MainLayout from '../layouts/MainLayout'

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 25, 2026"

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8 sm:space-y-10 animate-fade-in text-neutral-300 font-body text-sm leading-relaxed">
        
        {/* ── HEADER BLOCK ────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/[0.07] pb-6 sm:pb-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-valo-red/10 blur-3xl" />
          <div className="pointer-events-none absolute left-10 bottom-0 h-px w-40 bg-gradient-to-r from-transparent via-valo-red/70 to-transparent" />
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-[0.12em] text-white uppercase flex items-center gap-3">
            <span className="w-1.5 sm:w-2 h-8 sm:h-10 bg-valo-red rounded-full inline-block shadow-[0_0_18px_rgba(255,70,85,0.5)]" />
            PRIVACY // <span className="text-valo-red">POLICY</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-[0.18em] mt-2 pl-5 sm:pl-6">
            PROJECT ARCHITECTURE CODE: MAAC-FULL-PP // LAST SYNCHRONIZED: {lastUpdated}
          </p>
        </div>

        {/* ── INTRODUCTION ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white/[0.025] border border-white/[0.07] p-5 sm:p-6 lg:p-7 rounded-2xl space-y-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
          <p>
            This Privacy Policy governs the operations framework of <span className="text-white font-bold"> Let's Build Valo Community</span> ("the Platform"). It outlines how our system processes, normalizes, and secures user information across our entire web database, live streaming tracking grids, background scrapers, and analytics interfaces.
          </p>
          <p>
            By authenticating an account or interacting with our tactical broadcast dashboard matrix, you consent to the data operations loops defined below.
          </p>
        </section>

        {/* ── CORECTED SECTION 1 ───────────────────────────────────────── */}
        <section className="space-y-4 sm:space-y-5">
          <h2 className="text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.12em] flex items-center gap-2 font-mono">
            <span className="text-valo-red font-mono">// 01.</span> THE GLOBAL DATA LEDGER
          </h2>
          <div className="h-px bg-white/[0.07] w-full" />
          <p>Our platform handles four essential groups of structural information vectors:</p>
          
          <div className="space-y-3 pl-2">
            <div className="border-l-2 border-valo-red/30 pl-4 py-2 rounded-r-xl bg-white/[0.018] hover:bg-white/[0.03] transition-colors">
              <strong className="text-neutral-100 uppercase text-[10px] sm:text-xs font-mono tracking-[0.12em] block mb-1">A. User & Profile Nodes</strong>
              <p className="text-xs sm:text-[13px] text-neutral-400">
                When signing up, we record your email string, account handle, and designated administrative clearance level (<code className="text-neutral-300 bg-neutral-950 px-1 py-0.5 rounded">role: admin/user</code>) securely managed via Supabase cryptographic database endpoints.
              </p>
            </div>
            
            <div className="border-l-2 border-valo-red/30 pl-4 py-2 rounded-r-xl bg-white/[0.018] hover:bg-white/[0.03] transition-colors">
              <strong className="text-neutral-100 uppercase text-[10px] sm:text-xs font-mono tracking-[0.12em] block mb-1">B. Scraper & Streaming Aggregations</strong>
              <p className="text-xs sm:text-[13px] text-neutral-400">
                Our background indexing scripts constantly scan platform servers (YouTube and Kick API clusters) every 60 seconds to aggregate public media indicators: stream titles, live status flags (<code className="text-neutral-300 bg-neutral-950 px-1 py-0.5 rounded">is_live</code>), viewer metrics, thumbnail images, and live broadcast references.
              </p>
            </div>

            <div className="border-l-2 border-valo-red/30 pl-4 py-2 rounded-r-xl bg-white/[0.018] hover:bg-white/[0.03] transition-colors">
              <strong className="text-neutral-100 uppercase text-[10px] sm:text-xs font-mono tracking-[0.12em] block mb-1">C. Subscription Registry</strong>
              <p className="text-xs sm:text-[13px] text-neutral-400">
                We record the relation records connecting your user ID to target streaming identifiers. This includes mapping your pins back to raw text strings, usernames, or unique channel keys (e.g., YouTube channel tokens or Kick profile handles).
              </p>
            </div>

            <div className="border-l-2 border-valo-red/30 pl-4 py-2 rounded-r-xl bg-white/[0.018] hover:bg-white/[0.03] transition-colors">
              <strong className="text-neutral-100 uppercase text-[10px] sm:text-xs font-mono tracking-[0.12em] block mb-1">D. Monetization Telemetry</strong>
              <p className="text-xs sm:text-[13px] text-neutral-400">
                We measure impressions and click ratios across injected internal promotional modules (<code className="text-neutral-300 bg-neutral-950 px-1 py-0.5 rounded">Tactical Banners</code>). These calculations are non-identifying and help track sponsorship visibility performance loops.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 ───────────────────────────────────────────────── */}
        <section className="space-y-4 sm:space-y-5">
          <h2 className="text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.12em] flex items-center gap-2 font-mono">
            <span className="text-valo-red font-mono">// 02.</span> HOW SYSTEM PIPELINES UTILIZE YOUR DATA
          </h2>
          <div className="h-px bg-white/[0.07] w-full" />
          <p>Let's Build Valo Community triggers your data variables to drive our real-time core mechanics:</p>
          
          <ul className="list-none space-y-3 pl-4 font-mono text-xs sm:text-[13px] text-neutral-400">
            <li className="flex items-start gap-3">
              <span className="text-valo-red shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(255,70,85,0.35)]">▶</span>
              <span><strong className="text-neutral-200">Unified Streaming grids:</strong> Synchronizes live streams and standby segments seamlessly into responsive layouts based on your selected platform filters.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-valo-red shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(255,70,85,0.35)]">▶</span>
              <span><strong className="text-neutral-200">Intelligent Habitation Radar:</strong> Gathers log entry records to calculate week and hour trends, plotting a calendar of streaming probabilities ($0\%$ to $100\%$) for channels you follow.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-valo-red shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(255,70,85,0.35)]">▶</span>
              <span><strong className="text-neutral-200">Automated Alert Transmissions:</strong> Processes email configurations (<code className="text-neutral-300 bg-neutral-950 px-1 font-bold">should_trigger_email</code>) to immediately route notification messages the moment a monitored creator transmits a live loop.</span>
            </li>
          </ul>
        </section>

        {/* ── SECTION 3 ───────────────────────────────────────────────── */}
        <section className="space-y-4 sm:space-y-5">
          <h2 className="text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.12em] flex items-center gap-2 font-mono">
            <span className="text-valo-red font-mono">// 03.</span> COOKIES AND APPLICATION SESSION STORAGE
          </h2>
          <div className="h-px bg-white/[0.07] w-full" />
          <p>
            We use programmatic state variables to optimize interactive user flows and respect layout dismissals:
          </p>
          <div className="bg-neutral-950/60 border border-neutral-900 p-4 rounded-xl space-y-2 font-mono text-xs sm:text-[13px] text-neutral-400">
            <p>
              <span className="text-white font-bold">[SYSTEM CACHE COMPLIANCE]:</span> When you interact with inline YouTube-style advertisement items and trigger the <span className="text-neutral-200">"Cancel"</span> function, our system writes an explicit dismissal key inside your browser's <code className="text-neutral-300 bg-neutral-950 px-1">sessionStorage</code> memory.
            </p>
            <p>
              This ensures that once an ad card is closed, it remains hidden across all feed views for the remainder of your browsing loop, preventing layout redundancy without writing persistent tracker cookies onto your storage disks.
            </p>
          </div>
        </section>

        {/* ── SECTION 4 ───────────────────────────────────────────────── */}
        <section className="space-y-4 sm:space-y-5">
          <h2 className="text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.12em] flex items-center gap-2 font-mono">
            <span className="text-valo-red font-mono">// 04.</span> REGINAL SECURITY & DATA ISOLATION
          </h2>
          <div className="h-px bg-white/[0.07] w-full" />
          <p>
            All network transactions executing against platform tables (<code className="text-neutral-300 bg-neutral-950 px-1 font-bold">streamers</code>, <code className="text-neutral-300 bg-neutral-950 px-1 font-bold">streamer_data</code>, <code className="text-neutral-300 bg-neutral-950 px-1 font-bold">stream_history_logs</code>) are guarded by PostgreSQL database rules. 
          </p>
          <p>
            Our frontend logic uses defensive type-cast parsing routines to convert incoming parameter strings (such as mixed platform handle strings) into valid, protected keys before queries execute. This keeps your account completely safe from malicious syntax injection vectors or structural cross-user leakage.
          </p>
        </section>

        {/* ── SECTION 5 ───────────────────────────────────────────────── */}
        <section className="space-y-4 sm:space-y-5">
          <h2 className="text-white font-display font-black text-sm sm:text-base uppercase tracking-[0.12em] flex items-center gap-2 font-mono">
            <span className="text-valo-red font-mono">// 05.</span> DE-REGISTRATION & PROFILE WIPING
          </h2>
          <div className="h-px bg-white/[0.07] w-full" />
          <p>
            You retain absolute authority over your tracking markers. You can toggle email alerts off instantly from your dashboard, remove channel links, or choose to delete your account entirely. Erasing your account completely wipes your user profile, configurations, and saved subscription logs from our active storage clusters.
          </p>
        </section>

        {/* ── FOOTER CONTACT ──────────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-6 mt-10 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-[0.12em]">
          <span>© {new Date().getFullYear()} Let's Build Valo Community Team</span>
          <span>Security & Matrix Support // menatarmsclipz@gmail.com</span>
        </div>

      </div>
    </MainLayout>
  )
}
