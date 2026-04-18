const prisma = require('../utils/prisma');

const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { schoolId: req.schoolId },
      include: { class: true },
      orderBy: { lastName: 'asc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, massar, dateOfBirth, classId, parentPhone } = req.body;
    const student = await prisma.student.create({
      data: { firstName, lastName, massar, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, classId, parentPhone, schoolId: req.schoolId },
      include: { class: true }
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.update({
      where: { id },
      data: req.body,
      include: { class: true }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    res.json({ message: 'Eleve supprime' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
