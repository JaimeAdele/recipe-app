import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';
import './RecipeList.css';

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const navigate = useNavigate();

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="recipe-list">
      <header className="recipe-list-header">
        <h1>Recipe Collection</h1>
        <p>Discover delicious recipes from our collection</p>
      </header>

      <div className="recipe-stats">
        <span className="stats-item">
          📚 {recipes.length} recipes available
        </span>
        <span className="stats-item">
          🍳 Various cuisines & categories
        </span>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={handleRecipeClick}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="empty-state">
          <h3>No recipes found</h3>
          <p>Check back later for more delicious recipes!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;