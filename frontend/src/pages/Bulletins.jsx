import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const DEMO_STUDENTS = [
  { id:'d1', firstName:'Youssef', lastName:'Benjelloun', massar:'B903751842', class:{ name:'6ème Excellence' } },
  { id:'d2', firstName:'Omar',    lastName:'Moussa',     massar:'G412252321', class:{ name:'6ème Excellence' } },
  { id:'d3', firstName:'Kenza',   lastName:'Alami',      massar:'K234567891', class:{ name:'5ème A' } },
];

const DEMO_GRADES = [
  { subject:'Mathématiques',     coefficient:3, s1:16.5, s2:17.2 },
  { subject:'Français',          coefficient:3, s1:14.0, s2:15.5 },
  { subject:'Sciences',          coefficient:2, s1:15.5, s2:16.0 },
  { subject:'Histoire-Géo',      coefficient:2, s1:13.5, s2:14.0 },
  { subject:'Arabe',             coefficient:3, s1:12.5, s2:13.0 },
  { subject:'Anglais',           coefficient:2, s1:14.5, s2:15.0 },
  { subject:'Éducation Phys.',   coefficient:1, s1:17.0, s2:18.0 },
];

function avg(grades, sem) {
  const key = sem === 1 ? 's1' : 's2';
  const total = grades.reduce((a,g) => a + g[key]*g.coefficient, 0);
  const coef  = grades.reduce((a,g) => a + g.coefficient, 0);
  return (total/coef).toFixed(2);
}

function mention(m) {
  if (m >= 16) return { label:'Très Bien', color:'#16A34A' };
  if (m >= 14) return { label:'Bien',      color:'#2563EB' };
  if (m >= 12) return { label:'Assez Bien',color:'#D97706' };
  if (m >= 10) return { label:'Passable',  color:'#6B7280' };
  return { label:'Insuffisant', color:'#DC2626' };
}

export default function Bulletins() {
  const { school, schoolLogo } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState(1);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');

  useEffect(() => {
    api.get('/students')
      .then(r => { setStudents(r.data?.length ? r.data : DEMO_STUDENTS); })
      .catch(() => setStudents(DEMO_STUDENTS))
      .finally(() => setLoading(false));
  }, []);

  const printBulletin = (student) => {
    const m = parseFloat(avg(DEMO_GRADES, semester));
    const men = mention(m);
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Bulletin — ${student.firstName} ${student.lastName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Arial', sans-serif; padding: 30px; color: #1a1a1a; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom: 3px solid #1B2C5E; padding-bottom: 18px; margin-bottom: 20px; }
  .school-info h1 { font-size: 22px; color: #1B2C5E; font-weight: 700; }
  .school-info p { font-size: 12px; color: #666; margin-top: 3px; }
  .bulletin-title { text-align:center; }
  .bulletin-title h2 { font-size: 18px; color: #1B2C5E; font-weight: 700; }
  .bulletin-title p { font-size: 13px; color: #666; }
  .student-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px; display:flex; gap:40px; }
  .student-box label { font-size: 10px; text-transform:uppercase; letter-spacing:.06em; color:#94A3B8; display:block; margin-bottom:3px; }
  .student-box strong { font-size: 14px; color: #0F172A; font-weight: 700; }
  table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  th { background:#1B2C5E; color:white; padding:9px 12px; font-size:11px; text-align:left; }
  td { padding:9px 12px; border-bottom:1px solid #F1F5F9; font-size:13px; }
  tr:nth-child(even) td { background:#F8FAFC; }
  .avg-row td { background:#EFF6FF !important; font-weight:700; color:#1B2C5E; }
  .mention { display:inline-block; padding:4px 14px; border-radius:20px; font-size:13px; font-weight:700; }
  .footer { text-align:center; margin-top:30px; font-size:11px; color:#94A3B8; border-top:1px solid #E2E8F0; padding-top:14px; }
  .signature { display:flex; justify-content:space-between; margin-top:40px; }
  .sig-box { text-align:center; }
  .sig-box .line { width:160px; border-bottom:1px solid #1B2C5E; margin:40px auto 6px; }
  .sig-box p { font-size:12px; color:#64748B; }
  @media print { body { padding: 15px; } }
</style>
</head>
<body>
<div class="header">
  <div class="school-info">
    ${schoolLogo ? `<img src="${schoolLogo}" style="height:60px;object-fit:contain;margin-bottom:8px;" />` : ''}
    <h1>${school?.name || 'École Excellence'}</h1>
    <p>${school?.city || 'Maroc'} · Année scolaire 2025-2026</p>
  </div>
  <div class="bulletin-title">
    <h2>BULLETIN SCOLAIRE</h2>
    <p>Semestre ${semester} — 2025-2026</p>
    <p style="margin-top:6px;font-size:11px;color:#94A3B8;">Conforme MEN Maroc</p>
  </div>
</div>

<div class="student-box">
  <div><label>Nom complet</label><strong>${student.firstName} ${student.lastName}</strong></div>
  <div><label>Code Massar</label><strong>${student.massar}</strong></div>
  <div><label>Classe</label><strong>${student.class?.name || '—'}</strong></div>
  <div><label>Semestre</label><strong>S${semester}</strong></div>
</div>

<table>
  <thead>
    <tr>
      <th>Matière</th>
      <th style="text-align:center">Coeff.</th>
      <th style="text-align:center">Note /20</th>
      <th style="text-align:center">Points</th>
      <th>Appréciation</th>
    </tr>
  </thead>
  <tbody>
    ${DEMO_GRADES.map(g => {
      const note = semester === 1 ? g.s1 : g.s2;
      const pts = (note * g.coefficient).toFixed(1);
      const app = note >= 16 ? 'Très Bien' : note >= 14 ? 'Bien' : note >= 12 ? 'Assez Bien' : note >= 10 ? 'Passable' : 'Insuffisant';
      return `<tr><td>${g.subject}</td><td style="text-align:center">${g.coefficient}</td><td style="text-align:center;font-weight:700">${note.toFixed(1)}</td><td style="text-align:center">${pts}</td><td>${app}</td></tr>`;
    }).join('')}
    <tr class="avg-row">
      <td colspan="2">Moyenne générale</td>
      <td style="text-align:center;font-size:16px">${avg(DEMO_GRADES, semester)}</td>
      <td></td>
      <td><span class="mention" style="background:${mention(parseFloat(avg(DEMO_GRADES, semester))).color}22;color:${mention(parseFloat(avg(DEMO_GRADES, semester))).color}">${mention(parseFloat(avg(DEMO_GRADES, semester))).label}</span></td>
    </tr>
  </tbody>
</table>

<div class="signature">
  <div class="sig-box"><div class="line"></div><p>Le Directeur</p></div>
  <div class="sig-box" style="text-align:center"><div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:10px 20px;border-radius:8px;margin-bottom:6px;font-size:11px;color:#64748B">Cachet de l'établissement</div></div>
  <div class="sig-box"><div class="line"></div><p>Signature des parents</p></div>
</div>

<div class="footer">
  ${school?.name || 'École Excellence'} · ${school?.city || 'Maroc'} · Bulletin généré le ${new Date().toLocaleDateString('fr-FR')} · LuxEdu ERP
</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const displayed = students.filter(s =>
    !filter || `${s.firstName} ${s.lastName} ${s.massar}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Bulletins PDF</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Format conforme MEN Maroc · Génération en 1 clic</p>
        </div>
        <button onClick={() => displayed.forEach(s => printBulletin(s))}
          style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          Générer tous les bulletins
        </button>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:9, padding:4 }}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setSemester(s)} style={{ padding:'8px 20px', border:'none', borderRadius:7, fontSize:13, fontWeight:semester===s?700:500, cursor:'pointer', fontFamily:'inherit', background:semester===s?'#fff':'transparent', color:semester===s?'#1B2C5E':'#64748B', boxShadow:semester===s?'0 1px 3px rgba(0,0,0,.08)':'none' }}>
              Semestre {s}
            </button>
          ))}
        </div>
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher un élève..." style={{ flex:1, padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit', background:'#F8FAFC' }} />
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Total élèves',   val:students.length,   color:'#2563EB', bg:'#EFF6FF' },
          { label:'À générer',      val:displayed.length,  color:'#D97706', bg:'#FFFBEB' },
          { label:'Semestre',       val:`S${semester}`,    color:'#7C3AED', bg:'#F5F3FF' },
          { label:'Année',          val:'2025-2026',       color:'#16A34A', bg:'#F0FDF4' },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.bg}`, borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#F8FAFC' }}>
              {['Élève','Code Massar','Classe','Moyenne S'+semester,'Mention','Actions'].map(h => (
                <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'#94A3B8' }}>Chargement...</td></tr>
            ) : displayed.map(s => {
              const m = parseFloat(avg(DEMO_GRADES, semester));
              const men = mention(m);
              return (
                <tr key={s.id} style={{ borderBottom:'1px solid #F1F5F9' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'#1B2C5E', color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{s.firstName} {s.lastName}</div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', fontFamily:'monospace', fontSize:12, color:'#1B2C5E', fontWeight:600 }}>{s.massar}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#64748B' }}>{s.class?.name || '—'}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color:men.color }}>{m.toFixed(2)}</span>
                    <span style={{ fontSize:11, color:'#94A3B8', marginLeft:4 }}>/20</span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:men.color+'22', color:men.color }}>
                      {men.label}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={() => printBulletin(s)}
                      style={{ padding:'7px 16px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                      Imprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
