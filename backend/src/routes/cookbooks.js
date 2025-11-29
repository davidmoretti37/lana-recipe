const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get all cookbooks for user
router.get('/', async (req, res, next) => {
  try {
    const cookbooks = await req.db.getCookbooksByUser(req.user.id);

    res.json({
      cookbooks: cookbooks.map((cb) => ({
        ...cb,
        recipeCount: parseInt(cb.recipeCount) || 0,
        thumbnails: cb.thumbnails || [],
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Create cookbook
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color } = req.body;

    const cookbook = await req.db.createCookbook({
      name,
      description,
      color,
      userId: req.user.id,
    });

    res.status(201).json({
      cookbook: {
        ...cookbook,
        recipeCount: 0,
        thumbnails: [],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single cookbook
router.get('/:id', async (req, res, next) => {
  try {
    const cookbook = await req.db.getCookbookById(req.params.id, req.user.id);

    if (!cookbook) {
      return res.status(404).json({ error: 'Cookbook not found' });
    }

    // Get recipes for this cookbook
    const recipes = await req.db.getRecipesByUser(req.user.id, { cookbookId: req.params.id });

    res.json({
      cookbook: {
        ...cookbook,
        recipes,
        recipeCount: recipes.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
