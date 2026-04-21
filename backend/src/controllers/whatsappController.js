const whatsapp = require('../services/whatsapp');
const prisma = require('../utils/prisma');

const sendCustomMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone) return res.status(400).json({ error: 'Numero requis' });
    const result = await whatsapp.sendMessage(phone, message);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendPaymentReminders = async (req, res) => {
  try {
    const pending = await prisma.payment.findMany({
      where: { schoolId: req.schoolId, status: 'PENDING' },
      include: { student: true }
    });
    let sent = 0;
    for (const p of pending) {
      if (!p.student?.parentPhone) continue;
      await whatsapp.sendPaymentReminder(p.student.parentPhone, 'Parent',
        p.student.firstName + ' ' + p.student.lastName, p.amount, p.month, 7);
      sent++;
    }
    res.json({ sent, total: pending.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendAbsenceNotif = async (req, res) => {
  try {
    const { studentId, date } = req.body;
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student?.parentPhone) return res.status(400).json({ error: 'Pas de telephone' });
    await whatsapp.sendAbsenceAlert(student.parentPhone, 'Parent',
      student.firstName + ' ' + student.lastName, date || new Date().toLocaleDateString('fr-FR'));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendCustomMessage, sendPaymentReminders, sendAbsenceNotif };
