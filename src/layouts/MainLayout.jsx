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
    </div>
  )
}
