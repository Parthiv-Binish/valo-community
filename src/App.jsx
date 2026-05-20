import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AllStreamersPage from './pages/Allstreamerspage'
import SubmitPage from './pages/SubmitPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminStreamersPage from './pages/AdminStreamersPage'
import AdminSubmissionsPage from './pages/AdminSubmissionsPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"  element={<AllStreamersPage />} />
        <Route path="/submit"     element={<SubmitPage />} />
<Route path='/about' element={<AboutPage />} />
        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminStreamersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <ProtectedRoute>
              <AdminSubmissionsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-valo-dark flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-display font-bold text-6xl text-valo-red mb-4">404</h1>
      <p className="text-valo-muted font-body mb-8">This page doesn't exist in the VALO universe.</p>
      <a href="/" className="valo-btn px-8 py-3 font-display">Back to Home</a>
    </div>
  )
}