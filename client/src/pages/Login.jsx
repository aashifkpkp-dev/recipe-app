import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const input =
    'w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400'

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Welcome back</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" required className={input} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" required className={input} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition">
          Log in
        </button>
        <p className="text-sm text-gray-500 text-center">
          New here? <Link to="/signup" className="text-orange-600 font-semibold">Create an account</Link>
        </p>
      </form>
    </div>
  )
}