// AboutPage.jsx
import MainLayout from '../layouts/MainLayout'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12">
            <img
              src="https://iili.io/Bp6m8Xa.png"
              alt="VALO Community Logo"
              className="w-50 h-50 rounded-lg object-contain"
            />
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            About <span className="text-valo-red">VALO Community</span>
          </h1>
          <p className="text-valo-muted text-base max-w-2xl mx-auto">
            Building the biggest VALORANT community in Kerala, one streamer at a time.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Mission Card */}
          <div className="bg-valo-card border border-valo-border rounded-xl p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-valo-red rounded-full" />
              Our Mission
            </h2>
            <p className="text-valo-text leading-relaxed">
              VALO Community was founded with a single goal: to unite VALORANT players, streamers, and fans from Kerala
              under one roof. We believe in the power of community, and we're here to showcase the incredible talent
              that Kerala has to offer in the competitive VALORANT scene.
            </p>
          </div>

          {/* Founder Section */}
          <div className="bg-valo-card border border-valo-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Founder Avatar */}
              <div className="shrink-0">
                <img
                  src="https://yt3.googleusercontent.com/r34XL4IzchC6uJDNIVWwYaRI_UJxCQdRoT5K2uacXkgWbkrry-mynYQXiPXyNSNuQsrcMQAu3g=s160-c-k-c0x00ffffff-no-rj"
                  alt="MenAtArms Gaming - Founder"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-valo-red/40"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/120x120/1a1a1a/ff4655?text=MA'
                  }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display font-bold text-xl text-white mb-1">
                  Founded by <span className="text-valo-red">MenAtArms Gaming</span>
                </h2>
                <p className="text-valo-muted text-sm mb-3">
                  Creator & Community Lead
                </p>
                <p className="text-valo-text text-sm leading-relaxed">
                  MenAtArms Gaming is a passionate VALORANT content creator and streamer dedicated to growing
                  the esports ecosystem in Kerala. With years of experience in gaming communities,
                  MenAtArms saw the need for a dedicated platform where Kerala's VALORANT talent could be
                  discovered, celebrated, and connected.
                </p>
                <div className="mt-4 flex justify-center md:justify-start gap-3">
                 
                </div>
              </div>
            </div>
          </div>

          {/* Movement Section */}
          <div className="bg-valo-card border border-valo-border rounded-xl p-6 md:p-8">
            <div className="text-center">
              <div className="inline-block px-4 py-1 rounded-full bg-valo-red/10 border border-valo-red/20 mb-4">
                <span className="text-valo-red font-display font-bold text-sm tracking-wider">
                  #LetsBuildVALOCommunity
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-3">
                A Movement, Not Just a Platform
              </h2>
              <p className="text-valo-text leading-relaxed max-w-2xl mx-auto">
                <span className="font-semibold text-valo-red">#LetsBuildVALOCommunity</span> is more than a hashtag —
                it's a call to action. We're inviting every VALORANT enthusiast, streamer, and fan from Kerala
                to join us in building something extraordinary. Whether you're a seasoned pro or just starting out,
                there's a place for you here.
              </p>
            </div>
          </div>

          {/* Kerala Focus */}
          <div className="bg-valo-card border border-valo-border rounded-xl p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <FlagIcon />
              Proudly from Kerala
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-valo-dark/50">
                <div className="flex justify-center mb-2">
                  <GamepadIcon />
                </div>
                <p className="text-valo-text text-sm font-medium">Showcasing Kerala's VALORANT Talent</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-valo-dark/50">
                <div className="flex justify-center mb-2">
                  <UsersIcon />
                </div>
                <p className="text-valo-text text-sm font-medium">Building Local Connections</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-valo-dark/50">
                <div className="flex justify-center mb-2">
                  <RocketIcon />
                </div>
                <p className="text-valo-text text-sm font-medium">Growing the Esports Ecosystem</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <a
              href="/submit"
              className="valo-btn inline-flex items-center gap-2 px-6 py-3"
            >
              Submit Your Channel
              <ArrowRightIcon />
            </a>
            <div className="flex justify-center items-center gap-2 text-valo-muted text-xs mt-4">
              <MailIconSmall />
              <span>menatarmsclipz@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// SVG Icons
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-valo-red">
      <path d="M6 11h4M8 9v4" />
      <path d="M15 12h.01M18 10h.01" />
      <path d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0z" />
      <path d="M12 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-valo-red">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-valo-red">
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