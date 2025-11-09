import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecipeListItem } from '../types/Recipe';
import { apiService } from '../services/api';
import RecipeCard from './RecipeCard';
import './RecipeList.css';

const RECIPES_PER_PAGE = 21;

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);

  const loadRecipes = useCallback(async (offset = 0, isSearch = false, searchQuery = '') => {
    try {
      if (offset === 0) {
        setLoading(true);
        setRecipes([]);
      } else {
        setLoadingMore(true);
      }

      const data = await apiService.getRecipes({
        limit: RECIPES_PER_PAGE,
        offset,
        search: searchQuery || undefined
      });

      if (offset === 0) {
        setRecipes(data);
      } else {
        setRecipes(prev => [...prev, ...data]);
      }

      setHasMore(data.length === RECIPES_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
      if (offset === 0) {
        setRecipes([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const handleRecipeClick = (recipe: RecipeListItem) => {
    navigate(`/recipe/${recipe.recipe_id}`);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    loadRecipes(0, true, term);
  }, [loadRecipes]);

  // Initial load
  useEffect(() => {
    loadRecipes(0);
  }, [loadRecipes]);

  // Infinite scroll setup
  useEffect(() => {
    const loadMore = () => {
      if (!loadingMore && hasMore && !loading) {
        loadRecipes(recipes.length, !!searchTerm, searchTerm);
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingElementRef.current) {
      observerRef.current.observe(loadingElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [recipes.length, loadingMore, hasMore, loading, searchTerm, loadRecipes]);

  if (loading && recipes.length === 0) {
    return (
      <div className="recipe-list">
        <div className="app-loading">
          <div className="loading-spinner"></div>
          <p>Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <div className="recipe-list">
        <div className="app-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => loadRecipes(0)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <header className="recipe-list-header">
        <h1>Recipe Collection</h1>
        <p>Discover delicious recipes from our collection</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="recipe-stats">
        <span className="stats-item">
          📚 {recipes.length} recipes {searchTerm ? `matching "${searchTerm}"` : 'loaded'}
        </span>
        <span className="stats-item">
          🍳 Various cuisines & categories
        </span>
        {hasMore && (
          <span className="stats-item">
            ↓ Scroll for more
          </span>
        )}
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.recipe_id}
            recipe={recipe}
            onClick={handleRecipeClick}
          />
        ))}
      </div>

      {recipes.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No recipes found</h3>
          <p>{searchTerm ? `No recipes match "${searchTerm}". Try a different search term.` : 'Check back later for more delicious recipes!'}</p>
        </div>
      )}

      {/* Infinite scroll loading trigger */}
      {hasMore && (
        <div
          ref={loadingElementRef}
          className="loading-trigger"
          style={{ height: '20px', margin: '20px 0' }}
        >
          {loadingMore && (
            <div className="loading-more">
              <div className="loading-spinner-small"></div>
              <p>Loading more recipes...</p>
            </div>
          )}
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="end-of-results">
          <p>🎉 You've seen all the recipes! ({recipes.length} total)</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;