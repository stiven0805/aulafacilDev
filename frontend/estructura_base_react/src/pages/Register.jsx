import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PublicHeader from '../components/PublicHeader.jsx'
import '../assets/styles/Register.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // 🔹 Por defecto usuario normal
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
  })

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
      // 🔹 Registrar como estudiante por defecto
      const user = await register({ ...form, rol: 'estudiante' })

      navigate('/estudiante/reservas', { replace: true })
    } catch (err) {
      console.error('Error en registro', err)
      if (err?.isNetwork || err?.message?.toLowerCase().includes('conectar')) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté activo en http://localhost:8000.')
      } else {
        setError(err.message || 'Error al registrar')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PublicHeader />

      <div className="register-container">
        <h2 className="welcome-title">¡Bienvenido a Aula Fácil!</h2>
        <h3 className="register-subtitle">Registro</h3>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="register-form">

          <label className="form-label">
            Nombre
            <input
              name="nombre"
              placeholder="example"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label">
            Apellido
            <input
              name="apellido"
              placeholder="example"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </label>

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

          <label className="form-label">
            Confirmar contraseña
            <input
              name="passwordConfirm"
              type="password"
              placeholder="********"
              required
            />
          </label>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Creando...' : 'Registrarse'}
          </button>
        </form>

        <p className="register-text">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="register-link">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </>
  )
}
