export type UserRole = 'admin' | 'contributor' | 'regular';
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type UnitType = 'volume' | 'weight' | 'unit';
export type PreferredUnitSystem = 'imperial' | 'metric';

export interface User {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  profile_image_url?: string;
  preferred_units: PreferredUnitSystem;
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

export interface RecipeStep {
  step_id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  image_url?: string;
  image_caption?: string;
}

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
  type: UnitType;
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
}

export interface RecipeCategory {
  category_id: string;
  name: string;
}

export interface IngredientCategory {
  category_id: string;
  name: string;
  sort_order: number;
}

export interface Allergen {
  allergen_id: string;
  name: string;
  description?: string;
}

// Extended types for API responses
export interface RecipeWithDetails extends Recipe {
  steps: RecipeStep[];
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient;
    unit?: Unit;
  })[];
  categories: RecipeCategory[];
  creator: Pick<User, 'user_id' | 'username'>;
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
  creator: Pick<User, 'user_id' | 'username'>;
  categories: RecipeCategory[];
}