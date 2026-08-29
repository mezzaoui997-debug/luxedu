const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { protect } = require('../middleware/auth');

// GET school info
router.get('/', protect, async (req, res) => {
  try {
    const school = await prisma.school.findUnique({ where: { id: req.schoolId } });
    res.json(school);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update school info
router.put('/', protect, async (req, res) => {
  try {
    const { name, city, phone, email, logo, address, website, directorName, foundedYear } = req.body;
    const school = await prisma.school.update({
      where: { id: req.schoolId },
      data: { name, city, phone, logo, address, website, directorName, foundedYear },
    });
    res.json(school);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
