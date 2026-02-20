import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Recipe, Ingredient } from '../types/recipe'
import { sampleRecipes } from '../data/sampleRecipes'

interface RecipesContextValue {
  recipes: Recipe[]
  getRecipe: (id: string) => Recipe | undefined
  createRecipe: (recipe: Omit<Recipe, 'id'>) => string
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  addIngredient: (recipeId: string, ingredient: Ingredient) => void
  updateIngredient: (recipeId: string, ingredientId: string, updates: Partial<Ingredient>) => void
  removeIngredient: (recipeId: string, ingredientId: string) => void
}

const RecipesContext = createContext<RecipesContextValue | null>(null)

function generateId() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)

  const getRecipe = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes]
  )

  const createRecipe = useCallback((recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = { ...recipe, id: generateId() }
    setRecipes((prev) => [...prev, newRecipe])
    return newRecipe.id
  }, [])

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
  }, [])

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const addIngredient = useCallback((recipeId: string, ingredient: Ingredient) => {
    const newIngredient = { ...ingredient, id: ingredient.id || generateId() }
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              ingredients: [...(r.ingredients ?? []), newIngredient],
            }
          : r
      )
    )
  }, [])

  const updateIngredient = useCallback(
    (recipeId: string, ingredientId: string, updates: Partial<Ingredient>) => {
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                ingredients: (r.ingredients ?? []).map((i) =>
                  i.id === ingredientId ? { ...i, ...updates } : i
                ),
              }
            : r
        )
      )
    },
    []
  )

  const removeIngredient = useCallback((recipeId: string, ingredientId: string) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId
          ? {
              ...r,
              ingredients: (r.ingredients ?? []).filter((i) => i.id !== ingredientId),
            }
          : r
      )
    )
  }, [])

  const value: RecipesContextValue = {
    recipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    addIngredient,
    updateIngredient,
    removeIngredient,
  }

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  )
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider')
  return ctx
}
