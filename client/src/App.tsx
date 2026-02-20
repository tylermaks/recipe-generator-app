import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RecipesProvider } from './context/RecipesContext'
import MainNav from './components/MainNav'
import Recipes from './pages/Recipes'
import RecipeNew from './pages/RecipeNew'
import RecipeDetail from './pages/RecipeDetail'
import Basket from './pages/Basket'

function App() {
  const user = { name: 'Tyler' } // Replace with auth context when available

  return (
    <BrowserRouter>
      <RecipesProvider>
        <div className="w-full shadow-md">
          <MainNav user={user} onSignOut={() => console.log('Sign out')} />
        </div>
        <main className="min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/new" element={<RecipeNew />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/basket" element={<Basket />} />
          </Routes>
        </main>
      </RecipesProvider>
    </BrowserRouter>
  )
}

export default App
