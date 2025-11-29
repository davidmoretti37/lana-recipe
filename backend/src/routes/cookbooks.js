const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get all cookbooks for user
router.get('/', async (req, res, next) => {
  try {
    const cookbooks = await req.prisma.cookbook.findMany({
      where: { userId: req.user.id },
      include: {
        _count: { select: { recipes: true } },
        recipes: {
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: { id: true, imageUrl: true, title: true },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    res.json({
      cookbooks: cookbooks.map((cb) => ({
        ...cb,
        recipeCount: cb._count.recipes,
        thumbnails: cb.recipes.map((r) => r.imageUrl).filter(Boolean),
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

    const cookbook = await req.prisma.cookbook.create({
      data: {
        name,
        description,
        color,
        userId: req.user.id,
      },
      include: {
        _count: { select: { recipes: true } },
      },
    });

    res.status(201).json({
      cookbook: {
        ...cookbook,
        recipeCount: cookbook._count.recipes,
        thumbnails: [],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single cookbook with recipes
router.get('/:id', async (req, res, next) => {
  try {
    const cookbook = await req.prisma.cookbook.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        recipes: {
          include: {
            ingredients: { orderBy: { order: 'asc' } },
            instructions: { orderBy: { stepNumber: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { recipes: true } },
      },
    });

    if (!cookbook) {
      return res.status(404).json({ error: 'Cookbook not found' });
    }

    res.json({
      cookbook: {
        ...cookbook,
        recipeCount: cookbook._count.recipes,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update cookbook
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await req.prisma.cookbook.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cookbook not found' });
    }

    const { name, description, color, coverImageUrl } = req.body;

    const cookbook = await req.prisma.cookbook.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
        ...(coverImageUrl && { coverImageUrl }),
      },
      include: {
        _count: { select: { recipes: true } },
      },
    });

    res.json({
      cookbook: {
        ...cookbook,
        recipeCount: cookbook._count.recipes,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete cookbook (moves recipes to uncategorized)
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await req.prisma.cookbook.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cookbook not found' });
    }

    if (existing.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default cookbook' });
    }

    // Find default cookbook to move recipes to
    const defaultCookbook = await req.prisma.cookbook.findFirst({
      where: { userId: req.user.id, isDefault: true },
    });

    // Move recipes to default cookbook
    await req.prisma.recipe.updateMany({
      where: { cookbookId: req.params.id },
      data: { cookbookId: defaultCookbook?.id || null },
    });

    // Delete cookbook
    await req.prisma.cookbook.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
