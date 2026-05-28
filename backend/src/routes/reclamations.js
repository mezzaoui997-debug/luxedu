const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { protect } = require('../middleware/auth');

router.use(protect);

// Get all reclamations for school
router.get('/', async (req, res) => {
  try {
    const reclamations = await prisma.reclamation.findMany({
      where: { schoolId: req.schoolId },
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });
    const formatted = reclamations.map(r => ({
      ...r,
      parentName: r.student ? `Parent de ${r.student.firstName} ${r.student.lastName}` : 'Parent',
      studentName: r.student ? `${r.student.firstName} ${r.student.lastName}` : '',
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update reclamation status + reponse
router.put('/:id', async (req, res) => {
  try {
    const { statut, reponse } = req.body;
    const rec = await prisma.reclamation.update({
      where: { id: req.params.id },
      data: { statut, reponse }
    });
    res.json(rec);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
