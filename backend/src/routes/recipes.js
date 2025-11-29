const express = require('express');
const { authenticate } = require('../middleware/auth');
const { extractRecipeFromContent } = require('../services/aiRecipeExtractor');

const router = express.Router();

router.use(authenticate);

// Extract recipe from shared content (main AI feature)
router.post('/extract', async (req, res, next) => {
  try {
    const { imageUrls, videoUrl, caption, sourceUrl, cookbookId } = req.body;

    if (!imageUrls?.length && !videoUrl && !caption) {
      return res.status(400).json({
        error: 'Please provide at least one of: images, video URL, or caption',
      });
    }

    // Extract recipe using AI
    const extractedRecipe = await extractRecipeFromContent({
      imageUrls,
      videoUrl,
      caption,
      sourceUrl,
    });

    // Save recipe to database
    const recipe = await req.db.createRecipe({
      title: extractedRecipe.title,
      description: extractedRecipe.description,
      imageUrl: imageUrls?.[0] || null,
      sourceUrl: extractedRecipe.sourceUrl,
      sourcePlatform: extractedRecipe.sourcePlatform,
      prepTime: extractedRecipe.prepTime,
      cookTime: extractedRecipe.cookTime,
      servings: extractedRecipe.servings,
      difficulty: extractedRecipe.difficulty,
      cuisine: extractedRecipe.cuisine,
      tags: extractedRecipe.tags,
      rawContent: extractedRecipe.rawContent,
      aiConfidence: extractedRecipe.aiConfidence,
      userId: req.user.id,
      cookbookId: cookbookId || null,
    });

    // Add ingredients and instructions
    await req.db.createIngredients(recipe.id, extractedRecipe.ingredients);
    await req.db.createInstructions(recipe.id, extractedRecipe.instructions);

    // Fetch the complete recipe
    const completeRecipe = await req.db.getRecipeById(recipe.id, req.user.id);

    res.status(201).json({ recipe: completeRecipe });
  } catch (error) {
    next(error);
  }
});

// Get all recipes for user
router.get('/', async (req, res, next) => {
  try {
    const { search, cookbookId, limit = 20, offset = 0 } = req.query;

    const recipes = await req.db.getRecipesByUser(req.user.id, {
      search,
      cookbookId,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      recipes,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single recipe
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await req.db.getRecipeById(req.params.id, req.user.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    next(error);
  }
});

// Delete recipe
router.delete('/:id', async (req, res, next) => {
  try {
    const recipe = await req.db.getRecipeById(req.params.id, req.user.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await req.db.deleteRecipe(req.params.id, req.user.id);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Add recipe ingredients to grocery list
router.post('/:id/add-to-groceries', async (req, res, next) => {
  try {
    const recipe = await req.db.getRecipeById(req.params.id, req.user.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    let count = 0;
    for (const ing of recipe.ingredients) {
      await req.db.createGroceryItem({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        userId: req.user.id,
      });
      count++;
    }

    res.json({ success: true, itemsAdded: count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
