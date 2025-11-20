import { useEffect, useState } from 'react'
import { cancelReserva, createReserva, getAulas, getReservas, getNotificaciones, updateReserva } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

function formatISO(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 16)
}

export default function StudentReservations() {
  const { user } = useAuth()
  const [disponibles, setDisponibles] = useState([])
  const [reservas, setReservas] = useState([])
  const [filters, setFilters] = useState({ inicio: '', fin: '' })
  const [form, setForm] = useState({ inicio: '', fin: '', id_aula: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [notis, setNotis] = useState([])
  const [loadingDisponibles, setLoadingDisponibles] = useState(false)
  const [loadingReserva, setLoadingReserva] = useState(false)

  useEffect(() => {
    if (!user) return
    cargarReservas()
    cargarNotis()
  }, [user])

  const cargarReservas = async () => {
    setLoading(true)
    try {
      const data = await getReservas()
      setReservas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const buscarDisponibles = async (e) => {
    e.preventDefault()
    setError('')
    if (!filters.inicio || !filters.fin) {
      setError('Selecciona inicio y fin')
      return
    }
    if (new Date(filters.inicio) >= new Date(filters.fin)) {
      setError('La hora fin debe ser posterior a inicio')
      return
    }
    setLoadingDisponibles(true)
    try {
      const data = await getAulas({
        inicio: filters.inicio ? new Date(filters.inicio).toISOString() : undefined,
        fin: filters.fin ? new Date(filters.fin).toISOString() : undefined,
      })
      setDisponibles(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingDisponibles(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!form.inicio || !form.fin || !form.id_aula) {
      setError('Completa inicio, fin y aula')
      return
    }
    if (new Date(form.inicio) >= new Date(form.fin)) {
      setError('La hora fin debe ser posterior a inicio')
      return
    }
    setLoadingReserva(true)
    try {
      await createReserva({
        inicio: new Date(form.inicio).toISOString(),
        fin: new Date(form.fin).toISOString(),
        id_aula: form.id_aula,
      })
      setMessage('Reserva creada')
      setForm({ inicio: '', fin: '', id_aula: '' })
      cargarReservas()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingReserva(false)
    }
  }

  const handleCancel = async (id) => {
    setError('')
    try {
      await cancelReserva(id)
      setMessage('Reserva cancelada')
      cargarReservas()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (id, inicio, fin) => {
    setError('')
    try {
      await updateReserva(id, {
        inicio: new Date(inicio).toISOString(),
        fin: new Date(fin).toISOString(),
      })
      setMessage('Reserva actualizada')
      cargarReservas()
    } catch (err) {
      setError(err.message)
    }
  }

  const cargarNotis = async () => {
    try {
      const data = await getNotificaciones()
      setNotis(data)
    } catch (err) {
      // silencioso
    }
  }

  return (
    <div>
      <h2>Reservas del estudiante</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <section className="grid two">
        <div className="card">
          <h3>Buscar aulas disponibles</h3>
          <form onSubmit={buscarDisponibles} className="form">
            <label>
              Inicio
              <input type="datetime-local" value={filters.inicio} onChange={(e) => setFilters({ ...filters, inicio: e.target.value })} required />
            </label>
            <label>
              Fin
              <input type="datetime-local" value={filters.fin} onChange={(e) => setFilters({ ...filters, fin: e.target.value })} required />
            </label>
            <button className="btn" type="submit">Buscar</button>
          </form>
          {loadingDisponibles ? <p>Cargando...</p> : (
            <ul className="list">
              {disponibles.map((aula) => (
                <li key={aula.id_aula}>
                  <div>
                    <strong>{aula.nombre_aula}</strong> — cap. {aula.capacidad}
                    {aula.descripcion && <span className="muted"> • {aula.descripcion}</span>}
                  </div>
                  <button className="btn ghost" onClick={() => setForm({ ...form, id_aula: aula.id_aula })}>Usar</button>
                </li>
              ))}
              {disponibles.length === 0 && <li className="muted">Sin resultados</li>}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Crear reserva</h3>
          <form onSubmit={handleCreate} className="form">
            <label>
              Inicio
              <input type="datetime-local" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} required />
            </label>
            <label>
              Fin
              <input type="datetime-local" value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} required />
            </label>
            <label>
              Aula seleccionada
              <input value={form.id_aula} onChange={(e) => setForm({ ...form, id_aula: e.target.value })} required placeholder="ID de aula" />
            </label>
            <button className="btn" type="submit" disabled={loadingReserva}>{loadingReserva ? 'Enviando...' : 'Reservar'}</button>
          </form>
        </div>
      </section>

      <section className="card">
        <h3>Mis reservas</h3>
        {loading ? <p>Cargando...</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.aula?.nombre_aula || r.id_aula}</td>
                  <td><input type="datetime-local" defaultValue={formatISO(r.inicio)} onChange={(e) => { r._nuevoInicio = e.target.value }} /></td>
                  <td><input type="datetime-local" defaultValue={formatISO(r.fin)} onChange={(e) => { r._nuevoFin = e.target.value }} /></td>
                  <td>{r.estado}</td>
                  <td className="actions">
                    <button className="btn ghost" onClick={() => handleUpdate(r.id_reserva, r._nuevoInicio || r.inicio, r._nuevoFin || r.fin)}>Guardar</button>
                    <button className="btn secondary" onClick={() => handleCancel(r.id_reserva)}>Cancelar</button>
                  </td>
                </tr>
              ))}
              {reservas.length === 0 && <tr><td colSpan="5">Aún no tienes reservas</td></tr>}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <div className="spread">
          <h3>Notificaciones</h3>
          <button className="btn ghost" onClick={cargarNotis}>Refrescar</button>
        </div>
        <ul className="list">
          {notis.map((n, idx) => (
            <li key={idx}>{n.mensaje}</li>
          ))}
          {notis.length === 0 && <li className="muted">Sin notificaciones</li>}
        </ul>
      </section>
    </div>
  )
}
