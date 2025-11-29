const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to Supabase PostgreSQL at:', res.rows[0].now);
  }
});

// Helper functions for common operations
const db = {
  query: (text, params) => pool.query(text, params),

  // User operations
  async createUser({ email, password, name }) {
    const result = await pool.query(
      `INSERT INTO "User" (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, "avatarUrl", "isPremium", "createdAt"`,
      [email, password, name]
    );
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const result = await pool.query(`SELECT * FROM "User" WHERE email = $1`, [email]);
    return result.rows[0];
  },

  async getUserById(id) {
    const result = await pool.query(
      `SELECT id, email, name, "avatarUrl", "isPremium", "createdAt" FROM "User" WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Cookbook operations
  async createCookbook({ name, description, userId, isDefault = false }) {
    const result = await pool.query(
      `INSERT INTO "Cookbook" (name, description, "userId", "isDefault") VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, userId, isDefault]
    );
    return result.rows[0];
  },

  async getCookbooksByUser(userId) {
    const result = await pool.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM "Recipe" r WHERE r."cookbookId" = c.id) as "recipeCount",
        (SELECT json_agg(r."imageUrl") FROM (SELECT "imageUrl" FROM "Recipe" WHERE "cookbookId" = c.id AND "imageUrl" IS NOT NULL LIMIT 4) r) as thumbnails
      FROM "Cookbook" c WHERE c."userId" = $1 ORDER BY c."isDefault" DESC, c."createdAt" ASC`,
      [userId]
    );
    return result.rows;
  },

  async getCookbookById(id, userId) {
    const result = await pool.query(
      `SELECT * FROM "Cookbook" WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  // Recipe operations
  async createRecipe(recipe) {
    const result = await pool.query(
      `INSERT INTO "Recipe" (title, description, "imageUrl", "sourceUrl", "sourcePlatform", "prepTime", "cookTime", servings, difficulty, cuisine, tags, "rawContent", "aiConfidence", "userId", "cookbookId")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [recipe.title, recipe.description, recipe.imageUrl, recipe.sourceUrl, recipe.sourcePlatform, recipe.prepTime, recipe.cookTime, recipe.servings, recipe.difficulty, recipe.cuisine, recipe.tags, recipe.rawContent, recipe.aiConfidence, recipe.userId, recipe.cookbookId]
    );
    return result.rows[0];
  },

  async createIngredients(recipeId, ingredients) {
    for (const ing of ingredients) {
      await pool.query(
        `INSERT INTO "Ingredient" (name, quantity, unit, notes, "order", "recipeId") VALUES ($1, $2, $3, $4, $5, $6)`,
        [ing.name, ing.quantity, ing.unit, ing.notes, ing.order, recipeId]
      );
    }
  },

  async createInstructions(recipeId, instructions) {
    for (const inst of instructions) {
      await pool.query(
        `INSERT INTO "Instruction" ("stepNumber", text, duration, "recipeId") VALUES ($1, $2, $3, $4)`,
        [inst.stepNumber, inst.text, inst.duration, recipeId]
      );
    }
  },

  async getRecipesByUser(userId, { search, cookbookId, limit = 20, offset = 0 } = {}) {
    let query = `SELECT * FROM "Recipe" WHERE "userId" = $1`;
    const params = [userId];
    let paramIndex = 2;

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (cookbookId) {
      query += ` AND "cookbookId" = $${paramIndex}`;
      params.push(cookbookId);
      paramIndex++;
    }

    query += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getRecipeById(id, userId) {
    const recipeResult = await pool.query(
      `SELECT * FROM "Recipe" WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    if (!recipeResult.rows[0]) return null;

    const recipe = recipeResult.rows[0];

    const ingredientsResult = await pool.query(
      `SELECT * FROM "Ingredient" WHERE "recipeId" = $1 ORDER BY "order"`,
      [id]
    );
    recipe.ingredients = ingredientsResult.rows;

    const instructionsResult = await pool.query(
      `SELECT * FROM "Instruction" WHERE "recipeId" = $1 ORDER BY "stepNumber"`,
      [id]
    );
    recipe.instructions = instructionsResult.rows;

    return recipe;
  },

  async deleteRecipe(id, userId) {
    await pool.query(`DELETE FROM "Recipe" WHERE id = $1 AND "userId" = $2`, [id, userId]);
  },

  // Grocery operations
  async getGroceriesByUser(userId) {
    const result = await pool.query(
      `SELECT * FROM "GroceryItem" WHERE "userId" = $1 ORDER BY "isChecked", category, name`,
      [userId]
    );
    return result.rows;
  },

  async createGroceryItem({ name, quantity, unit, category, userId }) {
    const result = await pool.query(
      `INSERT INTO "GroceryItem" (name, quantity, unit, category, "userId") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, quantity, unit, category, userId]
    );
    return result.rows[0];
  },

  async toggleGroceryItem(id, userId) {
    const result = await pool.query(
      `UPDATE "GroceryItem" SET "isChecked" = NOT "isChecked" WHERE id = $1 AND "userId" = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  },

  async deleteGroceryItem(id, userId) {
    await pool.query(`DELETE FROM "GroceryItem" WHERE id = $1 AND "userId" = $2`, [id, userId]);
  },

  async clearCheckedGroceries(userId) {
    const result = await pool.query(
      `DELETE FROM "GroceryItem" WHERE "userId" = $1 AND "isChecked" = true`,
      [userId]
    );
    return result.rowCount;
  },

  // Meal plan operations
  async getMealPlan(userId, weekStart) {
    let result = await pool.query(
      `SELECT * FROM "MealPlan" WHERE "userId" = $1 AND "weekStart" = $2`,
      [userId, weekStart]
    );

    if (!result.rows[0]) {
      result = await pool.query(
        `INSERT INTO "MealPlan" ("userId", "weekStart") VALUES ($1, $2) RETURNING *`,
        [userId, weekStart]
      );
    }

    const mealPlan = result.rows[0];

    const itemsResult = await pool.query(
      `SELECT mpi.*, r.title as "recipeTitle", r."imageUrl" as "recipeImage"
       FROM "MealPlanItem" mpi
       JOIN "Recipe" r ON r.id = mpi."recipeId"
       WHERE mpi."mealPlanId" = $1
       ORDER BY mpi.date, mpi."mealType"`,
      [mealPlan.id]
    );
    mealPlan.items = itemsResult.rows;

    return mealPlan;
  },

  async addMealPlanItem({ mealPlanId, recipeId, date, mealType }) {
    const result = await pool.query(
      `INSERT INTO "MealPlanItem" ("mealPlanId", "recipeId", date, "mealType") VALUES ($1, $2, $3, $4) RETURNING *`,
      [mealPlanId, recipeId, date, mealType]
    );
    return result.rows[0];
  },

  async deleteMealPlanItem(id) {
    await pool.query(`DELETE FROM "MealPlanItem" WHERE id = $1`, [id]);
  },
};

module.exports = db;
