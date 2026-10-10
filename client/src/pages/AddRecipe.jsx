import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert', 'Other']

export default function AddRecipe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Breakfast',
    cookTime: '',
    image: '',
    ingredients: '',
    steps: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

const handleFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  setUploading(true)
  setError('')
  const data = new FormData()
  data.append('image', file)
  try {
    const res = await api.post('/upload', data)
    setForm((f) => ({ ...f, image: res.data.url }))
  } catch (err) {
    setError(err.response?.data?.message || 'Upload failed')
  } finally {
    setUploading(false)
  }
}

  useEffect(() => {
    if (!isEdit) return
    api.get(`/recipes/${id}`).then((res) => {
      const r = res.data
      setForm({
        title: r.title,
        description: r.description,
        category: r.category,
        cookTime: r.cookTime,
        image: r.image,
        ingredients: r.ingredients.join('\n'),
        steps: r.steps.join('\n'),
      })
    })
  }, [id, isEdit])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const toList = (text) =>
    text.split('\n').map((line) => line.trim()).filter(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...form,
      cookTime: Number(form.cookTime) || 0,
      ingredients: toList(form.ingredients),
      steps: toList(form.steps),
    }
    try {
      if (isEdit) {
        await api.put(`/recipes/${id}`, payload)
        navigate(`/recipe/${id}`)
      } else {
        await api.post('/recipes', payload)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const input =
    'w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        {isEdit ? 'Edit recipe' : 'Add a new recipe'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow">
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Recipe title" required className={input} />

        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Short description" rows="2" className={input} />

        <div className="grid grid-cols-2 gap-4">
          <select name="category" value={form.category} onChange={handleChange} className={input}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input name="cookTime" type="number" min="0" value={form.cookTime}
            onChange={handleChange} placeholder="Cook time (minutes)" className={input} />
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-600 mb-2">Recipe photo</label>
  <input type="file" accept="image/*" onChange={handleFile}
    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-100 file:text-orange-600 file:font-semibold hover:file:bg-orange-200" />
  {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
  {form.image && (
    <img src={form.image} alt="Preview" className="mt-3 h-40 w-full object-cover rounded-xl" />
  )}
</div>

        <textarea name="ingredients" value={form.ingredients} onChange={handleChange}
          placeholder={'Ingredients (one per line)\n2 cups rice\n1 onion'}
          rows="5" className={input} />

        <textarea name="steps" value={form.steps} onChange={handleChange}
          placeholder={'Steps (one per line)\nWash the rice\nBoil for 15 minutes'}
          rows="5" className={input} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={saving || uploading}
          className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-60">
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Recipe'}
        </button>
      </form>
    </div>
  )
}