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

    const mealPlan = await req.db.getMealPlan(req.user.id, startDate);

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
    const recipe = await req.db.getRecipeById(recipeId, req.user.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const weekStart = getWeekStart(new Date(date));
    const mealPlan = await req.db.getMealPlan(req.user.id, weekStart);

    const item = await req.db.addMealPlanItem({
      mealPlanId: mealPlan.id,
      recipeId,
      date: new Date(date),
      mealType,
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// Remove item from meal plan
router.delete('/items/:id', async (req, res, next) => {
  try {
    await req.db.deleteMealPlanItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
