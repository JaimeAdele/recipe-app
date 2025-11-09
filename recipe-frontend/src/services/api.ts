import type { RecipeListItem, RecipeWithDetails } from '../types/Recipe';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getRecipes(options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<RecipeListItem[]> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.search) params.append('search', options.search);

    const queryString = params.toString();
    const url = `/recipes${queryString ? `?${queryString}` : ''}`;

    return this.fetchJson<RecipeListItem[]>(url);
  }

  async getRecipeById(id: string): Promise<RecipeWithDetails> {
    return this.fetchJson<RecipeWithDetails>(`/recipes/${id}`);
  }

  async searchRecipes(searchTerm: string, options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<RecipeListItem[]> {
    return this.getRecipes({ ...options, search: searchTerm });
  }

  async healthCheck(): Promise<{ status: string; database: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;