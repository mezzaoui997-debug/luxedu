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

// Demo seed endpoint
router.post('/demo-seed', async (req, res) => {
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
    res.json({ ok: true, message: 'Demo accounts ready' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
