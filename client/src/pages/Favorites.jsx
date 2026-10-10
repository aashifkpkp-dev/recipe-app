import { useEffect, useState } from 'react'
import api from '../api'
import RecipeCard from '../components/RecipeCard'

export default function Favorites() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/recipes/favorites/mine')
      .then((res) => setRecipes(res.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">❤️ My Favorites</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No favorites yet. Open a recipe and tap the heart.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}