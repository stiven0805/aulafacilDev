import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginRequest, registerRequest } from '../api/client'

const AuthContext = createContext(null)
const TOKEN_KEY = 'aulaFacilToken'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    getCurrentUser()
      .then((u) => {
        setUser(u)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        setUser(null)
        setLoading(false)
      })
  }, [token])

  const login = async (credenciales) => {
    const data = await loginRequest(credenciales)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.usuario)
    return data.usuario
  }

  const register = async (payload) => {
    const data = await registerRequest(payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.usuario)
    return data.usuario
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      register,
      isAdmin: user?.rol === 'administrador',
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
