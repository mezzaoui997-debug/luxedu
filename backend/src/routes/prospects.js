const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
router.use(protect);

const prospects = [];

router.get('/', (req, res) => res.json(prospects.filter(p => p.schoolId === req.schoolId)));
router.post('/', (req, res) => {
  const p = { id: Date.now().toString(), schoolId: req.schoolId, createdAt: new Date(), status: 'NOUVEAU', ...req.body };
  prospects.push(p);
  res.json(p);
});
router.put('/:id', (req, res) => {
  const idx = prospects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  prospects[idx] = { ...prospects[idx], ...req.body };
  res.json(prospects[idx]);
});

module.exports = router;
