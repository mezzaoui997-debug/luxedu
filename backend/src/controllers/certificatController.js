const prisma = require('../utils/prisma');

const generateCertificat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { school: true, class: true }
    });
    if (!student) return res.status(404).json({ error: 'Eleve non trouve' });
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificat</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto}.border{border:6px double #042C53;padding:40px}.header{text-align:center;border-bottom:2px solid #042C53;padding-bottom:20px;margin-bottom:30px}.logo{font-size:28px;font-weight:700;color:#042C53}.title{font-size:22px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:3px;margin:20px 0}.content{font-size:15px;line-height:2.5;text-align:center}.name{font-size:20px;font-weight:700;color:#042C53;text-decoration:underline}.footer{display:flex;justify-content:space-between;margin-top:40px;padding-top:20px;border-top:1px solid #E8E6E0}.sig-line{height:40px;border-bottom:1px solid #042C53;width:150px;margin-bottom:5px}@media print{body{padding:0}}</style></head><body><div class="border"><div class="header"><div class="logo">LuxEdu</div><div style="font-size:16px;font-weight:700;color:#042C53;margin:8px 0">' + student.school.name + '</div><div style="font-size:12px;color:#888780">Agreee MEN · Maroc</div></div><div class="title">Certificat de Scolarite</div><div class="content"><p>Le Directeur certifie que</p><p class="name">' + student.lastName.toUpperCase() + ' ' + student.firstName + '</p><p>Code Massar : <strong>' + student.massar + '</strong></p>' + (student.class ? '<p>Classe : <strong>' + student.class.name + '</strong></p>' : '') + '<p>est inscrit(e) pour l annee scolaire <strong>2025-2026</strong></p><br><p>Delivre pour servir et valoir ce que de droit.</p><p style="color:#888780;font-size:13px">Casablanca, le ' + new Date().toLocaleDateString('fr-FR') + '</p></div><div class="footer"><div style="text-align:center"><div class="sig-line"></div><div style="font-size:12px;color:#888780">Le Directeur</div></div><div style="text-align:center"><div class="sig-line"></div><div style="font-size:12px;color:#888780">Cachet</div></div></div></div><div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#042C53;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">Imprimer PDF</button></div></body></html>';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateCertificat };
