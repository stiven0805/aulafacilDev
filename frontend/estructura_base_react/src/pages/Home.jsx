import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin/reservas' : '/estudiante/reservas', { replace: true })
    }
  }, [user, isAdmin, navigate])

  return (
    <div className="card">
      <h1>AulaFácil</h1>
      <p>Reserva salas de estudio de forma ágil.</p>
    </div>
  )
}
