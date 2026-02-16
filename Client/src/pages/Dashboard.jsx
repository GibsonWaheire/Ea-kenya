import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout, token } = useAuth() || {}
  const [purchasedEAs, setPurchasedEAs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchPurchasedEAs()
  }, [user])

  const fetchPurchasedEAs = async () => {
    try {
      const res = await fetch(`${API_URL}/user/eas`, {
        headers: { 'x-auth-token': token }
      })
      if (res.ok) {
        const data = await res.json()
        setPurchasedEAs(data)
      }
    } catch (err) {
      console.log('Using local data')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">My Purchased EAs</h2>
          
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : purchasedEAs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't purchased any EAs yet</p>
              <Link to="/products" className="text-blue-400 hover:underline">Browse EAs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedEAs.map((ea) => (
                <div key={ea._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{ea.image}</span>
                    <div>
                      <h4 className="font-semibold">{ea.name}</h4>
                      <p className="text-sm text-gray-400">{ea.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <a
                    href={ea.downloadUrl || '#'}
                    className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-3 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
