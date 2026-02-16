import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold">EA Ke</span>
          </Link>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <div className="text-gray-400">
            © 2026 EA Ke. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
