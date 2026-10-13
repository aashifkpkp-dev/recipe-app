import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          🍲 TastyShare
        </Link>
        <div className="flex items-center gap-5 text-gray-700 font-medium">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          {user && <Link to="/favorites" className="hover:text-orange-600">❤️ Favorites</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-orange-600">🛠 Admin</Link>}
          {user ? (
            <>
              <Link to="/add"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                + Add Recipe
              </Link>
              <span className="hidden sm:inline text-gray-500">Hi, {user.name}</span>
              <button onClick={handleLogout} className="hover:text-orange-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-600">Login</Link>
              <Link to="/signup"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}