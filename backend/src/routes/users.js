const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isPremium: true,
        createdAt: true,
        _count: {
          select: {
            recipes: true,
            cookbooks: true,
          },
        },
      },
    });

    res.json({
      user: {
        ...user,
        recipeCount: user._count.recipes,
        cookbookCount: user._count.cookbooks,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().notEmpty(),
  body('avatarUrl').optional().isURL(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, avatarUrl } = req.body;

    const user = await req.prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(avatarUrl && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isPremium: true,
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await req.prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get user stats
router.get('/stats', async (req, res, next) => {
  try {
    const [recipeCount, cookbookCount, mealPlanCount] = await Promise.all([
      req.prisma.recipe.count({ where: { userId: req.user.id } }),
      req.prisma.cookbook.count({ where: { userId: req.user.id } }),
      req.prisma.mealPlan.count({ where: { userId: req.user.id } }),
    ]);

    // Get recipes by cuisine
    const cuisines = await req.prisma.recipe.groupBy({
      by: ['cuisine'],
      where: { userId: req.user.id, cuisine: { not: null } },
      _count: true,
    });

    // Get recent activity
    const recentRecipes = await req.prisma.recipe.findMany({
      where: { userId: req.user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, imageUrl: true, createdAt: true },
    });

    res.json({
      stats: {
        recipes: recipeCount,
        cookbooks: cookbookCount,
        mealPlans: mealPlanCount,
        cuisines: cuisines.map((c) => ({ cuisine: c.cuisine, count: c._count })),
      },
      recentRecipes,
    });
  } catch (error) {
    next(error);
  }
});

// Delete account
router.delete('/account', async (req, res, next) => {
  try {
    await req.prisma.user.delete({
      where: { id: req.user.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
