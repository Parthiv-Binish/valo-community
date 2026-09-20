// AboutPage.jsx
import MainLayout from '../layouts/MainLayout'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12 animate-fade-in">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,70,85,0.13),transparent_42%),radial-gradient(circle_at_0%_100%,rgba(255,70,85,0.05),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/70 to-transparent" />

          <div className="relative flex flex-col items-center px-5 py-10 text-center sm:px-8 sm:py-14">
            <div className="mb-6 flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff4655]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
              Community // Kerala // VALORANT
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
            </div>

            <div className="relative mb-7 flex h-32 w-32 items-center justify-center rounded-3xl border border-white/[0.08] bg-black/40 shadow-[0_0_50px_rgba(255,70,85,0.08)] sm:h-40 sm:w-40">
              <div className="absolute inset-2 rounded-2xl border border-[#ff4655]/10" />
              <img
                src="https://iili.io/Bp6m8Xa.png"
                alt="VALO Community Logo"
                className="relative h-28 w-28 rounded-2xl object-contain sm:h-36 sm:w-36"
              />
            </div>

            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              About <span className="text-[#ff4655]">VALO Community</span>
            </h1>

            <p className="mt-4 max-w-2xl font-mono text-[11px] leading-6 text-neutral-500 sm:text-xs">
              Building the biggest VALORANT community in Kerala, one streamer at a time.
            </p>

            <div className="mt-7 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700">
              <span className="h-px w-8 bg-white/10" />
              #LetsBuildVALOCommunity
              <span className="h-px w-8 bg-white/10" />
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mt-5 space-y-5">

          {/* Mission */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-5 sm:p-7">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ff4655]/[0.045] blur-3xl" />

            <SectionEyebrow>01 // Mission</SectionEyebrow>
            <h2 className="mt-2 flex items-center gap-3 font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
              <span className="h-6 w-1 rounded-full bg-[#ff4655] shadow-[0_0_14px_rgba(255,70,85,0.35)]" />
              Our Mission
            </h2>
            <p className="relative mt-4 max-w-3xl font-body text-sm leading-7 text-neutral-400">
              VALO Community was founded with a single goal: to unite VALORANT players, streamers, and fans from Kerala
              under one roof. We believe in the power of community, and we're here to showcase the incredible talent
              that Kerala has to offer in the competitive VALORANT scene.
            </p>
          </section>

          {/* Founder */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/25 to-transparent" />

            <SectionEyebrow>02 // Origin</SectionEyebrow>

            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-full border border-[#ff4655]/10" />
                <div className="absolute -inset-4 rounded-full border border-[#ff4655]/[0.04]" />
                <img
                  src="https://yt3.googleusercontent.com/r34XL4IzchC6uJDNIVWwYaRI_UJxCQdRoT5K2uacXkgWbkrry-mynYQXiPXyNSNuQsrcMQAu3g=s160-c-k-c0x00ffffff-no-rj"
                  alt="MenAtArms Gaming - Founder"
                  className="relative h-24 w-24 rounded-full border-2 border-[#ff4655]/40 object-cover shadow-[0_0_35px_rgba(255,70,85,0.08)] sm:h-28 sm:w-28"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/120x120/1a1a1a/ff4655?text=MA'
                  }}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700">
                  Founder / Community Lead
                </div>
                <h2 className="mt-1 font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                  MenAtArms <span className="text-[#ff4655]">Gaming</span>
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                  Creator & Community Lead
                </p>
                <p className="mt-4 font-body text-sm leading-7 text-neutral-400">
                  MenAtArms Gaming is a passionate VALORANT content creator and streamer dedicated to growing
                  the esports ecosystem in Kerala. With years of experience in gaming communities,
                  MenAtArms saw the need for a dedicated platform where Kerala's VALORANT talent could be
                  discovered, celebrated, and connected.
                </p>
              </div>
            </div>
          </section>

          {/* Movement */}
          <section className="relative overflow-hidden rounded-3xl border border-[#ff4655]/10 bg-[#0a090a] p-6 text-center sm:p-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,70,85,0.08),transparent_52%)]" />

            <div className="relative">
              <div className="inline-flex rounded-full border border-[#ff4655]/20 bg-[#ff4655]/[0.06] px-4 py-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff4655]">
                  #LetsBuildVALOCommunity
                </span>
              </div>

              <h2 className="mt-5 font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                A Movement, Not Just a Platform
              </h2>

              <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-neutral-400">
                <span className="font-semibold text-[#ff4655]">#LetsBuildVALOCommunity</span> is more than a hashtag —
                it's a call to action. We're inviting every VALORANT enthusiast, streamer, and fan from Kerala
                to join us in building something extraordinary. Whether you're a seasoned pro or just starting out,
                there's a place for you here.
              </p>
            </div>
          </section>

          {/* Kerala Focus */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-5 sm:p-7">
            <SectionEyebrow>03 // Focus</SectionEyebrow>

            <h2 className="mt-2 flex items-center gap-3 font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
              <span className="text-[#ff4655]"><FlagIcon /></span>
              Proudly from Kerala
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <FocusCard
                icon={<GamepadIcon />}
                title="Showcasing Kerala's VALORANT Talent"
              />
              <FocusCard
                icon={<UsersIcon />}
                title="Building Local Connections"
              />
              <FocusCard
                icon={<RocketIcon />}
                title="Growing the Esports Ecosystem"
              />
            </div>
          </section>

          {/* Contact */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] px-5 py-6 sm:px-7">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-700">
                  Community Contact
                </div>
                <div className="mt-1 font-display text-sm font-bold uppercase tracking-wide text-white">
                  Want to connect?
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500">
                <span className="text-[#ff4655]"><MailIconSmall /></span>
                <span className="break-all">menatarmsclipz@gmail.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

function SectionEyebrow({ children }) {
  return (
    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#ff4655]/80">
      {children}
    </div>
  )
}

function FocusCard({ icon, title }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0d0d0e] p-5 text-center transition-all hover:border-[#ff4655]/15 hover:bg-[#101011]">
      <div className="mb-3 flex justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
        {icon}
      </div>
      <p className="font-mono text-[10px] font-bold uppercase leading-5 tracking-wide text-neutral-400 group-hover:text-white">
        {title}
      </p>
    </div>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function MailIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function GamepadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ff4655]">
      <path d="M6 11h4M8 9v4" />
      <path d="M15 12h.01M18 10h.01" />
      <path d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0z" />
      <path d="M12 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ff4655]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ff4655]">
      <path d="M12 15v5l3 3 3-3v-5" />
      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19 9l3 3-3 3" />
      <path d="M5 9l-3 3 3 3" />
      <path d="M12 6v3" />
      <path d="M12 18v-3" />
      <path d="M9 12H6" />
      <path d="M18 12h-3" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
