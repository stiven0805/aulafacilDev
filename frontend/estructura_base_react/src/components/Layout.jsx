import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="brand">AulaFácil</Link>
        <nav className="nav">
          {user && (
            <>
              <NavLink to="/estudiante/reservas">Reservas</NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/admin/reservas">Admin Reservas</NavLink>
                  <NavLink to="/admin/aulas">Aulas/Recursos</NavLink>
                  <NavLink to="/admin/reportes">Reportes</NavLink>
                </>
              )}
            </>
          )}
        </nav>
        <div className="userbox">
          {user ? (
            <>
              <span>{user.nombre} ({user.rol})</span>
              <button onClick={handleLogout} className="btn secondary">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/registro" className="btn ghost">Registro</Link>
            </>
          )}
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  )
}
