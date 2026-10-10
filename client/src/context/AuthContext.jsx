import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const res = await api.get('/auth/me')
    setUser(res.data)
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false)
      return
    }
    refreshUser()
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    await refreshUser()
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    await refreshUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const toggleFavorite = async (recipeId) => {
    await api.post(`/recipes/${recipeId}/favorite`)
    await refreshUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  )
}