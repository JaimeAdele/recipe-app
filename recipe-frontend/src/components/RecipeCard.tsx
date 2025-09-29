import React from 'react';
import type { Recipe } from '../types/Recipe';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.name} />
        {recipe.label && (
          <div
            className="recipe-label"
            style={{
              backgroundColor: recipe.label.backgroundColor,
              color: recipe.label.foregroundColor
            }}
          >
            {recipe.label.text}
          </div>
        )}
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.name}</h3>
        {recipe.headline && (
          <p className="recipe-headline">{recipe.headline}</p>
        )}
        <div className="recipe-meta">
          {recipe.prepTime && (
            <span className="prep-time">
              ⏱️ {recipe.prepTime.replace('PT', '').replace('M', ' min')}
            </span>
          )}
          {recipe.nutrition && (
            <span className="calories">
              🔥 {recipe.nutrition.calories} cal
            </span>
          )}
        </div>
        {recipe.category && (
          <span className="recipe-category">{recipe.category}</span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;