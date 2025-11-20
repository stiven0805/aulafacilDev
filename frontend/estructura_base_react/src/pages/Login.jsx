import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.correo || !form.password) {
      setError('Completa correo y contraseña')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(user.rol === 'administrador' ? '/admin/reservas' : '/estudiante/reservas', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={handleChange} onBlur={() => setTouched(true)} required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} onBlur={() => setTouched(true)} required />
        </label>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>
      </form>
      <p className="muted">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </div>
  )
}
