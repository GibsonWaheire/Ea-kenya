import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        headers: { 'x-auth-token': token }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        logout()
      }
    } catch (err) {
      console.log('Using local auth')
      setLoading(false)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Login failed')
      
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Registration failed')
      
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const purchaseEA = async (eaId) => {
    try {
      const res = await fetch(`${API_URL}/eas/${eaId}/purchase`, {
        method: 'POST',
        headers: { 'x-auth-token': token }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Purchase failed')
      
      fetchUser()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, purchaseEA }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
