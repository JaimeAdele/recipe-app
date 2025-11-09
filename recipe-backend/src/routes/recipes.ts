import express from 'express';
import { RecipeService } from '../services/recipeService.js';

const router = express.Router();

// GET /api/recipes - Get all recipes with pagination
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;

    let recipes;
    if (search) {
      recipes = await RecipeService.searchRecipes(search, limit, offset);
    } else {
      recipes = await RecipeService.getAllRecipes(limit, offset);
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/recipes/:id - Get a specific recipe with details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeService.getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;