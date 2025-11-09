export interface Ingredient {
  ingredient_id: string;
  name: string;
  category_id?: string;
  nutrition_per_amount: number;
  nutrition_unit_id?: string;
  nutrition_data?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Unit {
  unit_id: string;
  name: string;
  abbreviation: string;
  type: 'volume' | 'weight' | 'unit';
  metric_equivalent_ml?: number;
  metric_equivalent_g?: number;
}

export interface RecipeIngredient {
  recipe_ingredient_id: string;
  recipe_id: string;
  ingredient_id: string;
  amount?: number;
  unit_id?: string;
  is_optional: boolean;
  optional_amount: boolean;
  sort_order: number;
  preparation_note?: string;
  ingredient: Ingredient;
  unit?: Unit;
}

export interface Step {
  step_id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  image_url?: string;
  image_caption?: string;
}

export interface NutritionItem {
  type: string;
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeCategory {
  category_id: string;
  name: string;
}

export interface Recipe {
  recipe_id: string;
  creator_id: string;
  title: string;
  subtitle?: string;
  main_image_url: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  base_servings: number;
  nutrition_data?: any;
  website_link?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface RecipeWithDetails extends Recipe {
  steps: Step[];
  ingredients: RecipeIngredient[];
  categories: RecipeCategory[];
  creator: {
    user_id: string;
    username: string;
  };
}

export interface RecipeListItem {
  recipe_id: string;
  title: string;
  subtitle?: string;
  main_image_url: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  base_servings: number;
  created_at: Date;
  creator: {
    user_id: string;
    username: string;
  };
  categories: RecipeCategory[];
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