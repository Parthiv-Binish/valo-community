import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
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

      {/* Desktop navigation rail */}
      <Sidebar />

      {/* Main content
          - Desktop: reserves space for the sidebar
          - Mobile/tablet: uses full width
          - Bottom padding keeps content above the mobile navigation */}
      <main className="relative flex-1 pt-14 lg:pl-56">
        <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <BottomBar />
    </div>
  )
}
