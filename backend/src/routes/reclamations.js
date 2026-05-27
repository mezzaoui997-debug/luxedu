const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { protect } = require('../middleware/auth');

// Get all reclamations for a school (director)
router.get('/', protect, async (req, res) => {
  try {
    const reclamations = await prisma.reclamation.findMany({
      where: { schoolId: req.schoolId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reclamations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create reclamation (parent)
router.post('/', async (req, res) => {
  try {
    const { sujet, message, parentPhone, studentId, schoolId } = req.body;
    if (!sujet || !message || !parentPhone || !schoolId) {
      return res.status(400).json({ message: 'Champs manquants' });
    }
    const rec = await prisma.reclamation.create({
      data: { sujet, message, parentPhone, studentId, schoolId, statut: 'en_attente' }
    });
    res.status(201).json(rec);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update reclamation (director reply)
router.put('/:id', protect, async (req, res) => {
  try {
    const { statut, reponse } = req.body;
    const rec = await prisma.reclamation.update({
      where: { id: req.params.id },
      data: { statut, reponse, updatedAt: new Date() }
    });
    res.json(rec);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
