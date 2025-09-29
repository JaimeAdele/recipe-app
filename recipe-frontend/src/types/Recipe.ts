export interface Recipe {
  id: string;
  name: string;
  headline?: string;
  prepTime?: string;
  totalTime?: string;
  image: string;
  websiteURL?: string;
  nutrition?: {
    calories: number;
    carbohydrate: number;
    protein: number;
  };
  cuisines?: Array<{
    name: string;
    type: string;
  }>;
  category?: string;
  tags?: Array<{
    name: string;
    type: string;
    displayLabel?: boolean;
  }>;
  label?: {
    text: string;
    handle: string;
    backgroundColor: string;
    foregroundColor: string;
  };
}

export interface Meal {
  recipe: Recipe;
  recipeFamily: string;
  index: number;
}

export interface WeekData {
  id: string;
  week: string;
  meals: Meal[];
}