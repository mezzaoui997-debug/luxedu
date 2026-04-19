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
    const token = jwt.sign({ userId: user.id, schoolId: school.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, firstName, lastName, email, role: user.role }, school: { id: school.id, name: school.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { school: true } });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ userId: user.id, schoolId: user.schoolId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }, school: { id: user.school.id, name: user.school.name } });
  } catch (error) {
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
    const token = jwt.sign({ userId: user.id, schoolId: user.schoolId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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

module.exports = { register, login, registerTeacher, getTeachers };
