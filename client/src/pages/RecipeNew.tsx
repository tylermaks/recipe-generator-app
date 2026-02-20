import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import type { Ingredient } from '../types/recipe'

const MAX_IMAGE_SIZE_MB = 2
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

function generateId() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function RecipeNew() {
  const navigate = useNavigate()
  const { createRecipe, recipes } = useRecipes()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [imageError, setImageError] = useState<string | undefined>()
  const [prepTime, setPrepTime] = useState<number | ''>('')
  const [cookTime, setCookTime] = useState<number | ''>('')
  const [servings, setServings] = useState<number | ''>('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [newIngredient, setNewIngredient] = useState({ quantity: '', unit: '', name: '' })

  const categories = Array.from(
    new Set(recipes.map((r) => r.category).filter(Boolean))
  ).sort() as string[]

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(undefined)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file (JPEG, PNG, etc.)')
      return
    }
    try {
      const dataUrl = await fileToDataUrl(file)
      setImageUrl(dataUrl)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to load image')
    }
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setImageUrl(undefined)
    setImageError(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients((prev) => [
        ...prev,
        {
          id: generateId(),
          quantity: newIngredient.quantity.trim() || undefined,
          unit: newIngredient.unit.trim() || undefined,
          name: newIngredient.name.trim(),
        },
      ])
      setNewIngredient({ quantity: '', unit: '', name: '' })
    }
  }

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const id = createRecipe({
      title: title.trim(),
      description: description.trim() || undefined,
      imageUrl,
      prepTime: typeof prepTime === 'number' ? prepTime : undefined,
      cookTime: typeof cookTime === 'number' ? cookTime : undefined,
      servings: typeof servings === 'number' ? servings : undefined,
      category: category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      ingredients,
    })

    navigate(`/recipes/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/recipes"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-primary)] mb-6"
      >
        ← Back to recipes
      </Link>

      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">Add Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image upload */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
            Image
          </h2>
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-muted)]/30">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Recipe preview"
                  className="w-full aspect-[16/9] object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 text-white text-sm hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[16/9] cursor-pointer hover:bg-[var(--color-muted)]/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-5xl text-[var(--color-accent)] opacity-50 mb-2">📷</span>
                <span className="text-sm text-[var(--color-accent)]">
                  Click to upload image (max {MAX_IMAGE_SIZE_MB}MB)
                </span>
              </label>
            )}
          </div>
          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
        </section>

        {/* Title & Description */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
            Basic info
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Recipe name"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the recipe"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
            Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Prep time (min)
              </label>
              <input
                id="prepTime"
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Cook time (min)
              </label>
              <input
                id="cookTime"
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Servings
              </label>
              <input
                id="servings"
                type="number"
                min={0}
                value={servings}
                onChange={(e) => setServings(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>

        {/* Category & Tags */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
            Category & tags
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories"
                placeholder="e.g. Main, Dessert, Salad"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Comma-separated, e.g. quick, vegetarian, italian"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
            Ingredients
            <span className="font-normal text-[var(--color-accent)] ml-2">(for grocery list)</span>
          </h2>
          <ul className="space-y-2 mb-4">
            {ingredients.map((ing) => (
              <li
                key={ing.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--color-muted)]/30"
              >
                <span>
                  {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ing.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  aria-label="Remove ingredient"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 items-end">
            <input
              type="text"
              placeholder="Qty"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient((n) => ({ ...n, quantity: e.target.value }))}
              className="w-20 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient((n) => ({ ...n, unit: e.target.value }))}
              className="w-24 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Ingredient name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient((n) => ({ ...n, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
              className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors"
            >
              Add
            </button>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Create recipe
          </button>
          <Link
            to="/recipes"
            className="px-6 py-3 rounded-lg font-medium border border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RecipeNew
