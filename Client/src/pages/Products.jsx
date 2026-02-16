import { useState } from 'react'
import { products } from '../data/products'

export default function Products() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  })

  const addToCart = (product) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">All Expert Advisors</h1>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Browse our complete selection of premium trading robots
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
    </div>
  )
}
