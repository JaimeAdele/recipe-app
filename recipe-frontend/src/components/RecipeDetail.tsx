import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { RecipeWithDetails } from '../types/Recipe';
import { apiService } from '../services/api';
import './RecipeDetail.css';

interface RecipeDetailProps {}

const RecipeDetail: React.FC<RecipeDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedServings, setSelectedServings] = useState(4);
  const [recipe, setRecipe] = useState<RecipeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component loads or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch detailed recipe data
  useEffect(() => {
    const fetchDetailedRecipe = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await apiService.getRecipeById(id);
        setRecipe(data);
        setSelectedServings(data.base_servings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedRecipe();
  }, [id]);

  // Calculate scaled ingredients based on selected servings
  const scaledIngredients = recipe?.ingredients.map(ingredient => {
    const scaleFactor = selectedServings / recipe.base_servings;
    return {
      ...ingredient,
      scaledAmount: ingredient.amount ? ingredient.amount * scaleFactor : undefined
    };
  }) || [];

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${remainingMinutes}m`;
  };

  if (error) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Recipes
          </button>
        </div>
        <div className="recipe-not-found">
          <h2>Error loading recipe</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Recipes
          </button>
        </div>
        <div className="recipe-loading">
          <div className="loading-spinner"></div>
          <p>Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Recipes
          </button>
        </div>
        <div className="recipe-not-found">
          <h2>Recipe not found</h2>
          <p>The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Recipes
        </button>
      </div>

      <div className="recipe-hero">
        <div className="recipe-hero-image">
          <img src={recipe.main_image_url} alt={recipe.title} />
        </div>
        <div className="recipe-hero-content">
          <h1>{recipe.title}</h1>
          {recipe.subtitle && <p className="recipe-subtitle">{recipe.subtitle}</p>}
          <div className="recipe-quick-info">
            <div className="info-item">
              <span className="info-label">Prep Time</span>
              <span className="info-value">{formatTime(recipe.prep_time_minutes)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cook Time</span>
              <span className="info-value">{formatTime(recipe.cook_time_minutes)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Time</span>
              <span className="info-value">{formatTime(recipe.prep_time_minutes + recipe.cook_time_minutes)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Servings</span>
              <span className="info-value">{recipe.base_servings}</span>
            </div>
          </div>
          <div className="recipe-creator-info">
            Created by <strong>{recipe.creator.username}</strong>
          </div>
        </div>
      </div>

      <div className="recipe-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <button
            className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
        )}
        {recipe.steps && recipe.steps.length > 0 && (
          <button
            className={`tab-button ${activeTab === 'instructions' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructions')}
          >
            Instructions
          </button>
        )}
        <button
          className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          Nutrition
        </button>
        <button
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      <div className="recipe-tab-content">
        {activeTab === 'overview' && (
          <div className="tab-panel">
            <h3>Recipe Overview</h3>
            <div className="overview-grid">
              {recipe.categories.length > 0 && (
                <div className="overview-section">
                  <h4>Categories</h4>
                  <div className="tags-container">
                    {recipe.categories.map((category) => (
                      <span key={category.category_id} className="tag">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="overview-section">
                <h4>Prep & Cook Time</h4>
                <p>Prep: {formatTime(recipe.prep_time_minutes)} • Cook: {formatTime(recipe.cook_time_minutes)}</p>
              </div>
              <div className="overview-section">
                <h4>Base Servings</h4>
                <p>{recipe.base_servings} people</p>
              </div>
              <div className="overview-section">
                <h4>Created</h4>
                <p>{new Date(recipe.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {recipe.website_link && (
              <div className="external-link">
                <a
                  href={recipe.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-button"
                >
                  View Original Recipe Source
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="tab-panel">
            <div className="ingredients-header">
              <h3>Ingredients</h3>
              <div className="serving-selector">
                <label htmlFor="servings">Adjust for servings:</label>
                <input
                  type="number"
                  id="servings"
                  value={selectedServings}
                  onChange={(e) => setSelectedServings(Number(e.target.value))}
                  min="1"
                  max="50"
                  className="servings-input"
                />
                <span className="base-servings">
                  (Recipe base: {recipe.base_servings} servings)
                </span>
              </div>
            </div>
            {scaledIngredients.length > 0 ? (
              <div className="ingredients-list">
                {scaledIngredients.map((ingredient, index) => (
                  <div key={ingredient.recipe_ingredient_id || index} className="ingredient-item">
                    <div className="ingredient-amount">
                      {ingredient.scaledAmount && ingredient.unit ? (
                        <span className="amount">
                          {ingredient.scaledAmount.toFixed(2)} {ingredient.unit.abbreviation}
                        </span>
                      ) : ingredient.scaledAmount ? (
                        <span className="amount">{ingredient.scaledAmount.toFixed(2)}</span>
                      ) : ingredient.optional_amount ? (
                        <span className="amount">Optional amount</span>
                      ) : (
                        <span className="amount">To taste</span>
                      )}
                    </div>
                    <div className="ingredient-name">
                      {ingredient.ingredient.name}
                      {ingredient.is_optional && <em> (optional)</em>}
                      {ingredient.preparation_note && (
                        <span className="prep-note"> - {ingredient.preparation_note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Ingredient information not available for this recipe.</p>
            )}
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="tab-panel">
            <h3>Instructions</h3>
            {recipe.steps && recipe.steps.length > 0 ? (
              <div className="instructions-list">
                {recipe.steps
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((step, index) => (
                  <div key={step.step_id || index} className="instruction-step">
                    <div className="step-number">
                      {step.step_number}
                    </div>
                    <div className="step-content">
                      <div className="step-text">
                        {step.instruction}
                      </div>
                      {step.image_url && (
                        <div className="step-images">
                          <img
                            src={step.image_url}
                            alt={step.image_caption || `Step ${step.step_number}`}
                            className="step-image"
                          />
                          {step.image_caption && (
                            <div className="image-caption">{step.image_caption}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Instructions not available for this recipe.</p>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="tab-panel">
            <h3>Nutrition Information</h3>
            {recipe.nutrition_data ? (
              <div className="nutrition-grid">
                <pre>{JSON.stringify(recipe.nutrition_data, null, 2)}</pre>
              </div>
            ) : (
              <p>Nutrition information not available for this recipe.</p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="tab-panel">
            <h3>Recipe Details</h3>
            <div className="details-list">
              <div className="detail-item">
                <strong>Recipe ID:</strong> {recipe.recipe_id}
              </div>
              <div className="detail-item">
                <strong>Creator:</strong> {recipe.creator.username}
              </div>
              <div className="detail-item">
                <strong>Preparation Time:</strong> {formatTime(recipe.prep_time_minutes)}
              </div>
              <div className="detail-item">
                <strong>Cook Time:</strong> {formatTime(recipe.cook_time_minutes)}
              </div>
              <div className="detail-item">
                <strong>Total Time:</strong> {formatTime(recipe.prep_time_minutes + recipe.cook_time_minutes)}
              </div>
              <div className="detail-item">
                <strong>Base Servings:</strong> {recipe.base_servings}
              </div>
              {recipe.categories.length > 0 && (
                <div className="detail-item">
                  <strong>Categories:</strong> {recipe.categories.map(c => c.name).join(', ')}
                </div>
              )}
              <div className="detail-item">
                <strong>Public Recipe:</strong> {recipe.is_public ? 'Yes' : 'No'}
              </div>
              <div className="detail-item">
                <strong>Created:</strong> {new Date(recipe.created_at).toLocaleString()}
              </div>
              <div className="detail-item">
                <strong>Last Updated:</strong> {new Date(recipe.updated_at).toLocaleString()}
              </div>
              {recipe.website_link && (
                <div className="detail-item">
                  <strong>Original Source:</strong>{' '}
                  <a href={recipe.website_link} target="_blank" rel="noopener noreferrer">
                    View External Recipe
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;