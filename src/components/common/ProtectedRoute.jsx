import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
