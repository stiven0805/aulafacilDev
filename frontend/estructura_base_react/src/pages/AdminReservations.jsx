import { useEffect, useState } from 'react'
import {
  cancelReserva,
  confirmarReserva,
  createReserva,
  finalizarReserva,
  getReservas,
  updateReserva,
} from '../api/client'

function formatISO(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 16)
}

export default function AdminReservations() {
  const [reservas, setReservas] = useState([])
  const [filters, setFilters] = useState({ inicio: '', fin: '' })
  const [form, setForm] = useState({ inicio: '', fin: '', id_aula: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingCreate, setLoadingCreate] = useState(false)

  const cargar = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await getReservas({
        inicio: filters.inicio ? new Date(filters.inicio).toISOString() : undefined,
        fin: filters.fin ? new Date(filters.fin).toISOString() : undefined,
      })
      setReservas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.inicio || !form.fin || !form.id_aula) {
      setError('Completa inicio, fin y aula')
      return
    }
    if (new Date(form.inicio) >= new Date(form.fin)) {
      setError('La hora fin debe ser posterior a inicio')
      return
    }
    setLoadingCreate(true)
    try {
      await createReserva({
        inicio: new Date(form.inicio).toISOString(),
        fin: new Date(form.fin).toISOString(),
        id_aula: form.id_aula,
      })
      setMessage('Reserva creada')
      setForm({ inicio: '', fin: '', id_aula: '' })
      cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingCreate(false)
    }
  }

  const handleUpdate = async (id, inicio, fin) => {
    setError('')
    try {
      await updateReserva(id, { inicio: new Date(inicio).toISOString(), fin: new Date(fin).toISOString() })
      setMessage('Reserva actualizada')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAction = async (fn, id, msg) => {
    setError('')
    try {
      await fn(id)
      setMessage(msg)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Reservas (Admin)</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid two">
        <div className="card">
          <h3>Filtrar</h3>
          <form className="form" onSubmit={(e) => { e.preventDefault(); cargar() }}>
            <label>
              Inicio desde
              <input type="datetime-local" value={filters.inicio} onChange={(e) => setFilters({ ...filters, inicio: e.target.value })} />
            </label>
            <label>
              Fin hasta
              <input type="datetime-local" value={filters.fin} onChange={(e) => setFilters({ ...filters, fin: e.target.value })} />
            </label>
            <button className="btn" type="submit">Aplicar</button>
          </form>
        </div>
        <div className="card">
          <h3>Crear reserva rápida</h3>
          <form className="form" onSubmit={handleCreate}>
            <label>
              Inicio
              <input type="datetime-local" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} required />
            </label>
            <label>
              Fin
              <input type="datetime-local" value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} required />
            </label>
            <label>
              Aula (ID)
              <input value={form.id_aula} onChange={(e) => setForm({ ...form, id_aula: e.target.value })} required />
            </label>
            <button className="btn" type="submit">Crear</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3>Listado</h3>
        {loading ? <p>Cargando...</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aula</th>
                <th>Usuario</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.aula?.nombre_aula || r.id_aula}</td>
                  <td>{r.usuario ? `${r.usuario.nombre} ${r.usuario.apellido}` : r.id_usuario}</td>
                  <td><input type="datetime-local" defaultValue={formatISO(r.inicio)} onChange={(e) => { r._nuevoInicio = e.target.value }} /></td>
                  <td><input type="datetime-local" defaultValue={formatISO(r.fin)} onChange={(e) => { r._nuevoFin = e.target.value }} /></td>
                  <td>{r.estado}</td>
                  <td className="actions">
                    <button className="btn ghost" onClick={() => handleUpdate(r.id_reserva, r._nuevoInicio || r.inicio, r._nuevoFin || r.fin)}>Guardar</button>
                    <button className="btn secondary" onClick={() => handleAction(cancelReserva, r.id_reserva, 'Reserva cancelada')}>Cancelar</button>
                    <button className="btn ghost" onClick={() => handleAction(confirmarReserva, r.id_reserva, 'Reserva confirmada')}>Confirmar</button>
                    <button className="btn ghost" onClick={() => handleAction(finalizarReserva, r.id_reserva, 'Reserva finalizada')}>Finalizar</button>
                  </td>
                </tr>
              ))}
              {reservas.length === 0 && <tr><td colSpan="7">Sin resultados</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
