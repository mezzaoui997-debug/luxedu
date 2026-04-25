import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Certificats() {
  const { school, user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dirName, setDirName] = useState(user?.firstName+' '+user?.lastName || 'Ahmed Benali');
  const [toast, setToast] = useState('');

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)).catch(()=>{}); }, []);

  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const generateCert = (s) => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificat — ${s.firstName} ${s.lastName}</title>
<style>
body{font-family:'Times New Roman',serif;padding:60px;max-width:750px;margin:0 auto;color:#111;}
.border{border:6px double #1e2d4f;padding:50px;min-height:600px;position:relative;}
.header{text-align:center;border-bottom:2px solid #1e2d4f;padding-bottom:24px;margin-bottom:36px;}
.school-name{font-size:22px;font-weight:700;color:#1e2d4f;margin-bottom:6px;}
.school-sub{font-size:13px;color:#6b7280;}
.title{font-size:28px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:4px;color:#1e2d4f;margin:0 0 40px;}
.content{font-size:16px;line-height:2.8;text-align:center;}
.student-name{font-size:24px;font-weight:700;color:#1e2d4f;text-decoration:underline;display:block;margin:8px 0;}
.massar{font-family:monospace;font-size:16px;font-weight:700;}
.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:60px;padding-top:24px;border-top:1px solid #e5e9f2;}
.sig-block{text-align:center;width:220px;}
.sig-line{height:60px;border-bottom:1px solid #1e2d4f;margin-bottom:8px;}
.sig-name{font-size:14px;font-weight:700;color:#1e2d4f;}
.sig-title{font-size:12px;color:#6b7280;}
.stamp{width:110px;height:110px;border:3px solid #1e2d4f;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;font-weight:700;color:#1e2d4f;padding:10px;margin:0 auto;}
.ref{text-align:right;font-size:11px;color:#9ca3af;margin-bottom:10px;}
.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:90px;color:rgba(30,45,79,0.04);font-weight:700;pointer-events:none;white-space:nowrap;}
@media print{body{padding:0}.print-btn{display:none}}
</style></head><body>
<div class="border">
  <div class="watermark">ORIGINAL</div>
  <div class="ref">Ref: CERT-${new Date().getFullYear()}-${s.massar}</div>
  <div class="header">
    <div class="school-name">${school?.name || 'Ecole Excellence Casablanca'}</div>
    <div class="school-sub">Agréée par le Ministère de l'Éducation Nationale du Royaume du Maroc</div>
    <div class="school-sub">Casablanca, Maroc</div>
  </div>
  <div class="title">Certificat de Scolarité</div>
  <div class="content">
    <p>Le Directeur de l'établissement soussigné certifie que</p>
    <span class="student-name">${s.lastName.toUpperCase()} ${s.firstName}</span>
    <p>Code Massar (CNE) : <span class="massar">${s.massar}</span></p>
    ${s.dateOfBirth ? `<p>Né(e) le : <strong>${new Date(s.dateOfBirth).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}</strong></p>` : ''}
    <p>est régulièrement inscrit(e) dans notre établissement</p>
    <p>pour l'année scolaire <strong>2025 – 2026</strong></p>
    <br>
    <p style="font-size:14px;color:#6b7280">Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.</p>
  </div>
  <div style="text-align:right;margin-top:24px;font-size:13px;color:#6b7280">
    Fait à Casablanca, le ${new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
  </div>
  <div class="footer">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">${dirName}</div>
      <div class="sig-title">Le Directeur</div>
    </div>
    <div>
      <div class="stamp">${(school?.name || 'ECOLE').slice(0,20).toUpperCase()}<br>CASABLANCA</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-title">Cachet de l'établissement</div>
    </div>
  </div>
</div>
<div class="print-btn" style="text-align:center;margin-top:20px">
  <button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:11px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">
    Imprimer / Sauvegarder en PDF
  </button>
</div>
</body></html>`;
    const blob = new Blob([html], { type:'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
    showT('Certificat genere pour '+s.firstName+' '+s.lastName);
  };

  const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };
  const TH = { textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 14px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' };
  const TD = { padding:'13px 14px', borderBottom:'1px solid #e5e9f2', fontSize:13, verticalAlign:'middle' };

  return (
    <div>
      {toast && <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1e2d4f', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999 }}>✓ {toast}</div>}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Certificats de scolarité</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>Generez des certificats officiels avec signature du directeur</p>
      </div>

      <div style={{ ...C, marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Nom du Directeur (pour la signature)</div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <input value={dirName} onChange={e => setDirName(e.target.value)}
            placeholder="Nom complet du directeur"
            style={{ flex:1, padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }} />
          <div style={{ fontSize:12, color:'#6b7280' }}>Ce nom apparaitra sur tous les certificats</div>
        </div>
      </div>

      <div style={{ ...C, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Eleves — {students.length} certificats disponibles</span>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{['Eleve','Code Massar','Date inscription','Actions'].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td style={TD}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight:500 }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:11, color:'#6b7280' }}>{s.parentPhone||'—'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...TD, fontFamily:'monospace', fontSize:12, color:'#1e2d4f', fontWeight:600 }}>{s.massar}</td>
                <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                <td style={TD}>
                  <button onClick={() => generateCert(s)}
                    style={{ padding:'6px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Generer PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#1e40af', marginBottom:10 }}>Apercu du certificat</div>
        <div style={{ background:'white', borderRadius:10, padding:24, border:'6px double #1e2d4f', maxWidth:500 }}>
          <div style={{ textAlign:'center', borderBottom:'2px solid #1e2d4f', paddingBottom:14, marginBottom:20 }}>
            <div style={{ fontSize:16, fontWeight:700, color:'#1e2d4f' }}>{school?.name || 'Ecole Excellence Casablanca'}</div>
            <div style={{ fontSize:11, color:'#6b7280' }}>Agréée par le Ministère de l'Éducation Nationale</div>
          </div>
          <div style={{ fontSize:18, fontWeight:700, textAlign:'center', textTransform:'uppercase', letterSpacing:3, color:'#1e2d4f', marginBottom:20 }}>Certificat de Scolarité</div>
          <div style={{ fontSize:13, lineHeight:2.2, textAlign:'center', color:'#374151' }}>
            Le Directeur certifie que<br/>
            <strong style={{ fontSize:16, color:'#1e2d4f', textDecoration:'underline' }}>[NOM PRENOM DE L'ELEVE]</strong><br/>
            Code Massar : <span style={{ fontFamily:'monospace', fontWeight:700 }}>[MASSAR]</span><br/>
            est inscrit(e) pour l'année scolaire <strong>2025 – 2026</strong>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:30, paddingTop:16, borderTop:'1px solid #e5e9f2' }}>
            <div style={{ textAlign:'center', width:160 }}>
              <div style={{ height:40, borderBottom:'1px solid #1e2d4f', marginBottom:6 }}></div>
              <div style={{ fontSize:12, fontWeight:700, color:'#1e2d4f' }}>{dirName}</div>
              <div style={{ fontSize:11, color:'#6b7280' }}>Le Directeur</div>
            </div>
            <div style={{ textAlign:'center', width:160 }}>
              <div style={{ height:40, borderBottom:'1px solid #1e2d4f', marginBottom:6 }}></div>
              <div style={{ fontSize:11, color:'#6b7280' }}>Cachet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
