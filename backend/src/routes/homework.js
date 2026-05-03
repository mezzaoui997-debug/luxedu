const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { classId, subject } = req.query;
    // Use Grade model to store homework notes temporarily or return static
    res.json([]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, subject, classId, dueDate } = req.body;
    res.json({ id: Date.now().toString(), title, description, subject, classId, dueDate, createdAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
