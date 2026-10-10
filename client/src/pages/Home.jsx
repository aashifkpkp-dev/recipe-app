import { useEffect, useState } from 'react'
import api from '../api'
import RecipeCard from '../components/RecipeCard'

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert', 'Other']

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category !== 'All') params.category = category
    api
      .get('/recipes', { params })
      .then((res) => setRecipes(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [search, category])

  return (
    <div>
      <section className="bg-gradient-to-r from-orange-500 to-amber-400 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">Share the recipes you love</h1>
        <p className="mt-3 text-lg text-orange-50">Discover, cook and share delicious food</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="mt-6 w-full max-w-md px-5 py-3 rounded-full text-gray-800 outline-none shadow-lg"
        />
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-500">No recipes found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r._id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}