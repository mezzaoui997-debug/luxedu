const prisma = require('../utils/prisma');

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { schoolId: req.schoolId },
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { studentId, amount, month } = req.body;
    const payment = await prisma.payment.create({
      data: { studentId, amount, month, schoolId: req.schoolId, status: 'PENDING' },
      include: { student: true }
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markPaid = async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: 'PAID', paidAt: new Date() }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPayments, createPayment, markPaid };
