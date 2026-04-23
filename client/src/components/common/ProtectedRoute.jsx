import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()

  if (authLoading) {
    return <div className="admin-loading">Checking admin session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
