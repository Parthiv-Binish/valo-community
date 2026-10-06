import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import BottomBar from '../components/layout/BottomBar'
import AnnouncementModal from '../components/ui/AnnouncementModal'

export default function MainLayout({ children }) {
  const [, setSearchParams] = useSearchParams()

  const handleSearch = (query) => {
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <div className="min-h-screen bg-valo-dark text-white flex flex-col overflow-x-hidden">
      <AnnouncementModal />

      <Navbar onSearch={handleSearch} />

      {/* Full-width content — desktop sidebar removed */}
      <main className="relative flex-1 pt-14 sm:pt-16">
        <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 pb-24 lg:pb-10">
          {children}
        </div>
      </main>

      <BottomBar />
      <SiteFooter />
    </div>
  )
}


function SiteFooter(){
 return <footer className="border-t border-white/[.06] bg-[#050505] px-4 py-8 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-[1800px]">
   <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
    <div className="max-w-sm"><div className="font-display text-xs font-black uppercase tracking-[.18em] text-white">LET'S BUILD <span className="text-[#ff4655]">VALO</span></div><p className="mt-2 text-xs leading-5 text-neutral-600">A community platform for VALORANT players, creators and stream watchers.</p></div>
    <nav className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
     {[['Community','/posts'],['Live','/'],['Leaderboard','/leaderboard'],['Help','/help'],['Contact','/contact'],['System Status','/status'],['Guidelines','/community-guidelines'],['Content Policy','/content-policy'],['Privacy','/privacy'],['Terms','/terms'],['Cookies','/cookies'],['Report','/report']].map(([label,to])=><a key={to} href={to} className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 transition hover:text-white">{label}</a>)}
    </nav>
   </div>
   <div className="mt-7 flex flex-col gap-2 border-t border-white/[.05] pt-4 text-[9px] font-mono uppercase tracking-wider text-neutral-700 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Let's Build VALO Community</span><span>Built for the community</span></div>
  </div>
 </footer>
}
