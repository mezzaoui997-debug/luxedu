const prisma = require('../utils/prisma');

const getGrades = async (req, res) => {
  try {
    const { classId, subject, semester } = req.query;
    const students = await prisma.student.findMany({
      where: { schoolId: req.schoolId, ...(classId && { classId }) },
      include: { grades: { where: { ...(subject && { subject }), ...(semester && { semester: parseInt(semester) }) } } },
      orderBy: { lastName: 'asc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveGrade = async (req, res) => {
  try {
    const { studentId, subject, devoir1, devoir2, exam, semester } = req.body;
    const vals = [devoir1, devoir2, exam].filter(n => n != null);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const existing = await prisma.grade.findFirst({ where: { studentId, subject, semester: semester || 1 } });
    const grade = existing
      ? await prisma.grade.update({ where: { id: existing.id }, data: { devoir1, devoir2, exam, average: avg } })
      : await prisma.grade.create({ data: { studentId, subject, devoir1, devoir2, exam, average: avg, semester: semester || 1 } });
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getGrades, saveGrade };
