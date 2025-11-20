import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PublicHeader from "./PublicHeader.jsx";

export function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <PublicHeader />

      {user && (
        <nav className="private-menu">
          <NavLink to="/estudiante/reservas">Reservas</NavLink>

          {isAdmin && (
            <>
              <NavLink to="/admin/reservas">Admin Reservas</NavLink>
              <NavLink to="/admin/aulas">Aulas/Recursos</NavLink>
              <NavLink to="/admin/reportes">Reportes</NavLink>
            </>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </nav>
      )}

      <main className="page">{children}</main>
    </div>
  );
}
