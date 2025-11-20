import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ requiredAdmin = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <div className="page"><p>Cargando...</p></div>
  if (!user) return <Navigate to="/login" replace />
  if (requiredAdmin && !isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
