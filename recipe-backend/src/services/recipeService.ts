import { query } from '../database/connection.js';
import { Recipe, RecipeWithDetails, RecipeListItem } from '../types/database.js';

export class RecipeService {
  static async getAllRecipes(limit = 50, offset = 0): Promise<RecipeListItem[]> {
    const result = await query(`
      SELECT
        r.recipe_id,
        r.title,
        r.subtitle,
        r.main_image_url,
        r.prep_time_minutes,
        r.cook_time_minutes,
        r.base_servings,
        r.created_at,
        u.user_id,
        u.username,
        COALESCE(
          json_agg(
            json_build_object('category_id', rc.category_id, 'name', rc.name)
          ) FILTER (WHERE rc.category_id IS NOT NULL),
          '[]'
        ) as categories
      FROM recipes r
      LEFT JOIN users u ON r.creator_id = u.user_id
      LEFT JOIN recipe_category_assignments rca ON r.recipe_id = rca.recipe_id
      LEFT JOIN recipe_categories rc ON rca.category_id = rc.category_id
      WHERE r.deleted_at IS NULL AND r.is_public = true
      GROUP BY r.recipe_id, u.user_id, u.username
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return result.rows.map(row => ({
      recipe_id: row.recipe_id,
      title: row.title,
      subtitle: row.subtitle,
      main_image_url: row.main_image_url,
      prep_time_minutes: row.prep_time_minutes,
      cook_time_minutes: row.cook_time_minutes,
      base_servings: row.base_servings,
      created_at: row.created_at,
      creator: {
        user_id: row.user_id,
        username: row.username
      },
      categories: row.categories
    }));
  }

  static async getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    const recipeResult = await query(`
      SELECT
        r.*,
        u.user_id as creator_user_id,
        u.username as creator_username
      FROM recipes r
      LEFT JOIN users u ON r.creator_id = u.user_id
      WHERE r.recipe_id = $1 AND r.deleted_at IS NULL
    `, [id]);

    if (recipeResult.rows.length === 0) {
      return null;
    }

    const recipe = recipeResult.rows[0];

    const [stepsResult, ingredientsResult, categoriesResult] = await Promise.all([
      query(`
        SELECT * FROM recipe_steps
        WHERE recipe_id = $1
        ORDER BY step_number
      `, [id]),

      query(`
        SELECT
          ri.*,
          i.name as ingredient_name,
          i.category_id as ingredient_category_id,
          i.nutrition_per_amount,
          i.nutrition_unit_id,
          i.nutrition_data,
          i.created_at as ingredient_created_at,
          i.updated_at as ingredient_updated_at,
          u.name as unit_name,
          u.abbreviation as unit_abbreviation,
          u.type as unit_type,
          u.metric_equivalent_ml,
          u.metric_equivalent_g
        FROM recipe_ingredients ri
        LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
        LEFT JOIN units u ON ri.unit_id = u.unit_id
        WHERE ri.recipe_id = $1
        ORDER BY ri.sort_order
      `, [id]),

      query(`
        SELECT rc.category_id, rc.name
        FROM recipe_category_assignments rca
        JOIN recipe_categories rc ON rca.category_id = rc.category_id
        WHERE rca.recipe_id = $1
      `, [id])
    ]);

    return {
      ...recipe,
      creator: {
        user_id: recipe.creator_user_id,
        username: recipe.creator_username
      },
      steps: stepsResult.rows,
      ingredients: ingredientsResult.rows.map(row => ({
        recipe_ingredient_id: row.recipe_ingredient_id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        amount: row.amount,
        unit_id: row.unit_id,
        is_optional: row.is_optional,
        optional_amount: row.optional_amount,
        sort_order: row.sort_order,
        preparation_note: row.preparation_note,
        ingredient: {
          ingredient_id: row.ingredient_id,
          name: row.ingredient_name,
          category_id: row.ingredient_category_id,
          nutrition_per_amount: row.nutrition_per_amount,
          nutrition_unit_id: row.nutrition_unit_id,
          nutrition_data: row.nutrition_data,
          created_at: row.ingredient_created_at,
          updated_at: row.ingredient_updated_at
        },
        unit: row.unit_name ? {
          unit_id: row.unit_id,
          name: row.unit_name,
          abbreviation: row.unit_abbreviation,
          type: row.unit_type,
          metric_equivalent_ml: row.metric_equivalent_ml,
          metric_equivalent_g: row.metric_equivalent_g
        } : undefined
      })),
      categories: categoriesResult.rows
    };
  }

  static async searchRecipes(searchTerm: string, limit = 50, offset = 0): Promise<RecipeListItem[]> {
    const result = await query(`
      SELECT
        r.recipe_id,
        r.title,
        r.subtitle,
        r.main_image_url,
        r.prep_time_minutes,
        r.cook_time_minutes,
        r.base_servings,
        r.created_at,
        u.user_id,
        u.username,
        COALESCE(
          json_agg(
            json_build_object('category_id', rc.category_id, 'name', rc.name)
          ) FILTER (WHERE rc.category_id IS NOT NULL),
          '[]'
        ) as categories
      FROM recipes r
      LEFT JOIN users u ON r.creator_id = u.user_id
      LEFT JOIN recipe_category_assignments rca ON r.recipe_id = rca.recipe_id
      LEFT JOIN recipe_categories rc ON rca.category_id = rc.category_id
      WHERE r.deleted_at IS NULL
        AND r.is_public = true
        AND (
          to_tsvector('english', r.title) @@ plainto_tsquery('english', $1)
          OR r.title ILIKE $2
          OR r.subtitle ILIKE $2
        )
      GROUP BY r.recipe_id, u.user_id, u.username
      ORDER BY r.created_at DESC
      LIMIT $3 OFFSET $4
    `, [searchTerm, `%${searchTerm}%`, limit, offset]);

    return result.rows.map(row => ({
      recipe_id: row.recipe_id,
      title: row.title,
      subtitle: row.subtitle,
      main_image_url: row.main_image_url,
      prep_time_minutes: row.prep_time_minutes,
      cook_time_minutes: row.cook_time_minutes,
      base_servings: row.base_servings,
      created_at: row.created_at,
      creator: {
        user_id: row.user_id,
        username: row.username
      },
      categories: row.categories
    }));
  }
}