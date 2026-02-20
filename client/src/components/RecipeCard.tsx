import { Link } from 'react-router-dom'
import type { Recipe } from '../types/recipe'

interface RecipeCardProps {
  recipe: Recipe
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) || undefined

  return (
    <Link to={`/recipes/${recipe.id}`} className="block no-underline text-inherit">
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer">
      {recipe.imageUrl ? (
        <div className="aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-[var(--color-muted)] flex items-center justify-center">
          <span className="text-4xl text-[var(--color-accent)] opacity-40">🍳</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[var(--color-text)] line-clamp-1">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="mt-1 text-sm text-[var(--color-accent)] line-clamp-2">
            {recipe.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-accent)]">
          {totalTime ? (
            <span>{totalTime} min</span>
          ) : null}
          {recipe.servings ? (
            <span>{recipe.servings} servings</span>
          ) : null}
          {recipe.category ? (
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-muted)]">
              {recipe.category}
            </span>
          ) : null}
        </div>
      </div>
    </article>
    </Link>
  )
}

export default RecipeCard
