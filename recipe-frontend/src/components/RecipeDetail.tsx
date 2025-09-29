import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Recipe } from '../types/Recipe';
import './RecipeDetail.css';

interface RecipeDetailProps {
  recipes: Recipe[];
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipes }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const recipe = recipes.find(r => r.id === id);

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
        <div className="recipe-hero-content">
          <h1>{recipe.name}</h1>
          {recipe.headline && <p className="recipe-subtitle">{recipe.headline}</p>}
          <div className="recipe-quick-info">
            {recipe.prepTime && (
              <div className="info-item">
                <span className="info-label">Prep Time</span>
                <span className="info-value">
                  {recipe.prepTime.replace('PT', '').replace('M', ' min')}
                </span>
              </div>
            )}
            {recipe.totalTime && (
              <div className="info-item">
                <span className="info-label">Total Time</span>
                <span className="info-value">
                  {recipe.totalTime.replace('PT', '').replace('M', ' min')}
                </span>
              </div>
            )}
            {recipe.nutrition && (
              <div className="info-item">
                <span className="info-label">Calories</span>
                <span className="info-value">{recipe.nutrition.calories}</span>
              </div>
            )}
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
              <div className="overview-section">
                <h4>Category</h4>
                <p>{recipe.category || 'Not specified'}</p>
              </div>
              {recipe.cuisines && recipe.cuisines.length > 0 && (
                <div className="overview-section">
                  <h4>Cuisine</h4>
                  <p>{recipe.cuisines.map(c => c.name).join(', ')}</p>
                </div>
              )}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="overview-section">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {recipe.tags
                      .filter(tag => tag.displayLabel !== false)
                      .map((tag, index) => (
                        <span key={index} className="tag">
                          {tag.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {recipe.websiteURL && (
              <div className="external-link">
                <a
                  href={recipe.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-button"
                >
                  View Full Recipe Instructions
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="tab-panel">
            <h3>Nutrition Information</h3>
            {recipe.nutrition ? (
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">{recipe.nutrition.calories}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbohydrates</span>
                  <span className="nutrition-value">{recipe.nutrition.carbohydrate}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{recipe.nutrition.protein}g</span>
                </div>
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
                <strong>Recipe ID:</strong> {recipe.id}
              </div>
              {recipe.prepTime && (
                <div className="detail-item">
                  <strong>Preparation Time:</strong>{' '}
                  {recipe.prepTime.replace('PT', '').replace('M', ' minutes')}
                </div>
              )}
              {recipe.totalTime && (
                <div className="detail-item">
                  <strong>Total Time:</strong>{' '}
                  {recipe.totalTime.replace('PT', '').replace('M', ' minutes')}
                </div>
              )}
              {recipe.category && (
                <div className="detail-item">
                  <strong>Category:</strong> {recipe.category}
                </div>
              )}
              {recipe.cuisines && recipe.cuisines.length > 0 && (
                <div className="detail-item">
                  <strong>Cuisines:</strong>{' '}
                  {recipe.cuisines.map(c => `${c.name} (${c.type})`).join(', ')}
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