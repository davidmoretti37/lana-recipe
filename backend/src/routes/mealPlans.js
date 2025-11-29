const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Helper to get start of week (Monday)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get meal plan for a specific week
router.get('/', async (req, res, next) => {
  try {
    const { weekStart } = req.query;
    const startDate = weekStart ? getWeekStart(new Date(weekStart)) : getWeekStart(new Date());

    let mealPlan = await req.prisma.mealPlan.findFirst({
      where: {
        userId: req.user.id,
        weekStart: startDate,
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: { orderBy: { order: 'asc' } },
              },
            },
          },
          orderBy: [{ date: 'asc' }, { mealType: 'asc' }],
        },
      },
    });

    // Create meal plan if it doesn't exist
    if (!mealPlan) {
      mealPlan = await req.prisma.mealPlan.create({
        data: {
          userId: req.user.id,
          weekStart: startDate,
        },
        include: {
          items: {
            include: {
              recipe: true,
            },
          },
        },
      });
    }

    // Group items by date and meal type
    const weekEnd = new Date(startDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    res.json({
      mealPlan: {
        ...mealPlan,
        weekStart: startDate,
        weekEnd,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Add recipe to meal plan
router.post('/items', [
  body('recipeId').notEmpty(),
  body('date').isISO8601(),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipeId, date, mealType } = req.body;

    // Verify recipe belongs to user
    const recipe = await req.prisma.recipe.findFirst({
      where: { id: recipeId, userId: req.user.id },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const weekStart = getWeekStart(new Date(date));

    // Get or create meal plan for the week
    let mealPlan = await req.prisma.mealPlan.findFirst({
      where: {
        userId: req.user.id,
        weekStart,
      },
    });

    if (!mealPlan) {
      mealPlan = await req.prisma.mealPlan.create({
        data: {
          userId: req.user.id,
          weekStart,
        },
      });
    }

    // Add item to meal plan
    const item = await req.prisma.mealPlanItem.create({
      data: {
        mealPlanId: mealPlan.id,
        recipeId,
        date: new Date(date),
        mealType,
      },
      include: {
        recipe: true,
      },
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// Remove item from meal plan
router.delete('/items/:id', async (req, res, next) => {
  try {
    const item = await req.prisma.mealPlanItem.findFirst({
      where: { id: req.params.id },
      include: {
        mealPlan: true,
      },
    });

    if (!item || item.mealPlan.userId !== req.user.id) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await req.prisma.mealPlanItem.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Generate grocery list from meal plan
router.post('/generate-groceries', async (req, res, next) => {
  try {
    const { weekStart } = req.body;
    const startDate = weekStart ? getWeekStart(new Date(weekStart)) : getWeekStart(new Date());

    const mealPlan = await req.prisma.mealPlan.findFirst({
      where: {
        userId: req.user.id,
        weekStart: startDate,
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: true,
              },
            },
          },
        },
      },
    });

    if (!mealPlan || mealPlan.items.length === 0) {
      return res.status(400).json({ error: 'No meals planned for this week' });
    }

    // Collect all ingredients
    const ingredientMap = new Map();

    for (const item of mealPlan.items) {
      for (const ing of item.recipe.ingredients) {
        const key = ing.name.toLowerCase();
        if (ingredientMap.has(key)) {
          // Combine quantities if same unit
          const existing = ingredientMap.get(key);
          if (existing.unit === ing.unit && existing.quantity && ing.quantity) {
            existing.quantity = String(parseFloat(existing.quantity) + parseFloat(ing.quantity));
          }
        } else {
          ingredientMap.set(key, {
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          });
        }
      }
    }

    // Create grocery items
    const groceryItems = await req.prisma.groceryItem.createMany({
      data: Array.from(ingredientMap.values()).map((ing) => ({
        ...ing,
        userId: req.user.id,
      })),
    });

    res.json({ success: true, itemsAdded: groceryItems.count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
