import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { user, token, purchaseEA } = useAuth() || {}
  const [cart, setCart] = useState([])
  const [purchasing, setPurchasing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setPurchasing(true)
    for (const item of cart) {
      await purchaseEA(item._id)
    }
    setCart([])
    localStorage.removeItem('cart')
    setPurchasing(false)
    alert('Purchase successful! Check your dashboard for downloads.')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Link to="/products" className="text-blue-400 hover:underline">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-gray-400 text-sm">${item.price}</div>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-300">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-xl font-bold mb-4">
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
                <div className="text-center">
                  <p className="text-yellow-400 mb-4">Please login to purchase</p>
                  <Link to="/login" className="inline-block px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
