import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

export default function MassarExport() {
  const { school, user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [subject, setSubject] = useState('Mathematiques');
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
  }, []);

  useEffect(() => {
    if (!students.length) return;
    setLoading(true);
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades && s.grades[0];
        map[s.id] = g ? { devoir1:g.devoir1, devoir2:g.devoir2, exam:g.exam, average:g.average } : null;
      });
      setGrades(map);
      setLoading(false);
    });
  }, [subject, semester, students]);

  const copy = (text, id) => {
    navigator.clipboard.writeText(String(text));
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const validStudents = students.filter(s => /^[A-Z][0-9]{9}$/.test(s.massar));
  const ready = validStudents.filter(s => grades[s.id]);

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Saisie Massar</div>
        <div style={{ fontSize:13, color:'#888780' }}>
          Copiez les notes depuis LuxEdu et collez-les dans Massar Moudaris
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        <div style={{ background:'linear-gradient(135deg, #042C53 0%, #185FA5 100%)', borderRadius:10, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:4 }}>
            Etape 1 — Ouvrir Massar Moudaris
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:12 }}>
            Connectez-vous avec votre compte @taalim.ma sur le portail officiel
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <a href="https://massarservice.men.gov.ma/moudaris" target="_blank" rel="noreferrer"
              style={{ background:'white', color:'#042C53', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, textDecoration:'none', display:'inline-block' }}>
              🖥️ Massar sur PC →
            </a>
            <a href="https://play.google.com/store/apps/details?id=ma.gov.men.massar.professeur" target="_blank" rel="noreferrer"
              style={{ background:'#EF9F27', color:'#633806', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, textDecoration:'none', display:'inline-block' }}>
              📱 App Massar Moudaris
            </a>
          </div>
        </div>

        <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:12 }}>
            Etape 2 — Selectionner la matiere
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              style={{ flex:1, padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={semester} onChange={e => setSemester(+e.target.value)}
              style={{ padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
              <option value={1}>S1</option>
              <option value={2}>S2</option>
            </select>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:'#888780' }}>
            {ready.length} eleve(s) prets · {validStudents.length - ready.length} sans notes
          </div>
        </div>
      </div>

      <div style={{ background:'#EAF3DE', border:'1px solid #97C459', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:12, color:'#3B6D11' }}>
        <strong>💡 Comment utiliser :</strong> Ouvrez Massar Moudaris dans un autre onglet → selectionnez la meme matiere → copiez chaque note en cliquant dessus → collez dans Massar.
      </div>

      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid #E8E6E0', background:'#F5F5F3', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#042C53', flex:1 }}>
            Notes {subject} — Semestre {semester}
          </div>
          {loading && <div style={{ fontSize:12, color:'#888780' }}>⏳ Chargement...</div>}
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#042C53' }}>
              {['Code Massar','Eleve','DS1 (cliquer)','DS2 (cliquer)','Exam (cliquer)','Moyenne (cliquer)','Statut'].map(h => (
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.7)', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const g = grades[s.id];
              const validMassar = /^[A-Z][0-9]{9}$/.test(s.massar);
              return (
                <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3', background: !validMassar ? '#FFF8F8' : 'white' }}>
                  <td style={{ padding:'12px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, color: validMassar ? '#042C53' : '#A32D2D', letterSpacing:'0.05em' }}>
                        {s.massar}
                      </span>
                      {validMassar && (
                        <button onClick={() => copy(s.massar, 'massar-'+s.id)}
                          style={{ background: copied==='massar-'+s.id?'#EAF3DE':'#F5F5F3', border:'none', borderRadius:5, padding:'2px 7px', fontSize:10, cursor:'pointer', color: copied==='massar-'+s.id?'#3B6D11':'#888780' }}>
                          {copied==='massar-'+s.id ? '✓' : '📋'}
                        </button>
                      )}
                    </div>
                    {!validMassar && <div style={{ fontSize:10, color:'#A32D2D', marginTop:2 }}>Code invalide</div>}
                  </td>
                  <td style={{ padding:'12px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                      </div>
                    </div>
                  </td>
                  {['devoir1','devoir2','exam'].map(field => (
                    <td key={field} style={{ padding:'12px 12px' }}>
                      {g && g[field] != null ? (
                        <button onClick={() => copy(g[field], field+s.id)}
                          style={{ background: copied===field+s.id?'#EAF3DE':'#F5F5F3', border:'1px solid '+(copied===field+s.id?'#97C459':'#E8E6E0'), borderRadius:8, padding:'7px 14px', fontSize:14, fontWeight:700, cursor:'pointer',
                            color: g[field] < 10 ? '#A32D2D' : '#3B6D11', minWidth:60, textAlign:'center' }}>
                          {copied===field+s.id ? '✓ Copie!' : g[field]}
                        </button>
                      ) : (
                        <span style={{ color:'#C8C5BE', fontSize:13 }}>—</span>
                      )}
                    </td>
                  ))}
                  <td style={{ padding:'12px 12px' }}>
                    {g && g.average != null ? (
                      <button onClick={() => copy(g.average, 'avg'+s.id)}
                        style={{ background: copied==='avg'+s.id?'#042C53':'#E6F1FB', border:'none', borderRadius:8, padding:'7px 14px', fontSize:15, fontWeight:700, cursor:'pointer',
                          color: copied==='avg'+s.id?'white': g.average < 10 ? '#A32D2D' : '#3B6D11', minWidth:60, textAlign:'center' }}>
                        {copied==='avg'+s.id ? '✓ Copie!' : g.average}
                      </button>
                    ) : (
                      <span style={{ color:'#C8C5BE', fontSize:13 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding:'12px 12px' }}>
                    {!validMassar ? (
                      <span style={{ background:'#FCEBEB', color:'#A32D2D', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Code invalide</span>
                    ) : !g ? (
                      <span style={{ background:'#FAEEDA', color:'#854F0B', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Sans notes</span>
                    ) : (
                      <span style={{ background:'#EAF3DE', color:'#3B6D11', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>✓ Pret Massar</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginTop:14 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:12 }}>Guide saisie Massar Moudaris</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[
            ['1','Ouvrez massarservice.men.gov.ma dans un autre onglet'],
            ['2','Connectez-vous avec votre compte @taalim.ma'],
            ['3','Allez dans Saisie des notes → selectionnez la classe'],
            ['4','Selectionnez la meme matiere que dans LuxEdu'],
            ['5','Cliquez sur chaque note dans LuxEdu pour la copier'],
            ['6','Collez la note dans le champ correspondant dans Massar'],
          ].map(([num, txt]) => (
            <div key={num} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#F5F5F3', borderRadius:8 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'#042C53', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                {num}
              </div>
              <div style={{ fontSize:12, color:'#042C53' }}>{txt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
