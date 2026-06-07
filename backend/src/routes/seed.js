const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

router.post('/demo', async (req, res) => {
  try {
    // 1. Rename Arrow School
    const school = await prisma.school.findFirst({ where: { email: 'directeur@excellence-casa.ma' } });
    if (!school) return res.status(404).json({ error: 'School not found' });

    await prisma.school.update({
      where: { id: school.id },
      data: { name: 'Ecole Excellence Casablanca', city: 'Casablanca' }
    });

    // 2. Get/create classes
    let classes = await prisma.class.findMany({ where: { schoolId: school.id } });
    const classNames = ['6eme Excellence','5eme A','5eme B','4eme A','4eme B','3eme Bac','2BAC Sciences','1BAC Lettres'];
    for (const name of classNames) {
      if (!classes.find(c => c.name === name)) {
        await prisma.class.create({ data: { name, level: name.slice(0,4), schoolId: school.id } });
      }
    }
    classes = await prisma.class.findMany({ where: { schoolId: school.id } });

    // 3. Add students to reach 48
    const PRENOMS = ['Omar','Youssef','Sara','Fatima','Ahmed','Karim','Nadia','Hamza','Layla','Mehdi','Amine','Zineb','Reda','Imane','Khalid','Soukaina','Younes','Hasna','Tariq','Meriem','Rachid','Samira','Bilal','Houda','Nour','Adil','Ghita','Mouad','Khadija','Sami'];
    const NOMS = ['Alaoui','Benjelloun','Tazi','Benali','El Idrissi','Chraibi','Sqalli','Berrada','Tahiri','Bennani','El Amrani','Lahlou','Zniber','El Khoury','Cheikh'];
    const hash = await bcrypt.hash('1234', 10);
    let existing = await prisma.student.count({ where: { schoolId: school.id } });
    let created = 0;
    for (let i = existing; i < 48; i++) {
      const massar = String.fromCharCode(65 + (i % 26)) + String(900000000 + i).slice(1);
      try {
        await prisma.student.create({
          data: {
            firstName: PRENOMS[i % PRENOMS.length],
            lastName: NOMS[Math.floor(i / PRENOMS.length) % NOMS.length],
            massar, parentPhone: `+21266${String(1000000 + i).slice(1)}`,
            studentCode: `LUX-2026-${String(i + 1).padStart(3, '0')}`,
            studentPassword: hash, schoolId: school.id,
            classId: classes[i % classes.length].id,
          }
        });
        created++;
      } catch(e) {}
    }

    // 4. Add payments (76% recouvrement)
    const students = await prisma.student.findMany({ where: { schoolId: school.id } });
    const months = ['Septembre 2025','Octobre 2025','Novembre 2025','Decembre 2025','Janvier 2026','Fevrier 2026','Mars 2026','Avril 2026','Mai 2026'];
    let payCreated = 0;
    for (let si = 0; si < students.length; si++) {
      const isPaidStudent = si < 37;
      for (const month of months) {
        const exists = await prisma.payment.findFirst({ where: { studentId: students[si].id, description: month } });
        if (!exists) {
          await prisma.payment.create({
            data: {
              studentId: students[si].id, schoolId: school.id,
              amount: 1500, description: month,
              status: isPaidStudent ? 'PAID' : 'PENDING',
              paymentDate: isPaidStudent ? new Date() : null,
            }
          });
          payCreated++;
        }
      }
    }

    // 5. Add attendance (94% presence)
    let attCreated = 0;
    for (const s of students.slice(0, 30)) {
      for (let d = 1; d <= 15; d++) {
        const date = new Date(); date.setDate(date.getDate() - d);
        const exists = await prisma.attendance.findFirst({ where: { studentId: s.id, date } });
        if (!exists) {
          try {
            await prisma.attendance.create({
              data: {
                studentId: s.id, schoolId: school.id, classId: s.classId, date,
                status: Math.random() > 0.06 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'LATE'),
                subject: 'Mathematiques',
              }
            });
            attCreated++;
          } catch(e) {}
        }
      }
    }

    // 6. Add grades
    const subjects = ['Mathematiques','Francais','Anglais','Physique-Chimie','SVT'];
    let gradeCreated = 0;
    for (const s of students.slice(0, 40)) {
      for (const subj of subjects) {
        const exists = await prisma.grade.findFirst({ where: { studentId: s.id, subject: subj } });
        if (!exists) {
          await prisma.grade.create({
            data: {
              studentId: s.id, schoolId: school.id, subject: subj,
              value: Math.round((11 + Math.random() * 8) * 2) / 2,
              semester: 2, examType: 'CONTROLE',
            }
          });
          gradeCreated++;
        }
      }
    }

    const total = await prisma.student.count({ where: { schoolId: school.id } });
    res.json({ success: true, students: total, studentsAdded: created, payments: payCreated, attendance: attCreated, grades: gradeCreated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
