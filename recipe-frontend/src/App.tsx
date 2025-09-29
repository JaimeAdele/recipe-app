import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import type { WeekData, Recipe } from './types/Recipe'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetch('/data/recipe_example_data.json')
        if (!response.ok) {
          throw new Error('Failed to load recipes')
        }
        const data: WeekData = await response.json()

        // Extract unique recipes from meals
        const uniqueRecipes: Recipe[] = []
        const seenIds = new Set<string>()

        data.meals.forEach(meal => {
          if (!seenIds.has(meal.recipe.id)) {
            seenIds.add(meal.recipe.id)
            uniqueRecipes.push(meal.recipe)
          }
        })

        setRecipes(uniqueRecipes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading delicious recipes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<RecipeList recipes={recipes} />} />
          <Route path="/recipe/:id" element={<RecipeDetail recipes={recipes} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
