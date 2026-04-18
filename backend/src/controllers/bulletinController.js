const prisma = require('../utils/prisma');

const getMention = (avg) => {
  if (!avg) return '';
  if (avg >= 16) return 'Tres bien';
  if (avg >= 14) return 'Bien';
  if (avg >= 12) return 'Assez bien';
  if (avg >= 10) return 'Passable';
  return 'Insuffisant';
};

const generateBulletin = async (req, res) => {
  try {
    const { studentId, semester } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { school: true, class: true, grades: { where: { semester: parseInt(semester) } } }
    });
    if (!student) return res.status(404).json({ error: 'Eleve non trouve' });

    const subjects = [
      'Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique'
    ];
    const coeffs = {
      'Mathematiques':3,'Francais':3,'Arabe':3,'Sciences':2,'Anglais':1,'Histoire-Geo':2,'Islamique':2
    };

    const gradesMap = {};
    student.grades.forEach(g => {
      const normalized = g.subject
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace('e-', '-');
      gradesMap[normalized] = g;
      gradesMap[g.subject] = g;
    });

    let totalPoints = 0, totalCoeffs = 0;
    subjects.forEach(s => {
      const g = gradesMap[s];
      if (g && g.average) { totalPoints += g.average * coeffs[s]; totalCoeffs += coeffs[s]; }
    });
    const generalAvg = totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : null;

    const rows = subjects.map(s => {
      const g = gradesMap[s];
      const avg = g?.average;
      const color = avg ? (avg < 10 ? '#A32D2D' : avg >= 14 ? '#3B6D11' : '#0C447C') : '#888780';
      return '<tr><td style="font-weight:700">'+s+'</td><td style="text-align:center">'+coeffs[s]+'</td><td style="text-align:center">'+(g?.devoir1 ?? '-')+'</td><td style="text-align:center">'+(g?.devoir2 ?? '-')+'</td><td style="text-align:center">'+(g?.exam ?? '-')+'</td><td style="font-weight:700;color:'+color+';text-align:center">'+(avg ?? '-')+'</td><td style="color:'+color+'">'+getMention(avg)+'</td></tr>';
    }).join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Bulletin - ${student.firstName} ${student.lastName}</title>
<style>
body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#2C2C2A}
.header{background:#042C53;color:white;padding:18px 22px;display:flex;align-items:center;gap:14px;margin-bottom:0}
.info-bar{background:#E6F1FB;padding:12px 22px;display:flex;gap:24px;margin-bottom:16px}
.info-label{font-size:9px;font-weight:700;color:#0C447C;text-transform:uppercase;letter-spacing:0.05em}
.info-value{font-size:13px;font-weight:700;color:#042C53}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}
th{background:#042C53;color:white;padding:8px 10px;text-align:left;font-size:11px}
td{padding:8px 10px;border-bottom:1px solid #E8E6E0}
tr:nth-child(even) td{background:#F5F5F3}
.avg-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 13px;background:#E6F1FB;border-radius:8px;margin:10px 0}
.mention{padding:9px 13px;border-left:3px solid #EF9F27;background:#FAEEDA;border-radius:0 8px 8px 0;font-size:13px;color:#633806;margin-bottom:20px}
.sigs{display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid #E8E6E0;margin-top:20px;font-size:11px;color:#888780;text-align:center}
.sig-line{height:40px;border-bottom:1px solid #2C2C2A;margin-bottom:5px;width:130px}
@media print{body{padding:0}}
</style>
</head>
<body>
<div class="header">
  <div style="font-size:24px">🏫</div>
  <div>
    <div style="font-size:16px;font-weight:700">${student.school.name}</div>
    <div style="font-size:11px;opacity:0.6;margin-top:2px">Academie Casablanca-Settat · Agreee MEN</div>
  </div>
  <div style="margin-left:auto;text-align:right;font-size:12px;opacity:0.8">
    <div style="font-size:14px;font-weight:700">BULLETIN SCOLAIRE</div>
    <div>Semestre ${semester} · 2025-2026</div>
  </div>
</div>
<div class="info-bar">
  <div><div class="info-label">Eleve</div><div class="info-value">${student.lastName.toUpperCase()} ${student.firstName}</div></div>
  <div><div class="info-label">Classe</div><div class="info-value">${student.class?.name || '-'}</div></div>
  <div><div class="info-label">Code Massar</div><div class="info-value">${student.massar}</div></div>
  <div><div class="info-label">Annee scolaire</div><div class="info-value">2025-2026</div></div>
</div>
<div style="padding:0 0 20px">
<table>
<thead><tr><th>Matiere</th><th style="text-align:center">Coeff.</th><th style="text-align:center">Devoir 1</th><th style="text-align:center">Devoir 2</th><th style="text-align:center">Examen</th><th style="text-align:center">Moyenne</th><th>Appreciation</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<div class="avg-bar">
  <div style="font-size:14px;font-weight:700;color:#042C53">Moyenne generale du semestre ${semester}</div>
  <div style="font-size:32px;font-weight:700;color:#042C53">${generalAvg ?? '-'}<span style="font-size:16px;color:#888780"> /20</span></div>
</div>
<div class="mention">Mention : <strong>${getMention(parseFloat(generalAvg))}</strong></div>
<div class="sigs">
  <div><div class="sig-line"></div><div>Le professeur principal</div></div>
  <div><div class="sig-line"></div><div>Le directeur</div><div style="font-weight:700;color:#042C53;margin-top:3px">${student.school.name}</div></div>
  <div><div class="sig-line"></div><div>Cachet de l'ecole</div></div>
</div>
</div>
<div style="text-align:center;margin-top:10px">
  <button onclick="window.print()" style="background:#042C53;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">Imprimer / Sauvegarder PDF</button>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateBulletin };
