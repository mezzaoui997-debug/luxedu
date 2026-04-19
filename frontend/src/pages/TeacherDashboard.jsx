import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

export default function TeacherDashboard() {
  const { user, school, logout } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState({});
  const [subject, setSubject] = useState(user?.subject || 'Mathematiques');
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState('notes');

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
    api.get('/classes').then(r => setClasses(r.data));
  }, []);

  useEffect(() => {
    if (!students.length) return;
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades?.[0];
        map[s.id] = g ? { devoir1:g.devoir1??'', devoir2:g.devoir2??'', exam:g.exam??'', average:g.average } : { devoir1:'', devoir2:'', exam:'', average:null };
      });
      setGrades(map);
    });
  }, [subject, semester, students]);

  const setGrade = (studentId, field, value) => {
    const updated = { ...grades, [studentId]: { ...grades[studentId], [field]:value } };
    const g = updated[studentId];
    const vals = [g.devoir1, g.devoir2, g.exam].filter(v => v !== '' && v !== null && !isNaN(v));
    const avg = vals.length > 0 ? +(vals.reduce((a,b) => +a + +b, 0) / vals.length).toFixed(1) : null;
    updated[studentId].average = avg;
    setGrades(updated);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(students.map(s => {
        const g = grades[s.id];
        if (!g) return Promise.resolve();
        return api.post('/grades', {
          studentId: s.id, subject, semester,
          devoir1: g.devoir1 !== '' ? +g.devoir1 : null,
          devoir2: g.devoir2 !== '' ? +g.devoir2 : null,
          exam: g.exam !== '' ? +g.exam : null,
        });
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const getMention = (avg) => {
    if (!avg) return { label:'-', color:'var(--g2)' };
    if (avg >= 16) return { label:'Tres bien', color:'var(--green)' };
    if (avg >= 14) return { label:'Bien', color:'var(--blue)' };
    if (avg >= 12) return { label:'Assez bien', color:'var(--blue2)' };
    if (avg >= 10) return { label:'Passable', color:'var(--amber)' };
    return { label:'Insuffisant', color:'var(--red)' };
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:220, background:'var(--navy)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'white' }}>{school?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Espace Enseignant</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px' }}>
          {[['notes','📊','Mes notes'],['presences','✅','Presences'],['eleves','👥','Mes eleves']].map(([id,ic,lbl]) => (
            <div key={id} onClick={() => setPage(id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2,
                background: page===id?'rgba(255,255,255,0.14)':'transparent',
                color: page===id?'white':'rgba(255,255,255,0.55)', fontSize:12 }}>
              <span>{ic}</span>{lbl}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', cursor:'pointer', borderRadius:8 }} onClick={logout}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Se deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'white', borderBottom:'1px solid var(--g1)', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>
              {page==='notes'?'Saisie des notes':page==='presences'?'Presences':'Mes eleves'}
            </div>
            <div style={{ fontSize:11, color:'var(--g2)' }}>{school?.name} · {user?.firstName} {user?.lastName}</div>
          </div>
          <div style={{ background:'var(--greenl)', color:'var(--green)', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>
            Enseignant
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>
          {page === 'notes' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
                <select value={subject} onChange={e => setSubject(e.target.value)} className="sel">
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={semester} onChange={e => setSemester(+e.target.value)} className="sel">
                  <option value={1}>Semestre 1</option>
                  <option value={2}>Semestre 2</option>
                </select>
                <button className="btn btn-navy" onClick={saveAll} disabled={saving} style={{ marginLeft:'auto' }}>
                  {saving?'Enregistrement...':saved?'Enregistre !':'Enregistrer les notes'}
                </button>
              </div>

              <div className="card cp">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', background:'var(--g0)', borderRadius:7, marginBottom:8, fontSize:10, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>
                  <div>Eleve</div>
                  <div style={{ textAlign:'center' }}>Devoir 1</div>
                  <div style={{ textAlign:'center' }}>Devoir 2</div>
                  <div style={{ textAlign:'center' }}>Examen</div>
                  <div style={{ textAlign:'center' }}>Moyenne</div>
                  <div style={{ textAlign:'center' }}>Mention</div>
                </div>
                {students.map(s => {
                  const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
                  const mention = getMention(g.average);
                  return (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C' }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                      </div>
                      {['devoir1','devoir2','exam'].map(field => (
                        <input key={field} type="number" min="0" max="20" step="0.5"
                          value={g[field]} onChange={e => setGrade(s.id, field, e.target.value)}
                          placeholder="-"
                          style={{ textAlign:'center', padding:'7px', borderRadius:8, fontSize:13, outline:'none', width:'100%',
                            border:'1.5px solid '+(g[field]!==''&&+g[field]<10?'#F09595':'var(--g1)'),
                            background: g[field]!==''&&+g[field]<10?'#FFF8F8':'white' }} />
                      ))}
                      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, padding:'7px', borderRadius:8,
                        background: g.average==null?'var(--g0)':g.average<10?'var(--redl)':g.average>=14?'var(--greenl)':'var(--bl)',
                        color: mention.color }}>
                        {g.average ?? '-'}
                      </div>
                      <div style={{ textAlign:'center', fontSize:11, fontWeight:700, color:mention.color }}>
                        {mention.label}
                      </div>
                    </div>
                  );
                })}
                {students.length === 0 && (
                  <div style={{ padding:24, textAlign:'center', color:'var(--g2)' }}>Aucun eleve</div>
                )}
              </div>
            </div>
          )}

          {page === 'eleves' && (
            <div className="card cp">
              <table className="tbl">
                <thead>
                  <tr><th>Eleve</th><th>Code Massar</th><th>Classe</th><th>Tel. Parent</th></tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C' }}>
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                        </div>
                      </td>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                      <td>{s.class?.name || '-'}</td>
                      <td style={{ color:'var(--g2)' }}>{s.parentPhone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {page === 'presences' && (
            <div style={{ padding:20, textAlign:'center', color:'var(--g2)' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>Presences — bientot disponible</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
