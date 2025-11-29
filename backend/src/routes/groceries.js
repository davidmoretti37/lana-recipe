const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get all grocery items
router.get('/', async (req, res, next) => {
  try {
    const { showChecked = 'true' } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (showChecked === 'false') {
      where.isChecked = false;
    }

    const items = await req.prisma.groceryItem.findMany({
      where,
      orderBy: [
        { isChecked: 'asc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    // Group by category
    const grouped = items.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    res.json({
      items,
      grouped,
      stats: {
        total: items.length,
        checked: items.filter((i) => i.isChecked).length,
        unchecked: items.filter((i) => !i.isChecked).length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Add grocery item
router.post('/', [
  body('name').trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, quantity, unit, category } = req.body;

    const item = await req.prisma.groceryItem.create({
      data: {
        name,
        quantity,
        unit,
        category,
        userId: req.user.id,
      },
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// Add multiple grocery items
router.post('/bulk', async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array required' });
    }

    const created = await req.prisma.groceryItem.createMany({
      data: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        userId: req.user.id,
      })),
    });

    res.status(201).json({ success: true, count: created.count });
  } catch (error) {
    next(error);
  }
});

// Toggle item checked status
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const existing = await req.prisma.groceryItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await req.prisma.groceryItem.update({
      where: { id: req.params.id },
      data: { isChecked: !existing.isChecked },
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

// Update grocery item
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await req.prisma.groceryItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { name, quantity, unit, category, isChecked } = req.body;

    const item = await req.prisma.groceryItem.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity }),
        ...(unit !== undefined && { unit }),
        ...(category !== undefined && { category }),
        ...(isChecked !== undefined && { isChecked }),
      },
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

// Delete grocery item
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await req.prisma.groceryItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await req.prisma.groceryItem.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Clear all checked items
router.delete('/clear/checked', async (req, res, next) => {
  try {
    const result = await req.prisma.groceryItem.deleteMany({
      where: {
        userId: req.user.id,
        isChecked: true,
      },
    });

    res.json({ success: true, deleted: result.count });
  } catch (error) {
    next(error);
  }
});

// Clear all items
router.delete('/clear/all', async (req, res, next) => {
  try {
    const result = await req.prisma.groceryItem.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ success: true, deleted: result.count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
