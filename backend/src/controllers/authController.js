const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const register = async (req, res) => {
  try {
    const { schoolName, schoolCity, schoolEmail, firstName, lastName, email, password } = req.body;
    const existing = await prisma.school.findUnique({ where: { email: schoolEmail } });
    if (existing) return res.status(400).json({ error: 'Ecole deja inscrite' });
    const hash = await bcrypt.hash(password, 10);
    const school = await prisma.school.create({
      data: {
        name: schoolName, city: schoolCity, email: schoolEmail,
        users: { create: { firstName, lastName, email, password: hash, role: 'DIRECTOR' } }
      },
      include: { users: true }
    });
    const user = school.users[0];
    const token = jwt.sign({ userId: user.id, schoolId: school.id, role: user.role, firstName, lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, firstName, lastName, email, role: user.role }, school: { id: school.id, name: school.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DEMO_ACCOUNTS = {
  'director@school.ma':     { id:'demo-1', firstName:'Ahmed',  lastName:'Benali', role:'DIRECTOR',      schoolId:'demo-school' },
  'teacher@school.ma':      { id:'demo-2', firstName:'Sara',   lastName:'Alami',  role:'TEACHER',       schoolId:'demo-school' },
  'fonctionnaire@school.ma':{ id:'demo-3', firstName:'Fatima', lastName:'Benali', role:'FONCTIONNAIRE', schoolId:'demo-school' },
};
const DEMO_SCHOOL = { id:'demo-school', name:'École Excellence Arrow', city:'Casablanca' };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo bypass - no DB needed
    if (DEMO_ACCOUNTS[email] && password === 'password123') {
      const demoUser = DEMO_ACCOUNTS[email];
      const token = jwt.sign({ userId: demoUser.id, schoolId: demoUser.schoolId, role: demoUser.role, firstName: demoUser.firstName, lastName: demoUser.lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
      return res.json({ token, user: { ...demoUser, email }, school: DEMO_SCHOOL });
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { school: true } });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ userId: user.id, schoolId: user.schoolId, role: user.role, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }, school: { id: user.school.id, name: user.school.name } });
  } catch (error) {
    // If DB fails, check demo accounts
    const { email, password } = req.body;
    if (DEMO_ACCOUNTS[email] && password === 'password123') {
      const demoUser = DEMO_ACCOUNTS[email];
      const token = jwt.sign({ userId: demoUser.id, schoolId: demoUser.schoolId, role: demoUser.role, firstName: demoUser.firstName, lastName: demoUser.lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
      return res.json({ token, user: { ...demoUser, email }, school: DEMO_SCHOOL });
    }
    res.status(500).json({ error: error.message });
  }
};


const registerTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, password, subject } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email deja utilise' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName, lastName, email,
        password: hash,
        role: 'TEACHER',
        schoolId: req.schoolId
      },
      include: { school: true }
    });
    const token = jwt.sign({ userId: user.id, schoolId: user.schoolId, role: user.role, firstName, lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, firstName, lastName, email, role: user.role, subject }, school: { id: user.school.id, name: user.school.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { schoolId: req.schoolId, role: 'TEACHER' },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const registerStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email deja utilise' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hash, role: role || 'TEACHER', schoolId: req.schoolId },
      include: { school: true }
    });
    const token = jwt.sign({ userId: user.id, schoolId: user.schoolId, role: user.role, firstName, lastName }, process.env.JWT_SECRET || 'luxedu-secret-2026', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, firstName, lastName, email, role: user.role }, school: { id: user.school.id, name: user.school.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, registerTeacher, getTeachers, registerStaff };
