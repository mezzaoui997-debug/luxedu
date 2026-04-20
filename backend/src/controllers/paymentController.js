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

const whatsapp = require('../services/whatsapp');

const sendPaymentRemindersAuto = async (req, res) => {
  try {
    const prisma = require('../utils/prisma');
    const pending = await prisma.payment.findMany({
      where: { schoolId: req.schoolId, status: 'PENDING' },
      include: { student: true, school: true }
    });
    let sent = 0;
    for (const p of pending) {
      if (!p.student?.parentPhone) continue;
      try {
        await whatsapp.sendPaymentReminder(
          p.student.parentPhone,
          'Parent',
          p.student.firstName + ' ' + p.student.lastName,
          p.amount,
          p.month,
          7
        );
        sent++;
      } catch(e) { console.log('WA error:', e.message); }
    }
    res.json({ sent, total: pending.length });
  } catch(error) {
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

module.exports = { getPayments, createPayment, markPaid, sendPaymentRemindersAuto };
