import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { APP_ROUTES } from '../../lib/appRoutes'

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()

  if (authLoading) {
    return <div className="admin-loading">Checking admin session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.auth} replace />
  }

  return children
}

export default ProtectedRoute
