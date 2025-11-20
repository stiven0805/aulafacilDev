const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const TOKEN_KEY = 'aulaFacilToken'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

async function request(method, url, data, options = {}) {
  const headers = options.headers ? { ...options.headers } : {}
  const token = getToken()
  if (token) headers.Authorization = `Token ${token}`
  if (!(data instanceof FormData)) headers['Content-Type'] = 'application/json'

  const resp = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
  })

  const contentType = resp.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await resp.json().catch(() => ({})) : {}

  if (!resp.ok) {
    const detail = payload.detail || payload.non_field_errors?.join(' ') || 'Error inesperado'
    const error = new Error(detail)
    error.status = resp.status
    error.payload = payload
    throw error
  }
  return payload
}

// Auth
export const loginRequest = (data) => request('POST', '/api/auth/login/', data)
export const registerRequest = (data) => request('POST', '/api/auth/registro/', data)
export const getCurrentUser = () => request('GET', '/api/auth/usuario/')

// Aulas y recursos
export const getAulas = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request('GET', `/api/aulas/${q ? `?${q}` : ''}`)
}
export const createAula = (data) => request('POST', '/api/aulas/', data)
export const updateAula = (id, data) => request('PATCH', `/api/aulas/${id}/`, data)
export const deleteAula = (id) => request('DELETE', `/api/aulas/${id}/`)

export const getRecursos = () => request('GET', '/api/recursos/')
export const createRecurso = (data) => request('POST', '/api/recursos/', data)
export const updateRecurso = (id, data) => request('PATCH', `/api/recursos/${id}/`, data)
export const deleteRecurso = (id) => request('DELETE', `/api/recursos/${id}/`)

// Reservas
export const getReservas = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request('GET', `/api/reservas/${q ? `?${q}` : ''}`)
}
export const createReserva = (data) => request('POST', '/api/reservas/', data)
export const updateReserva = (id, data) => request('PATCH', `/api/reservas/${id}/`, data)
export const cancelReserva = (id) => request('POST', `/api/reservas/${id}/cancelar/`)
export const confirmarReserva = (id) => request('POST', `/api/reservas/${id}/confirmar/`)
export const finalizarReserva = (id) => request('POST', `/api/reservas/${id}/finalizar/`)

// Reportes y notificaciones
export const getEstadisticas = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request('GET', `/api/reportes/estadisticas/${q ? `?${q}` : ''}`)
}
export const getNotificaciones = () => request('GET', '/api/notificaciones/')
