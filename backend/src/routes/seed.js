const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

router.post('/demo', async (req, res) => {
  const { schoolId } = req.body;
  const targetId = schoolId || 'cmo3ot7y700009lupl6zsfzbp';

  try {
    const school = await prisma.school.findUnique({ where: { id: targetId } });
    if (!school) return res.status(404).json({ error: 'School not found', id: targetId });

    await prisma.school.update({ where: { id: targetId }, data: { name: 'Ecole Excellence Casablanca' } });

    let classes = await prisma.class.findMany({ where: { schoolId: targetId } });
    if (classes.length < 4) {
      await prisma.class.createMany({
        data: [
          { name: '6eme Excellence', level: '6AP', schoolId: targetId },
          { name: '5eme A', level: '5AP', schoolId: targetId },
          { name: '4eme A', level: '4AP', schoolId: targetId },
          { name: '3eme BAC', level: '3AC', schoolId: targetId },
          { name: '2BAC Sciences', level: '2BAC', schoolId: targetId },
        ],
        skipDuplicates: true,
      });
      classes = await prisma.class.findMany({ where: { schoolId: targetId } });
    }

    const hash = await bcrypt.hash('1234', 10);
    const FIRST = ['Omar','Youssef','Sara','Fatima','Ahmed','Karim','Nadia','Hamza','Layla','Mehdi','Amine','Zineb','Reda','Imane','Khalid','Soukaina','Younes','Hasna','Tariq','Meriem','Rachid','Samira','Bilal','Houda','Nour','Adil','Ghita','Mouad','Khadija','Sami'];
    const LAST = ['Alaoui','Benjelloun','Tazi','Benali','El Idrissi','Chraibi','Berrada','Tahiri','Bennani','El Amrani','Lahlou','Zniber','Cheikh'];

    const existing = await prisma.student.findMany({ where: { schoolId: targetId }, select: { massar: true } });
    const existMassar = new Set(existing.map(s => s.massar));

    const newStudents = [];
    for (let i = 0; i < 48; i++) {
      const massar = String.fromCharCode(65 + (i % 26)) + String(900000000 + i).slice(1);
      if (!existMassar.has(massar)) {
        newStudents.push({
          firstName: FIRST[i % FIRST.length],
          lastName: LAST[Math.floor(i / FIRST.length) % LAST.length],
          massar, parentPhone: `+21266${String(1000000 + i).slice(1)}`,
          studentCode: `LUX-2026-${String(i + 1).padStart(3, '0')}`,
          studentPassword: hash, schoolId: targetId,
          classId: classes[i % classes.length].id,
        });
      }
    }
    if (newStudents.length > 0) {
      await prisma.student.createMany({ data: newStudents, skipDuplicates: true });
    }

    const students = await prisma.student.findMany({ where: { schoolId: targetId } });
    const months = ['Septembre 2025','Octobre 2025','Novembre 2025','Decembre 2025','Janvier 2026','Fevrier 2026','Mars 2026','Avril 2026','Mai 2026'];

    const existPay = await prisma.payment.findMany({ where: { schoolId: targetId }, select: { studentId: true, month: true } });
    const existPaySet = new Set(existPay.map(p => p.studentId + '|' + p.month));

    const payments = [];
    for (let si = 0; si < students.length; si++) {
      const paid = si < 37;
      for (const month of months) {
        if (!existPaySet.has(students[si].id + '|' + month)) {
          payments.push({ studentId: students[si].id, schoolId: targetId, amount: 1500, month, status: paid ? 'PAID' : 'PENDING', paidAt: paid ? new Date() : null });
        }
      }
    }
    if (payments.length > 0) await prisma.payment.createMany({ data: payments, skipDuplicates: true });

    const existAtt = await prisma.attendance.findMany({ where: { schoolId: targetId }, select: { studentId: true } });
    const hasAtt = new Set(existAtt.map(a => a.studentId));
    const attendance = [];
    for (const s of students.slice(0, 35)) {
      if (!hasAtt.has(s.id)) {
        for (let d = 1; d <= 10; d++) {
          const date = new Date(); date.setDate(date.getDate() - d);
          attendance.push({ studentId: s.id, schoolId: targetId, classId: s.classId, date, status: Math.random() > 0.06 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'LATE'), subject: 'Mathematiques' });
        }
      }
    }
    if (attendance.length > 0) await prisma.attendance.createMany({ data: attendance, skipDuplicates: true });

    const existGrade = await prisma.grade.findMany({ where: { schoolId: targetId }, select: { studentId: true, subject: true } });
    const existGradeSet = new Set(existGrade.map(g => g.studentId + '|' + g.subject));
    const subjects = ['Mathematiques','Francais','Anglais','Physique-Chimie','SVT'];
    const grades = [];
    for (const s of students.slice(0, 42)) {
      for (const subj of subjects) {
        if (!existGradeSet.has(s.id + '|' + subj)) {
          grades.push({ studentId: s.id, schoolId: targetId, subject: subj, value: Math.round((11 + Math.random() * 8) * 2) / 2, semester: 2, examType: 'CONTROLE' });
        }
      }
    }
    if (grades.length > 0) await prisma.grade.createMany({ data: grades, skipDuplicates: true });

    const [totalStu, totalPaid, totalPend] = await Promise.all([
      prisma.student.count({ where: { schoolId: targetId } }),
      prisma.payment.count({ where: { schoolId: targetId, status: 'PAID' } }),
      prisma.payment.count({ where: { schoolId: targetId, status: 'PENDING' } }),
    ]);

    res.json({ success: true, school: 'Ecole Excellence Casablanca', students: totalStu, paid: totalPaid, pending: totalPend, recouvrement: Math.round(totalPaid / (totalPaid + totalPend) * 100) + '%' });
  } catch(e) {
    res.status(500).json({ error: e.message.slice(0, 200) });
  }
});

module.exports = router;
