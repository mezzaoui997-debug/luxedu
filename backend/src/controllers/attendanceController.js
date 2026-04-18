const prisma = require('../utils/prisma');

const getAttendance = async (req, res) => {
  try {
    const { date, classId } = req.query;
    const students = await prisma.student.findMany({
      where: { schoolId: req.schoolId, ...(classId && { classId }) },
      include: {
        attendances: {
          where: { date: { gte: new Date(date || new Date().toDateString()), lt: new Date(new Date(date || new Date()).getTime() + 86400000) } }
        }
      },
      orderBy: { lastName: 'asc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    const results = await Promise.all(records.map(r =>
      prisma.attendance.upsert({
        where: { id: r.id || 'new' },
        update: { status: r.status, note: r.note },
        create: { studentId: r.studentId, status: r.status, note: r.note, date: new Date(r.date || new Date()) }
      })
    ));
    res.json({ saved: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAttendance, saveAttendance };
