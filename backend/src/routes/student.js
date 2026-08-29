const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// Login étudiant avec code unique
router.post('/login', async (req, res) => {
  try {
    const { code, password } = req.body;
    const student = await prisma.student.findUnique({
      where: { studentCode: code },
      include: {
        class: true,
        grades: true,
        attendances: true,
        payments: true
      }
    });
    if (!student) return res.status(401).json({ message: 'Code étudiant invalide' });

    // Première connexion — pas encore de mot de passe
    if (!student.studentPassword) {
      return res.json({ mustSetPassword: true, student: { prenom: student.firstName, nom: student.lastName, code: student.studentCode, niveau: student.class?.level, classe: student.class?.name } });
    }

    const valid = await bcrypt.compare(password, student.studentPassword);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ studentId: student.id, schoolId: student.schoolId }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
res.json({ token, student: formatStudent(student) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer mot de passe (première connexion)
router.post('/set-password', async (req, res) => {
  try {
    const { code, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const student = await prisma.student.update({
      where: { studentCode: code },
      data: { studentPassword: hashed },
      include: { class: true, grades: true, attendances: true, payments: true }
    });
    const token = jwt.sign({ studentId: student.id, schoolId: student.schoolId }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
res.json({ token, student: formatStudent(student) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function formatStudent(s) {
  return {
    prenom: s.firstName,
    nom: s.lastName,
    code: s.studentCode,
    niveau: s.class?.level,
    classe: s.class?.name,
    notes: (s.grades || []).map(g => ({
      matiere: g.subject || 'Matière',
      valeur: g.average ?? g.exam ?? null,
      devoir1: g.devoir1,
      devoir2: g.devoir2,
      exam: g.exam,
      type: 'Contrôle',
      date: g.createdAt?.toISOString?.()?.split('T')[0]
    })),
    absences: (s.attendances || []).filter(a => a.status === 'ABSENT').map(a => ({
      date: a.date?.toISOString?.()?.split('T')[0],
      justifiee: false,
      heure: '1h',
      note: a.note || ''
    })),
    devoirs: [],
    paiements: s.payments || []
  };
}

module.exports = router;
