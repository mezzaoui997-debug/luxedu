const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Parent login with phone number
router.post('/login', async (req, res) => {
  try {
    const { phone, massar } = req.body;
    const student = await prisma.student.findFirst({
      where: { massar, parentPhone: phone },
      include: { school: true, class: true, grades: true, payments: true, attendances: { orderBy: { date: 'desc' }, take: 30 } }
    });
    if (!student) return res.status(401).json({ error: 'Numero ou code Massar incorrect' });
    const token = jwt.sign({ studentId: student.id, schoolId: student.schoolId, role: 'PARENT' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.json({ token, student });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get student data for parent
router.get('/student/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Non autorise' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.studentId !== req.params.id) return res.status(403).json({ error: 'Acces refuse' });
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { school: true, class: true, grades: { orderBy: { semester: 'desc' } }, payments: { orderBy: { createdAt: 'desc' } }, attendances: { orderBy: { date: 'desc' }, take: 60 } }
    });
    res.json(student);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
