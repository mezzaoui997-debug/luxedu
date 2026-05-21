const express = require('express');
const router = express.Router();
const { register, login, registerTeacher, getTeachers, registerStaff } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.post('/teacher', protect, registerTeacher);
router.post('/staff', protect, registerStaff);
router.get('/teachers', protect, getTeachers);
module.exports = router;

// Demo seed endpoint - works even without DB
router.post('/demo-seed', async (req, res) => {
  // Always return success - demo accounts are hardcoded in authController
  try {
  const prisma = require('../utils/prisma');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  try {
    const hash = await bcrypt.hash('password123', 10);
    // Check if demo school exists
    let school = await prisma.school.findUnique({ where: { email: 'demo@luxedu.ma' } });
    if (!school) {
      school = await prisma.school.create({
        data: {
          name: 'École Excellence Arrow',
          city: 'Casablanca',
          email: 'demo@luxedu.ma',
        }
      });
    }
    // Create demo users if not exist
    const roles = [
      { email:'director@school.ma', firstName:'Ahmed', lastName:'Benali', role:'DIRECTOR' },
      { email:'teacher@school.ma', firstName:'Sara', lastName:'Alami', role:'TEACHER' },
      { email:'fonctionnaire@school.ma', firstName:'Fatima', lastName:'Benali', role:'FONCTIONNAIRE' },
    ];
    for (const u of roles) {
      const exists = await prisma.user.findUnique({ where: { email: u.email } });
      if (!exists) {
        await prisma.user.create({ data: { ...u, password: hash, schoolId: school.id } });
      } else {
        // Always update password to ensure demo works
        await prisma.user.update({ where: { email: u.email }, data: { password: hash } });
      }
    }
    // Create demo class if needed
    let demoClass = await prisma.class.findFirst({ where: { schoolId: school.id, name: '6ème Excellence' } });
    if (!demoClass) {
      demoClass = await prisma.class.create({ data: { name:'6ème Excellence', level:'6ème', schoolId: school.id } });
    }

    // Create demo students if not exist
    const demoStudents = [
      { firstName:'Youssef', lastName:'Benjelloun', massar:'B903751842', parentPhone:'0661234567', classId: demoClass.id },
      { firstName:'Omar',    lastName:'Moussa',     massar:'G412252321', parentPhone:'0672345678', classId: demoClass.id },
      { firstName:'Kenza',   lastName:'Alami',      massar:'K234567891', parentPhone:'0683456789', classId: demoClass.id },
    ];
    for (const s of demoStudents) {
      const exists = await prisma.student.findFirst({ where: { massar: s.massar } });
      if (!exists) {
        const student = await prisma.student.create({ data: { ...s, schoolId: school.id } });
        // Add demo payment
        await prisma.payment.create({ data: { studentId: student.id, schoolId: school.id, amount: 2800, month: 'Avril 2026', status: 'PENDING' } });
        // Add demo attendance
        await prisma.attendance.create({ data: { studentId: student.id, status: 'PRESENT' } });
        // Add demo grade
        await prisma.grade.create({ data: { studentId: student.id, subject: 'Mathématiques', devoir1: 16, devoir2: 17, exam: 15.5, average: 16.2, semester: 1 } });
      }
    }

    res.json({ ok: true, message: 'Demo accounts ready', school: school.name });
  } catch (e) {
    console.error('Demo seed error:', e.message);
    res.status(500).json({ 
      error: e.message,
      hint: 'If ENOTFOUND error: update DATABASE_URL in Railway to use PUBLIC URL (gondola.proxy.rlwy.net)'
    }); 
  }
});
