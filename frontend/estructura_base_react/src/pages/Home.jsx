import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../assets/styles/Home.css'

export default function Home() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin/reservas' : '/estudiante/reservas', { replace: true })
    }
  }, [user, isAdmin, navigate])

  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a AulaFácil</h1>
      <p className="home-subtitle">
        Reserva aulas, salas de estudio y recursos institucionales de manera ágil, rápida y sencilla.
      </p>

      <div className="home-buttons">
        <button onClick={() => navigate('/login')} className="home-btn">
          Iniciar sesión
        </button>

        <button onClick={() => navigate('/registro')} className="home-btn secondary">
          Registrarse
        </button>
      </div>
    </div>
  )
}
