const prisma = require('../utils/prisma');

const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: { schoolId: req.schoolId },
      include: { _count: { select: { students: true } } },
      orderBy: { name: 'asc' }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, level } = req.body;
    const cls = await prisma.class.create({
      data: { name, level, schoolId: req.schoolId }
    });
    res.status(201).json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getClasses, createClass };
