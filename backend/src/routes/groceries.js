const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Get all grocery items
router.get('/', async (req, res, next) => {
  try {
    const items = await req.db.getGroceriesByUser(req.user.id);

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

    const item = await req.db.createGroceryItem({
      name,
      quantity,
      unit,
      category,
      userId: req.user.id,
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// Toggle item checked status
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const item = await req.db.toggleGroceryItem(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

// Delete grocery item
router.delete('/:id', async (req, res, next) => {
  try {
    await req.db.deleteGroceryItem(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Clear all checked items
router.delete('/clear/checked', async (req, res, next) => {
  try {
    const count = await req.db.clearCheckedGroceries(req.user.id);
    res.json({ success: true, deleted: count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
