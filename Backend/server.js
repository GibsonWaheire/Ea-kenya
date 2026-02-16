import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'ea-ke-secret-key-2026'

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ea-ke')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedEAs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EA' }],
  createdAt: { type: Date, default: Date.now }
})

// EA Schema
const eaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  features: [String],
  rating: Number,
  reviews: Number,
  image: String,
  downloadUrl: String,
  isActive: { type: Boolean, default: true }
})

const User = mongoose.model('User', userSchema)
const EA = mongoose.model('EA', eaSchema)

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' })
  }
}

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ msg: 'User already exists' })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    user = new User({ name, email, password: hashedPassword })
    await user.save()

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        purchasedEAs: []
      } 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' })

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        purchasedEAs: user.purchasedEAs
      } 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get User Profile
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('purchasedEAs')
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get All EAs
app.get('/api/eas', async (req, res) => {
  try {
    const eas = await EA.find({ isActive: true })
    res.json(eas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get Single EA
app.get('/api/eas/:id', async (req, res) => {
  try {
    const ea = await EA.findById(req.params.id)
    if (!ea) return res.status(404).json({ msg: 'EA not found' })
    res.json(ea)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Purchase EA
app.post('/api/eas/:id/purchase', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const ea = await EA.findById(req.params.id)
    
    if (!ea) return res.status(404).json({ msg: 'EA not found' })
    
    // Check if already purchased
    if (user.purchasedEAs.includes(ea._id)) {
      return res.status(400).json({ msg: 'EA already purchased' })
    }
    
    user.purchasedEAs.push(ea._id)
    await user.save()
    
    res.json({ msg: 'Purchase successful', purchasedEAs: user.purchasedEAs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get User's Purchased EAs
app.get('/api/user/eas', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedEAs')
    res.json(user.purchasedEAs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Seed EAs (for demo)
app.post('/api/eas/seed', async (req, res) => {
  try {
    const eas = [
      {
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

    await EA.deleteMany({})
    const createdEAs = await EA.insertMany(eas)
    res.json({ msg: 'EAs seeded successfully', eas: createdEAs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
