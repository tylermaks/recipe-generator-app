import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { useRecipes } from '../context/RecipesContext'
import type { Recipe } from '../types/recipe'

function Recipes() {
  const { recipes } = useRecipes()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const categories = useMemo(() => {
    const cats = new Set(recipes.map((r) => r.category).filter(Boolean))
    return Array.from(cats).sort() as string[]
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        !searchQuery ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory =
        !categoryFilter || recipe.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, categoryFilter])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Recipes</h1>
        <Link
          to="/recipes/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity shrink-0"
        >
          <span aria-hidden>+</span>
          Add Recipe
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            aria-label="Search recipes"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sm:w-48 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <p className="text-center py-12 text-[var(--color-accent)]">
          No recipes match your filters. Try adjusting your search or category.
        </p>
      )}
    </div>
  )
}

export default Recipes
