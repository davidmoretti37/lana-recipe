const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await req.db.getUserById(req.user.id);

    const recipes = await req.db.getRecipesByUser(req.user.id);
    const cookbooks = await req.db.getCookbooksByUser(req.user.id);

    res.json({
      user: {
        ...user,
        recipeCount: recipes.length,
        cookbookCount: cookbooks.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
