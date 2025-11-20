import { useEffect, useState } from 'react'
import { createAula, createRecurso, deleteAula, deleteRecurso, getAulas, getRecursos, updateAula, updateRecurso } from '../api/client'

export default function AdminAulas() {
  const [aulas, setAulas] = useState([])
  const [recursos, setRecursos] = useState([])
  const [aulaForm, setAulaForm] = useState({ nombre_aula: '', capacidad: '', descripcion: '' })
  const [recursoForm, setRecursoForm] = useState({ nombre_recurso: '', tipo: '', estado: '', id_aula: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    try {
      const [a, r] = await Promise.all([getAulas(), getRecursos()])
      setAulas(a)
      setRecursos(r)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleAulaCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!aulaForm.nombre_aula || !aulaForm.capacidad) {
      setError('Nombre y capacidad son obligatorios')
      return
    }
    try {
      await createAula(aulaForm)
      setMessage('Aula creada')
      setAulaForm({ nombre_aula: '', capacidad: '', descripcion: '' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRecursoCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!recursoForm.nombre_recurso || !recursoForm.tipo || !recursoForm.estado || !recursoForm.id_aula) {
      setError('Completa todos los campos de recurso')
      return
    }
    try {
      await createRecurso(recursoForm)
      setMessage('Recurso creado')
      setRecursoForm({ nombre_recurso: '', tipo: '', estado: '', id_aula: '' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (type, item, updates) => {
    setError('')
    try {
      if (type === 'aula') {
        await updateAula(item.id_aula, updates)
      } else {
        await updateRecurso(item.id_recurso, updates)
      }
      setMessage('Actualizado')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (type, id) => {
    setError('')
    try {
      if (type === 'aula') await deleteAula(id)
      else await deleteRecurso(id)
      setMessage('Eliminado')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Aulas y Recursos (Admin)</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid two">
        <div className="card">
          <h3>Crear aula</h3>
          <form className="form" onSubmit={handleAulaCreate}>
            <label>
              Nombre
              <input value={aulaForm.nombre_aula} onChange={(e) => setAulaForm({ ...aulaForm, nombre_aula: e.target.value })} required />
            </label>
            <label>
              Capacidad
              <input type="number" value={aulaForm.capacidad} onChange={(e) => setAulaForm({ ...aulaForm, capacidad: e.target.value })} required />
            </label>
            <label>
              Descripción
              <input value={aulaForm.descripcion} onChange={(e) => setAulaForm({ ...aulaForm, descripcion: e.target.value })} />
            </label>
            <button className="btn" type="submit">Crear</button>
          </form>
        </div>
        <div className="card">
          <h3>Crear recurso</h3>
          <form className="form" onSubmit={handleRecursoCreate}>
            <label>
              Nombre
              <input value={recursoForm.nombre_recurso} onChange={(e) => setRecursoForm({ ...recursoForm, nombre_recurso: e.target.value })} required />
            </label>
            <label>
              Tipo
              <input value={recursoForm.tipo} onChange={(e) => setRecursoForm({ ...recursoForm, tipo: e.target.value })} required />
            </label>
            <label>
              Estado
              <input value={recursoForm.estado} onChange={(e) => setRecursoForm({ ...recursoForm, estado: e.target.value })} required />
            </label>
            <label>
              Aula (ID)
              <input value={recursoForm.id_aula} onChange={(e) => setRecursoForm({ ...recursoForm, id_aula: e.target.value })} required />
            </label>
            <button className="btn" type="submit">Crear</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3>Listado de aulas</h3>
        {loading ? <p>Cargando...</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {aulas.map((a) => (
              <tr key={a.id_aula}>
                <td>{a.id_aula}</td>
                <td><input defaultValue={a.nombre_aula} onChange={(e) => { a._nombre = e.target.value }} /></td>
                <td><input type="number" defaultValue={a.capacidad} onChange={(e) => { a._capacidad = e.target.value }} /></td>
                <td><input defaultValue={a.descripcion} onChange={(e) => { a._descripcion = e.target.value }} /></td>
                <td className="actions">
                  <button className="btn ghost" onClick={() => handleUpdate('aula', a, { nombre_aula: a._nombre ?? a.nombre_aula, capacidad: a._capacidad ?? a.capacidad, descripcion: a._descripcion ?? a.descripcion })}>Guardar</button>
                  <button className="btn secondary" onClick={() => handleDelete('aula', a.id_aula)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {aulas.length === 0 && <tr><td colSpan="5">Sin aulas</td></tr>}
          </tbody>
        </table>
        )}
      </div>

      <div className="card">
        <h3>Listado de recursos</h3>
        {loading ? <p>Cargando...</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Aula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recursos.map((r) => (
              <tr key={r.id_recurso}>
                <td>{r.id_recurso}</td>
                <td><input defaultValue={r.nombre_recurso} onChange={(e) => { r._nombre = e.target.value }} /></td>
                <td><input defaultValue={r.tipo} onChange={(e) => { r._tipo = e.target.value }} /></td>
                <td><input defaultValue={r.estado} onChange={(e) => { r._estado = e.target.value }} /></td>
                <td><input defaultValue={r.id_aula} onChange={(e) => { r._aula = e.target.value }} /></td>
                <td className="actions">
                  <button className="btn ghost" onClick={() => handleUpdate('recurso', r, { nombre_recurso: r._nombre ?? r.nombre_recurso, tipo: r._tipo ?? r.tipo, estado: r._estado ?? r.estado, id_aula: r._aula ?? r.id_aula })}>Guardar</button>
                  <button className="btn secondary" onClick={() => handleDelete('recurso', r.id_recurso)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {recursos.length === 0 && <tr><td colSpan="6">Sin recursos</td></tr>}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}
