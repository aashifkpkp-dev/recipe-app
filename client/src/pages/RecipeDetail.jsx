import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, toggleFavorite } = useAuth()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    api.get(`/recipes/${id}`).then((res) => setRecipe(res.data)).catch(console.log)
  }, [id])

  if (!recipe) return <p className="text-center py-20 text-gray-500">Loading...</p>

  const isAuthor =
  user && ((recipe.author && recipe.author._id === user.id) || user.role === 'admin')
  const isFavorite = user && user.favorites?.includes(recipe._id)

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return
    await api.delete(`/recipes/${id}`)
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-orange-600 hover:underline">← Back to recipes</Link>

      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} className="w-full h-72 object-cover rounded-2xl mt-4" />
      ) : (
        <div className="h-72 mt-4 rounded-2xl bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center text-8xl">
          🍛
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mt-6">
        <h1 className="text-4xl font-extrabold text-gray-800">{recipe.title}</h1>
        {user && (
          <button
            onClick={() => toggleFavorite(recipe._id)}
            className="text-3xl shrink-0"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm">
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold">{recipe.category}</span>
        <span className="text-gray-500 py-1">⏱ {recipe.cookTime} min</span>
        {recipe.author && <span className="text-gray-500 py-1">by {recipe.author.name}</span>}
      </div>

      {isAuthor && (
        <div className="flex gap-3 mt-4">
          <Link to={`/edit/${recipe._id}`}
            className="bg-white border border-orange-300 text-orange-600 px-4 py-2 rounded-full hover:bg-orange-50">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete}
            className="bg-white border border-red-300 text-red-500 px-4 py-2 rounded-full hover:bg-red-50">
            🗑 Delete
          </button>
        </div>
      )}

      <p className="text-gray-600 mt-4">{recipe.description}</p>

      <h2 className="text-2xl font-bold mt-8 mb-3">Ingredients</h2>
      <ul className="bg-white rounded-xl shadow p-5 space-y-2">
        {recipe.ingredients.map((item, i) => (
          <li key={i} className="text-gray-700">🥄 {item}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-3">Steps</h2>
      <ol className="space-y-3">
        {recipe.steps.map((step, i) => (
          <li key={i} className="bg-white rounded-xl shadow p-4 flex gap-4">
            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-gray-700">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}