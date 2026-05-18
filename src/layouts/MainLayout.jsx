import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

export default function MainLayout({ children }) {
  const [, setSearchParams] = useSearchParams()

  const handleSearch = (query) => {
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <div className="min-h-screen bg-valo-dark">
      <Navbar onSearch={handleSearch} />
      <Sidebar />
      <main className="pt-14 lg:pl-56">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
