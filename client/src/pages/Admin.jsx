import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Admin() {
  const [tab, setTab] = useState('recipes')
  const [stats, setStats] = useState({ users: 0, recipes: 0 })
  const [recipes, setRecipes] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [s, r, u] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/recipes'),
        api.get('/admin/users'),
      ])
      setStats(s.data)
      setRecipes(r.data)
      setUsers(u.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load admin data')
    }
  }

  useEffect(() => { load() }, [])

  const deleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe?')) return
    await api.delete(`/recipes/${id}`)
    load()
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user AND all their recipes?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  const tabBtn = (name) =>
    `px-5 py-2 rounded-full font-medium ${
      tab === name ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">🛠 Admin Panel</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Total recipes</p>
          <p className="text-3xl font-bold text-orange-600">{stats.recipes}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Total users</p>
          <p className="text-3xl font-bold text-orange-600">{stats.users}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setTab('recipes')} className={tabBtn('recipes')}>Recipes</button>
        <button onClick={() => setTab('users')} className={tabBtn('users')}>Users</button>
      </div>

      {tab === 'recipes' ? (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Author</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3 font-medium">
                    <Link to={`/recipe/${r._id}`} className="hover:text-orange-600">{r.title}</Link>
                  </td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.author?.name || 'No author'}</td>
                  <td className="p-3 flex gap-3">
                    <Link to={`/edit/${r._id}`} className="text-orange-600">Edit</Link>
                    <button onClick={() => deleteRecipe(r._id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u._id)} className="text-red-500">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}