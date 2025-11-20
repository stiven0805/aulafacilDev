import { useEffect, useState } from 'react'
import { getEstadisticas, getNotificaciones } from '../api/client'

export default function AdminReportes() {
  const [stats, setStats] = useState(null)
  const [notis, setNotis] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {
    setError('')
    try {
      const [s, n] = await Promise.all([getEstadisticas(), getNotificaciones()])
      setStats(s)
      setNotis(n)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Reportes y notificaciones</h2>
      {error && <p className="error">{error}</p>}
      {!stats ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid three">
          <div className="card stat">
            <p className="muted">Reservas totales</p>
            <strong>{stats.total_reservas}</strong>
          </div>
          <div className="card stat">
            <p className="muted">Por estado</p>
            <ul className="list">
              {stats.por_estado.map((e) => (
                <li key={e.estado}>{e.estado}: {e.total}</li>
              ))}
              {stats.por_estado.length === 0 && <li>Sin datos</li>}
            </ul>
          </div>
          <div className="card stat">
            <p className="muted">Top aulas</p>
            <ul className="list">
              {stats.top_aulas.map((a) => (
                <li key={a.id_aula__nombre_aula || a.nombre}>{a.id_aula__nombre_aula || a.nombre}: {a.total}</li>
              ))}
              {stats.top_aulas.length === 0 && <li>Sin datos</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="card">
        <div className="spread">
          <h3>Notificaciones</h3>
          <button className="btn ghost" onClick={cargar}>Refrescar</button>
        </div>
        <ul className="list">
          {notis.map((n, idx) => (
            <li key={idx}>
              <strong>{n.tipo}</strong>: {n.mensaje}
            </li>
          ))}
          {notis.length === 0 && <li className="muted">Sin notificaciones</li>}
        </ul>
      </div>
    </div>
  )
}
