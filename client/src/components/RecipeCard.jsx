import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe._id}`}
      className="bg-white rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition overflow-hidden block"
    >
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center text-6xl">
          🍛
        </div>
      )}
      <div className="p-4">
        <span className="text-xs font-semibold uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          {recipe.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-gray-800">{recipe.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{recipe.description}</p>
        <p className="text-sm text-gray-400 mt-3">⏱ {recipe.cookTime} min</p>
      </div>
    </Link>
  )
}