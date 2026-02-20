export interface Ingredient {
  id: string
  quantity?: string
  unit?: string
  name: string
}

export interface Recipe {
  id: string
  title: string
  description?: string
  imageUrl?: string
  prepTime?: number // minutes
  cookTime?: number // minutes
  servings?: number
  category?: string
  tags?: string[]
  ingredients?: Ingredient[]
}
