const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { extractRecipeFromContent } = require('../services/aiRecipeExtractor');

const router = express.Router();

// All routes require authentication
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
    const recipe = await req.prisma.recipe.create({
      data: {
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
        ingredients: {
          create: extractedRecipe.ingredients,
        },
        instructions: {
          create: extractedRecipe.instructions,
        },
      },
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { stepNumber: 'asc' } },
        cookbook: true,
      },
    });

    res.status(201).json({ recipe });
  } catch (error) {
    next(error);
  }
});

// Get all recipes for user
router.get('/', async (req, res, next) => {
  try {
    const { search, cookbookId, cuisine, difficulty, limit = 20, offset = 0 } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (cookbookId) {
      where.cookbookId = cookbookId;
    }

    if (cuisine) {
      where.cuisine = { equals: cuisine, mode: 'insensitive' };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const [recipes, total] = await Promise.all([
      req.prisma.recipe.findMany({
        where,
        include: {
          ingredients: { orderBy: { order: 'asc' } },
          instructions: { orderBy: { stepNumber: 'asc' } },
          cookbook: true,
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      req.prisma.recipe.count({ where }),
    ]);

    res.json({
      recipes,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + recipes.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single recipe
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await req.prisma.recipe.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { stepNumber: 'asc' } },
        cookbook: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    next(error);
  }
});

// Update recipe
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, prepTime, cookTime, servings, difficulty, cuisine, tags, cookbookId, ingredients, instructions } = req.body;

    // Check ownership
    const existing = await req.prisma.recipe.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Update recipe
    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(prepTime !== undefined && { prepTime }),
      ...(cookTime !== undefined && { cookTime }),
      ...(servings !== undefined && { servings }),
      ...(difficulty && { difficulty }),
      ...(cuisine && { cuisine }),
      ...(tags && { tags }),
      ...(cookbookId !== undefined && { cookbookId }),
    };

    // If ingredients provided, replace them
    if (ingredients) {
      await req.prisma.ingredient.deleteMany({
        where: { recipeId: req.params.id },
      });
      await req.prisma.ingredient.createMany({
        data: ingredients.map((ing, index) => ({
          ...ing,
          recipeId: req.params.id,
          order: index,
        })),
      });
    }

    // If instructions provided, replace them
    if (instructions) {
      await req.prisma.instruction.deleteMany({
        where: { recipeId: req.params.id },
      });
      await req.prisma.instruction.createMany({
        data: instructions.map((inst, index) => ({
          ...inst,
          recipeId: req.params.id,
          stepNumber: index + 1,
        })),
      });
    }

    const recipe = await req.prisma.recipe.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { stepNumber: 'asc' } },
        cookbook: true,
      },
    });

    res.json({ recipe });
  } catch (error) {
    next(error);
  }
});

// Delete recipe
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await req.prisma.recipe.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await req.prisma.recipe.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Add recipe to grocery list
router.post('/:id/add-to-groceries', async (req, res, next) => {
  try {
    const recipe = await req.prisma.recipe.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { ingredients: true },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Add ingredients to grocery list
    const groceryItems = await req.prisma.groceryItem.createMany({
      data: recipe.ingredients.map((ing) => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        userId: req.user.id,
      })),
    });

    res.json({ success: true, itemsAdded: groceryItems.count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
