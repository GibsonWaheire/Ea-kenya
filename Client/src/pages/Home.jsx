import { useState } from 'react'
import { Link } from 'react-router-dom'
import { features, testimonials, faqs, products } from '../data/products'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
            <Link to="/products" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-lg hover:opacity-90 transition">
              Browse EAs
            </Link>
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

      {/* Products Preview */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Expert Advisors</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Choose from our selection of premium trading robots
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <div key={product._id} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition border border-gray-700 hover:border-blue-500">
                <div className="h-40 bg-gradient-to-br from-blue-900/50 to-green-900/50 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                    <span className="text-gray-400 text-sm">({product.reviews})</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
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
          <div className="text-center mt-12">
            <Link to="/products" className="inline-block px-8 py-4 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What Traders Say</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Join hundreds of successful traders</p>
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

      {/* FAQ */}
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

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-2xl p-12 border border-gray-700">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-400 mb-8">Get started today and join the top traders using our EAs</p>
          <Link to="/products" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-lg hover:opacity-90 transition">
            Browse All EAs
          </Link>
        </div>
      </section>
    </div>
  )
}
