import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../assets/styles/Login.css'
import PublicHeader from '../components/PublicHeader.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.correo || !form.password) {
      setError('Completa correo y contraseña')
      return
    }

    setError('')
    setLoading(true)

    try {
      const user = await login(form)
      navigate(
        user.rol === 'administrador'
          ? '/admin/reservas'
          : '/estudiante/reservas',
        { replace: true }
      )
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <PublicHeader />

      <main className="login-content">
        <h2 className="welcome-title">¡Bienvenido a Aula Fácil!</h2>
        <h3 className="login-subtitle">Ingreso</h3>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">
            Correo institucional
            <input
              name="correo"
              type="email"
              placeholder="example@campusucc.edu.co"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label">
            Contraseña
            <input
              name="password"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="register-text">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="register-link">Regístrate aquí</Link>
        </p>
      </main>
    </div>
  )
}
