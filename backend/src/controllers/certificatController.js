const prisma = require('../utils/prisma');

const generateCertificat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { school: true, class: true }
    });
    if (!student) return res.status(404).json({ error: 'Eleve non trouve' });

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Certificat - ${student.firstName} ${student.lastName}</title>
<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: white; }
.border { border: 8px double #042C53; padding: 40px; min-height: 600px; position: relative; }
.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #042C53; padding-bottom: 20px; }
.logo { font-size: 32px; font-weight: 700; color: #042C53; }
.logo span { color: #EF9F27; font-weight: 200; }
.school { font-size: 18px; font-weight: 700; color: #042C53; margin: 10px 0; }
.title { font-size: 26px; font-weight: 700; color: #042C53; text-align: center; margin: 30px 0; text-transform: uppercase; letter-spacing: 3px; }
.content { font-size: 16px; line-height: 2.2; color: #2C2C2A; text-align: center; margin: 30px 0; }
.student-name { font-size: 22px; font-weight: 700; color: #042C53; text-decoration: underline; }
.massar { font-family: monospace; font-size: 16px; font-weight: 700; }
.footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 20px; border-top: 1px solid #E8E6E0; }
.sig { text-align: center; width: 200px; }
.sig-line { height: 50px; border-bottom: 1px solid #042C53; margin-bottom: 8px; }
.stamp { width: 120px; height: 120px; border: 3px solid #042C53; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 11px; font-weight: 700; color: #042C53; text-align: center; padding: 10px; }
.watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 80px; color: rgba(4,44,83,0.05); font-weight: 700; pointer-events: none; white-space: nowrap; }
.ref { font-size: 11px; color: #888780; text-align: right; margin-bottom: 10px; }
@media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="border">
  <div class="watermark">ORIGINAL</div>
  <div class="ref">Ref: CERT-${new Date().getFullYear()}-${student.massar}</div>
  <div class="header">
    <div class="logo">Lux<span>Edu</span></div>
    <div class="school">${student.school.name}</div>
    <div style="font-size:13px;color:#888780">Agréée par le Ministère de l'Education Nationale · Casablanca, Maroc</div>
  </div>
  
  <div class="title">Certificat de Scolarité</div>
  
  <div class="content">
    <p>Le Directeur de l'établissement soussigné certifie que</p>
    <p class="student-name">${student.lastName.toUpperCase()} ${student.firstName}</p>
    <p>Code Massar : <span class="massar">${student.massar}</span></p>
    ${student.dateOfBirth ? `<p>Né(e) le : ${new Date(student.dateOfBirth).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
    <p>est régulièrement inscrit(e) dans notre établissement</p>
    ${student.class ? `<p>en classe de : <strong>${student.class.name}</strong></p>` : ''}
    <p>pour l'année scolaire <strong>2025 – 2026</strong></p>
    <br>
    <p>Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.</p>
  </div>

  <div style="text-align:right;margin-top:20px">
    <p style="font-size:13px;color:#888780">Fait à Casablanca, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  </div>

  <div class="footer">
    <div class="sig">
      <div class="sig-line"></div>
      <div style="font-size:12px;color:#888780">Le Directeur</div>
      <div style="font-size:13px;font-weight:700;color:#042C53;margin-top:4px">${student.school.name}</div>
    </div>
    <div>
      <div class="stamp">${student.school.name.toUpperCase()}<br>CASABLANCA</div>
    </div>
    <div class="sig">
      <div class="sig-line"></div>
      <div style="font-size:12px;color:#888780">Cachet de l'établissement</div>
    </div>
  </div>
  
  <div style="text-align:center;margin-top:30px">
    <button onclick="window.print()" style="background:#042C53;color:white;border:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">
      Imprimer / Sauvegarder PDF
    </button>
  </div>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateRecu = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { student: true, school: true }
    });
    if (!payment) return res.status(404).json({ error: 'Paiement non trouve' });

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Recu - ${payment.student.firstName} ${payment.student.lastName}</title>
<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 30px; background: white; max-width: 500px; }
.header { background: #042C53; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 22px; font-weight: 700; }
.logo span { color: #EF9F27; font-weight: 200; }
.recu-num { font-size: 12px; opacity: 0.6; }
.amount-box { background: #EAF3DE; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
.amount { font-size: 40px; font-weight: 700; color: #3B6D11; }
.row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F5F5F3; font-size: 13px; }
.label { color: #888780; }
.value { font-weight: 700; color: #2C2C2A; }
.footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E8E6E0; }
@media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">Lux<span>Edu</span></div>
    <div style="font-size:12px;opacity:0.7;margin-top:3px">${payment.school.name}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:14px;font-weight:700">RECU DE PAIEMENT</div>
    <div class="recu-num">N° REC-${Date.now().toString().slice(-6)}</div>
  </div>
</div>

<div class="amount-box">
  <div style="font-size:12px;color:#3B6D11;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">Montant recu</div>
  <div class="amount">${payment.amount.toLocaleString('fr-FR')} MAD</div>
</div>

<div>
  ${[
    ['Eleve', payment.student.firstName + ' ' + payment.student.lastName],
    ['Code Massar', payment.student.massar],
    ['Mois', payment.month],
    ['Mode de paiement', payment.mode || 'Especes'],
    ['Statut', payment.status === 'PAID' ? 'Paye' : 'En attente'],
    ['Date', payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')],
  ].map(([l,v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}
</div>

<div class="footer">
  <div style="font-size:12px;color:#888780;margin-bottom:12px">Merci pour votre paiement · ${payment.school.name}</div>
  <button onclick="window.print()" style="background:#042C53;color:white;border:none;padding:9px 24px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">
    Imprimer le recu
  </button>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateCertificat, generateRecu };
