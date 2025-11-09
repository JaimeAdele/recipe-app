import React from 'react';
import type { RecipeListItem } from '../types/Recipe';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: RecipeListItem;
  onClick: (recipe: RecipeListItem) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-image">
        <img src={recipe.main_image_url} alt={recipe.title} />
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        {recipe.subtitle && (
          <p className="recipe-headline">{recipe.subtitle}</p>
        )}
        <div className="recipe-meta">
          <span className="prep-time">
            ⏱️ Prep: {formatTime(recipe.prep_time_minutes)}
          </span>
          <span className="cook-time">
            🍳 Cook: {formatTime(recipe.cook_time_minutes)}
          </span>
          <span className="servings">
            👥 Serves {recipe.base_servings}
          </span>
        </div>
        {recipe.categories.length > 0 && (
          <div className="recipe-categories">
            {recipe.categories.map((category) => (
              <span key={category.category_id} className="recipe-category">
                {category.name}
              </span>
            ))}
          </div>
        )}
        <div className="recipe-creator">
          By {recipe.creator.username}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;