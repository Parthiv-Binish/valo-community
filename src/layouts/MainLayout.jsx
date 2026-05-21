import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import BottomBar from '../components/layout/BottomBar' // Import bottom bar asset
import AnnouncementModal from '../components/ui/AnnouncementModal'

export default function MainLayout({ children }) {
  const [, setSearchParams] = useSearchParams()

  const handleSearch = (query) => {
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <div className="min-h-screen bg-valo-dark text-white flex flex-col">
      <AnnouncementModal />
      <Navbar onSearch={handleSearch} />
      
      {/* Sidebar - Visible only on large screens */}
      <Sidebar />
      
      {/* Main Content Area adjustments */}
      <main className="pt-14 lg:pl-56 flex-1">
        <div className="p-4 md:p-6 pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Bottom Bar - Mobile Navigation display overlay */}
      <BottomBar />
    </div>
  )
}
