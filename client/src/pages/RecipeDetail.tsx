import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import type { Ingredient } from '../types/recipe'

function generateId() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecipe, updateRecipe, deleteRecipe, addIngredient, updateIngredient, removeIngredient } = useRecipes()
  const recipe = id ? getRecipe(id) : undefined

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editDescription, setEditDescription] = useState('')
  const [editStats, setEditStats] = useState({ prepTime: 0, cookTime: 0, servings: 0 })
  const [newIngredient, setNewIngredient] = useState({ quantity: '', unit: '', name: '' })

  useEffect(() => {
    if (recipe) {
      setEditTitle(recipe.title)
      setEditDescription(recipe.description ?? '')
      setEditStats({
        prepTime: recipe.prepTime ?? 0,
        cookTime: recipe.cookTime ?? 0,
        servings: recipe.servings ?? 0,
      })
    }
  }, [recipe])

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-[var(--color-accent)]">Recipe not found.</p>
        <Link to="/recipes" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
          ← Back to recipes
        </Link>
      </div>
    )
  }

  const ingredients = recipe.ingredients ?? []

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateRecipe(recipe.id, { title: editTitle.trim() })
      setIsEditingTitle(false)
    }
  }

  const handleSaveDescription = () => {
    updateRecipe(recipe.id, { description: editDescription.trim() || undefined })
    setIsEditingDescription(false)
  }

  const handleSaveStats = () => {
    updateRecipe(recipe.id, {
      prepTime: editStats.prepTime || undefined,
      cookTime: editStats.cookTime || undefined,
      servings: editStats.servings || undefined,
    })
  }

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      addIngredient(recipe.id, {
        id: generateId(),
        quantity: newIngredient.quantity.trim() || undefined,
        unit: newIngredient.unit.trim() || undefined,
        name: newIngredient.name.trim(),
      })
      setNewIngredient({ quantity: '', unit: '', name: '' })
    }
  }

  const handleDeleteRecipe = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id)
      navigate('/recipes')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-primary)]"
        >
          ← Back to recipes
        </Link>
        <button
          type="button"
          onClick={handleDeleteRecipe}
          className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Delete recipe
        </button>
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden mb-8">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full aspect-[16/9] object-cover"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-[var(--color-muted)] flex items-center justify-center">
            <span className="text-6xl text-[var(--color-accent)] opacity-40">🍳</span>
          </div>
        )}
      </div>

      {/* Title - editable */}
      <div className="mb-4">
        {isEditingTitle ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              className="flex-1 text-3xl font-bold text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-3xl font-bold text-[var(--color-text)] cursor-pointer hover:bg-[var(--color-muted)] rounded-lg px-2 py-1 -mx-2 transition-colors"
            title="Click to edit"
          >
            {recipe.title}
          </h1>
        )}
      </div>

      {/* Description - editable */}
      <div className="mb-8">
        {isEditingDescription ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full min-h-[80px] text-[var(--color-accent)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Recipe description..."
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveDescription}
                className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditDescription(recipe.description ?? '')
                  setIsEditingDescription(false)
                }}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            onClick={() => setIsEditingDescription(true)}
            className="text-[var(--color-accent)] cursor-pointer hover:bg-[var(--color-muted)] rounded-lg px-2 py-1 -mx-2 transition-colors min-h-[1.5em]"
            title="Click to edit"
          >
            {recipe.description || 'Add a description...'}
          </p>
        )}
      </div>

      {/* Stats - editable */}
      <section className="mb-8 p-4 rounded-xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-3">
          Stats
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[var(--color-accent)] mb-1">Prep (min)</label>
            <input
              type="number"
              min={0}
              value={editStats.prepTime || ''}
              onChange={(e) =>
                setEditStats((s) => ({ ...s, prepTime: parseInt(e.target.value, 10) || 0 }))
              }
              onBlur={handleSaveStats}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-accent)] mb-1">Cook (min)</label>
            <input
              type="number"
              min={0}
              value={editStats.cookTime || ''}
              onChange={(e) =>
                setEditStats((s) => ({ ...s, cookTime: parseInt(e.target.value, 10) || 0 }))
              }
              onBlur={handleSaveStats}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-accent)] mb-1">Servings</label>
            <input
              type="number"
              min={0}
              value={editStats.servings || ''}
              onChange={(e) =>
                setEditStats((s) => ({ ...s, servings: parseInt(e.target.value, 10) || 0 }))
              }
              onBlur={handleSaveStats}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </section>

      {/* Ingredients - editable */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
          Ingredients
          <span className="text-sm font-normal text-[var(--color-accent)] ml-2">
            (for grocery list)
          </span>
        </h2>

        <ul className="space-y-2 mb-6">
          {ingredients.map((ing) => (
            <EditableIngredientRow
              key={ing.id}
              ingredient={ing}
              onUpdate={(updates) => updateIngredient(recipe.id, ing.id, updates)}
              onRemove={() => removeIngredient(recipe.id, ing.id)}
            />
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
            onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
            className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90"
          >
            Add
          </button>
        </div>
      </section>
    </div>
  )
}

function EditableIngredientRow({
  ingredient,
  onUpdate,
  onRemove,
}: {
  ingredient: Ingredient
  onUpdate: (updates: Partial<Ingredient>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [edit, setEdit] = useState({
    quantity: ingredient.quantity ?? '',
    unit: ingredient.unit ?? '',
    name: ingredient.name,
  })

  useEffect(() => {
    if (!isEditing) {
      setEdit({
        quantity: ingredient.quantity ?? '',
        unit: ingredient.unit ?? '',
        name: ingredient.name,
      })
    }
  }, [ingredient, isEditing])

  const handleSave = () => {
    onUpdate({
      quantity: edit.quantity.trim() || undefined,
      unit: edit.unit.trim() || undefined,
      name: edit.name.trim(),
    })
    setIsEditing(false)
  }

  const displayText = [edit.quantity, edit.unit, edit.name].filter(Boolean).join(' ')

  return (
    <li className="flex items-center gap-2 group">
      {isEditing ? (
        <>
          <input
            type="text"
            placeholder="Qty"
            value={edit.quantity}
            onChange={(e) => setEdit((p) => ({ ...p, quantity: e.target.value }))}
            className="w-20 px-2 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
          <input
            type="text"
            placeholder="Unit"
            value={edit.unit}
            onChange={(e) => setEdit((p) => ({ ...p, unit: e.target.value }))}
            className="w-20 px-2 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
          <input
            type="text"
            placeholder="Name"
            value={edit.name}
            onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 px-2 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSave}
            className="px-2 py-1.5 text-sm rounded bg-[var(--color-primary)] text-white"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <span
            onClick={() => setIsEditing(true)}
            className="flex-1 py-1.5 px-2 rounded cursor-pointer hover:bg-[var(--color-muted)] transition-colors"
            title="Click to edit"
          >
            {displayText || '(empty)'}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-red-600 hover:bg-red-50 transition-all"
            aria-label="Remove ingredient"
          >
            ×
          </button>
        </>
      )}
    </li>
  )
}

export default RecipeDetail
