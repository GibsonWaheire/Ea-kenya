import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth() || {}

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              EA Ke
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="hover:text-blue-400 transition">Features</Link>
            <Link to="/#products" className="hover:text-blue-400 transition">Products</Link>
            <Link to="/#testimonials" className="hover:text-blue-400 transition">Reviews</Link>
            <Link to="/#faq" className="hover:text-blue-400 transition">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                Login
              </Link>
            )}
            <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-lg transition">
              <span className="text-xl">🛒</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
