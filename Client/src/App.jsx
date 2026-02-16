import { useState, useEffect, createContext, useContext } from 'react'

// Auth Context
const AuthContext = createContext(null)

const useAuth = () => useContext(AuthContext)

// API Base URL
const API_URL = 'http://localhost:5000/api'

// EA Products Data (fallback if API not available)
const defaultProducts = [
  {
    _id: "1",
    name: "TrendMaster Pro",
    description: "Advanced trend-following EA with smart money management. Perfect for EUR/USD and GBP/USD.",
    price: 299,
    features: ["Multiple TF Analysis", "Auto Lot Sizing", "Trailing Stop", "News Filter"],
    rating: 4.9,
    reviews: 234,
    image: "📈",
    downloadUrl: "/downloads/trendmaster-pro.zip"
  },
  {
    _id: "2",
    name: "GridHunter Elite",
    description: "Grid trading system with built-in recovery mode. Ideal for ranging markets.",
    price: 349,
    features: ["Grid Strategy", "Recovery Mode", "Martingale Option", "Multi Currency"],
    rating: 4.8,
    reviews: 189,
    image: "🕸️",
    downloadUrl: "/downloads/gridhunter-elite.zip"
  },
  {
    _id: "3",
    name: "ScalpStorm",
    description: "High-frequency scalping EA for quick profits. Low drawdown, high win rate.",
    price: 249,
    features: ["Fast Execution", "Low Spread", "Micro Lots", "5 Min Charts"],
    rating: 4.7,
    reviews: 156,
    image: "⚡",
    downloadUrl: "/downloads/scalpstorm.zip"
  },
  {
    _id: "4",
    name: "GoldNavigator",
    description: "Specialized gold trading robot with XAU/USD optimization. Steady profits.",
    price: 399,
    features: ["Gold Special", "Swing Trading", "Daily Pips Target", "VIP Support"],
    rating: 4.9,
    reviews: 312,
    image: "🥇",
    downloadUrl: "/downloads/goldnavigator.zip"
  }
]

const features = [
  { icon: "🎯", title: "High Win Rate", description: "Our EAs are rigorously tested with 10+ years of historical data" },
  { icon: "🛡️", title: "Risk Management", description: "Built-in protection mechanisms to safeguard your capital" },
  { icon: "⚙️", title: "Easy Setup", description: "Install and start trading in minutes with our step-by-step guide" },
  { icon: "🔄", title: "Auto Updates", description: "Get free lifetime updates as we improve the algorithms" },
  { icon: "💬", title: "24/7 Support", description: "Our team is available around the clock to help you succeed" },
  { icon: "📊", title: "Real Results", description: "Verified Myfxbook accounts with live trading performance" }
]

const testimonials = [
  { name: "John M.", location: "United Kingdom", text: "TrendMaster Pro has been incredibly profitable. 3 months in and I'm up 47%!", profit: "+47%" },
  { name: "Sarah K.", location: "Germany", text: "Best investment I've made. The GoldNavigator EA exceeds all expectations.", profit: "+62%" },
  { name: "Mike T.", location: "USA", text: "Support team is amazing. They helped me optimize settings for my account.", profit: "+38%" }
]

const faqs = [
  { question: "What is an EA (Expert Advisor)?", answer: "An Expert Advisor is an automated trading robot that executes trades on your behalf based on predefined rules and algorithms." },
  { question: "Do I need MetaTrader to use these EAs?", answer: "Yes, all our EAs work on MetaTrader 4 (MT4) or MetaTrader 5 (MT5) platforms." },
  { question: "What is the minimum deposit required?", answer: "We recommend a minimum of $500 for standard accounts, though some EAs work with $200." },
  { question: "Do you offer refunds?", answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase." },
  { question: "Can I use multiple EAs on one account?", answer: "Yes, you can run multiple EAs on different currency pairs. We recommend $1000+ balance." }
]

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

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
      
      // Refresh user data
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

// Login Modal
function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-blue-400 hover:underline">Sign up</button>
        </p>
      </div>
    </div>
  )
}

// Signup Modal
function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    const result = await register(name, email, password)
    setLoading(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-400 hover:underline">Login</button>
        </p>
      </div>
    </div>
  )
}

// User Dashboard
function UserDashboard({ onClose }) {
  const { user, logout, token } = useAuth()
  const [purchasedEAs, setPurchasedEAs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchasedEAs()
  }, [])

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold mb-4">My Purchased EAs</h3>
          
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : purchasedEAs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't purchased any EAs yet</p>
              <a href="#products" onClick={onClose} className="text-blue-400 hover:underline">Browse EAs</a>
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
          onClick={() => { logout(); onClose(); }}
          className="mt-6 w-full py-3 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

// Cart Modal
function CartModal({ isOpen, onClose, products }) {
  const [cart, setCart] = useState([])
  const { user, token, purchaseEA } = useAuth()
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [isOpen])

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const handlePurchase = async () => {
    if (!user) return
    
    setPurchasing(true)
    for (const item of cart) {
      await purchaseEA(item._id)
    }
    setCart([])
    localStorage.removeItem('cart')
    setPurchasing(false)
    alert('Purchase successful! Check your dashboard for downloads.')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h3 className="text-xl font-bold mb-6">Shopping Cart</h3>
        
        {cart.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-400 text-sm">${item.price}</div>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
              {user ? (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Checkout'}
                </button>
              ) : (
                <p className="text-center text-yellow-400">Please login to purchase</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Main App
function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const { user } = useAuth() || {}

  const products = defaultProducts

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(product)
    localStorage.setItem('cart', JSON.stringify(cart))
    setShowCart(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#" className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  EA Ke
                </span>
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="hover:text-blue-400 transition">Features</a>
                <a href="#products" className="hover:text-blue-400 transition">Products</a>
                <a href="#testimonials" className="hover:text-blue-400 transition">Reviews</a>
                <a href="#faq" className="hover:text-blue-400 transition">FAQ</a>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    Login
                  </button>
                )}
                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <span className="text-xl">🛒</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm mb-6">
              🚀 #1 Trusted EA Store in Africa
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Automate Your Trading
              <span className="block bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                Dominate the Markets
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Professional Expert Advisors designed to maximize your profits while minimizing risks. 
              Start automated trading today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#products" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-lg hover:opacity-90 transition">
                Browse EAs
              </a>
              <a href="#features" className="px-8 py-4 border border-gray-600 rounded-lg font-semibold text-lg hover:bg-gray-800 transition">
                Learn More
              </a>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
              <div><div className="text-3xl font-bold text-white">500+</div><div>Happy Traders</div></div>
              <div><div className="text-3xl font-bold text-white">$2M+</div><div>Profits Generated</div></div>
              <div><div className="text-3xl font-bold text-white">98%</div><div>Success Rate</div></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Why Choose Our EAs?</h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              We combine advanced algorithms with proven trading strategies
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition border border-gray-700 hover:border-blue-500">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Our Expert Advisors</h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Choose from our selection of premium trading robots
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition border border-gray-700 hover:border-blue-500">
                  <div className="h-40 bg-gradient-to-br from-blue-900/50 to-green-900/50 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <ul className="space-y-2 mb-4">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-green-400">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                      <span className="text-2xl font-bold">${product.price}</span>
                      <button onClick={() => addToCart(product)} className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition font-medium">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">What Traders Say</h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Join hundreds of successful traders
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-xl font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.location}</div>
                    </div>
                    <div className="ml-auto text-2xl font-bold text-green-400">{testimonial.profit}</div>
                  </div>
                  <p className="text-gray-300">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-center mb-16">Everything you need to know</p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-750 transition">
                    <span className="font-semibold">{faq.question}</span>
                    <span className="text-2xl">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && <div className="px-6 pb-6 text-gray-400">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-xl text-gray-400 mb-8">Get started today and join the top traders using our EAs</p>
            <a href="#products" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-lg hover:opacity-90 transition">
              Browse All EAs
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <a href="#" className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold">EA Ke</span>
              </a>
              <div className="flex gap-6 text-gray-400">
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Contact</a>
              </div>
              <div className="text-gray-400">© 2026 EA Ke. All rights reserved.</div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />
        <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />
        <CartModal isOpen={showCart} onClose={() => setShowCart(false)} products={products} />
        {user && <UserDashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />}
      </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
