import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', password: '', rol: 'estudiante' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!form.nombre || !form.apellido || !form.correo || !form.password) {
      setError('Completa todos los campos obligatorios')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.rol === 'administrador' ? '/admin/reservas' : '/estudiante/reservas', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>
        <label>
          Apellido
          <input name="apellido" value={form.apellido} onChange={handleChange} required />
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={handleChange} required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Rol
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="estudiante">Estudiante</option>
            <option value="administrador">Administrador</option>
          </select>
        </label>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
      </form>
      <p className="muted">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  )
}
