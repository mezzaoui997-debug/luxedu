import { useEffect, useState, lazy, Suspense } from 'react';
import Tawjih from './Tawjih';
import MassarExport from './MassarExport';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

const getMention = (avg) => {
  if (!avg) return { label:'-', color:'#888780' };
  if (avg >= 16) return { label:'Tres bien', color:'#3B6D11' };
  if (avg >= 14) return { label:'Bien', color:'#185FA5' };
  if (avg >= 12) return { label:'Assez bien', color:'#0C447C' };
  if (avg >= 10) return { label:'Passable', color:'#854F0B' };
  return { label:'Insuffisant', color:'#A32D2D' };
};

const MENUS = [
  { sec:'Principal' },
  { id:'dashboard', ic:'🏠', lbl:'Tableau de bord' },
  { id:'notes', ic:'📊', lbl:'Saisie des notes' },
  { id:'presences', ic:'✅', lbl:'Presences' },
  { id:'eleves', ic:'👥', lbl:'Mes eleves' },
  { sec:'Communication' },
  { id:'messages', ic:'💬', lbl:'Messages parents' },
  { sec:'Orientation' },
  { id:'tawjih', ic:'🎓', lbl:'Tawjih & Orientation' },
  { id:'massar', ic:'🇲🇦', lbl:'Export Massar' },
];

export default function TeacherDashboard() {
  const { user, school, logout } = useAuthStore();
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [attendance, setAttendance] = useState({});
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

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

  useEffect(() => {
    const init = {};
    students.forEach(s => { init[s.id] = 'PRESENT'; });
    setAttendance(init);
  }, [students]);

  const setGrade = (studentId, field, value) => {
    const updated = { ...grades, [studentId]: { ...grades[studentId], [field]:value } };
    const g = updated[studentId];
    const vals = [g.devoir1, g.devoir2, g.exam].filter(v => v !== '' && v !== null && !isNaN(v));
    const avg = vals.length > 0 ? +(vals.reduce((a,b) => +a + +b, 0) / vals.length).toFixed(1) : null;
    updated[studentId].average = avg;
    setGrades(updated);
  };

  const saveNotes = async () => {
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

  const savePresences = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id] || 'PRESENT',
        date: new Date().toISOString().split('T')[0]
      }));
      await api.post('/attendance', { records });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const cycle = (id) => {
    const order = ['PRESENT','ABSENT','LATE'];
    const cur = order.indexOf(attendance[id]);
    setAttendance({...attendance, [id]: order[(cur+1)%3]});
  };

  const sendWA = (phone, msg) => {
    window.open('https://wa.me/' + phone.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent(msg), '_blank');
  };

  const STATUS = {
    PRESENT: { bg:'#EAF3DE', color:'#3B6D11', border:'#97C459', label:'Present' },
    ABSENT: { bg:'#FCEBEB', color:'#A32D2D', border:'#F09595', label:'Absent' },
    LATE: { bg:'#FAEEDA', color:'#854F0B', border:'#FAC775', label:'Retard' },
  };

  const classAvg = () => {
    const avgs = students.map(s => grades[s.id]?.average).filter(a => a != null);
    if (!avgs.length) return null;
    return (avgs.reduce((a,b) => a+b, 0) / avgs.length).toFixed(1);
  };

  const avg = classAvg();
  const lowGrades = students.filter(s => grades[s.id]?.average != null && grades[s.id].average < 10);
  const absents = students.filter(s => attendance[s.id] === 'ABSENT');

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:234, background:'linear-gradient(160deg, #064E3B 0%, #065F46 100%)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{school?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Espace Enseignant</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {MENUS.map((item, i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 10px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2, fontSize:12,
                background: page===item.id ? 'rgba(167,243,208,0.15)' : 'transparent',
                color: page===item.id ? '#A7F3D0' : 'rgba(255,255,255,0.5)',
                borderLeft: page===item.id ? '3px solid #A7F3D0' : '3px solid transparent' }}>
              <span style={{ fontSize:14 }}>{item.ic}</span>
              <span style={{ flex:1 }}>{item.lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Enseignant · Deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ background:'white', borderBottom:'1px solid #E8E6E0', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>
              {MENUS.filter(m=>m.id).find(m=>m.id===page)?.lbl || 'Tableau de bord'}
            </div>
            <div style={{ fontSize:11, color:'#888780' }}>{today} · {school?.name}</div>
          </div>
          <div style={{ background:'#D1FAE5', color:'#065F46', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>
            Enseignant
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>

          {page === 'dashboard' && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Bonjour, {user?.firstName} 👋</div>
                <div style={{ fontSize:13, color:'#888780' }}>Bienvenue sur votre espace enseignant</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
                {[
                  { ic:'👥', lbl:'Mes eleves', val:students.length, color:'#065F46', bg:'#D1FAE5' },
                  { ic:'📊', lbl:'Moyenne classe', val:avg || '-', color:'#185FA5', bg:'#E6F1FB' },
                  { ic:'⚠️', lbl:'Eleves < 10', val:lowGrades.length, color:'#A32D2D', bg:'#FCEBEB' },
                  { ic:'✅', lbl:'Absents aujourd hui', val:absents.length, color:'#854F0B', bg:'#FAEEDA' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:17, cursor:'pointer' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:11 }}>{m.ic}</div>
                    <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>{m.lbl}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>

              {lowGrades.length > 0 && (
                <div style={{ background:'linear-gradient(135deg, #064E3B 0%, #059669 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:28 }}>🤖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>Alerte IA — {lowGrades.length} eleve(s) en difficulte</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
                      {lowGrades.map(s => s.firstName).join(', ')} · Moyenne inferieure a 10
                    </div>
                  </div>
                  <button onClick={() => setPage('messages')}
                    style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    💬 Notifier parents
                  </button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Mes eleves</div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ background:'#F5F5F3' }}>
                        {['Eleve','Massar','Moyenne','Statut'].map(h => (
                          <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const g = grades[s.id];
                        const mention = getMention(g?.average);
                        return (
                          <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                            <td style={{ padding:'10px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <div style={{ width:28, height:28, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>
                                  {s.firstName[0]}{s.lastName[0]}
                                </div>
                                <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                              </div>
                            </td>
                            <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:11, color:'#888780' }}>{s.massar}</td>
                            <td style={{ padding:'10px 12px', fontWeight:700, color: g?.average ? (g.average < 10 ? '#A32D2D' : '#3B6D11') : '#888780' }}>
                              {g?.average ?? '-'}
                            </td>
                            <td style={{ padding:'10px 12px' }}>
                              <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background: g?.average ? (g.average < 10 ? '#FCEBEB' : '#EAF3DE') : '#F5F5F3', color: g?.average ? (g.average < 10 ? '#A32D2D' : '#3B6D11') : '#888780' }}>
                                {mention.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:12 }}>Actions rapides</div>
                    {[
                      { ic:'📊', lbl:'Saisir les notes', p:'notes', color:'#065F46', bg:'#D1FAE5' },
                      { ic:'✅', lbl:'Faire l appel', p:'presences', color:'#185FA5', bg:'#E6F1FB' },
                      { ic:'💬', lbl:'Contacter parents', p:'messages', color:'#854F0B', bg:'#FAEEDA' },
                    ].map(a => (
                      <button key={a.p} onClick={() => setPage(a.p)}
                        style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:8 }}>
                        <span style={{ fontSize:16 }}>{a.ic}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                        <span style={{ color:a.color }}>→</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ background:'#064E3B', borderRadius:10, padding:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:8 }}>Matiere active</div>
                    <select value={subject} onChange={e => setSubject(e.target.value)}
                      style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:'none', fontSize:12, fontWeight:700, background:'rgba(255,255,255,0.1)', color:'white', outline:'none', marginBottom:8 }}>
                      {SUBJECTS.map(s => <option key={s} style={{ color:'#042C53' }}>{s}</option>)}
                    </select>
                    <div style={{ fontSize:24, fontWeight:700, color:'white' }}>{avg || '-'}<span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>/20</span></div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Moyenne de la classe</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'notes' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={semester} onChange={e => setSemester(+e.target.value)}
                  style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  <option value={1}>Semestre 1</option>
                  <option value={2}>Semestre 2</option>
                </select>
                <button onClick={saveNotes} disabled={saving} style={{ marginLeft:'auto', background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {saving ? 'Enregistrement...' : saved ? '✓ Enregistre !' : 'Enregistrer les notes'}
                </button>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', background:'#F5F5F3', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>
                  <div>Eleve</div><div style={{ textAlign:'center' }}>Devoir 1</div><div style={{ textAlign:'center' }}>Devoir 2</div><div style={{ textAlign:'center' }}>Examen</div><div style={{ textAlign:'center' }}>Moyenne</div><div style={{ textAlign:'center' }}>Mention</div>
                </div>
                {students.map(s => {
                  const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
                  const mention = getMention(g.average);
                  return (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          {g.average != null && g.average < 10 && <div style={{ fontSize:10, color:'#A32D2D' }}>⚠ Note insuffisante</div>}
                        </div>
                      </div>
                      {['devoir1','devoir2','exam'].map(field => (
                        <input key={field} type="number" min="0" max="20" step="0.5"
                          value={g[field]} onChange={e => setGrade(s.id, field, e.target.value)} placeholder="-"
                          style={{ textAlign:'center', padding:'7px', borderRadius:8, fontSize:13, outline:'none', width:'100%',
                            border:'1.5px solid '+(g[field]!==''&&+g[field]<10?'#F09595':'#E8E6E0'),
                            background:g[field]!==''&&+g[field]<10?'#FFF8F8':'white' }} />
                      ))}
                      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, padding:'7px', borderRadius:8,
                        background:g.average==null?'#F5F5F3':g.average<10?'#FCEBEB':g.average>=14?'#EAF3DE':'#E6F1FB',
                        color:mention.color }}>
                        {g.average ?? '-'}
                      </div>
                      <div style={{ textAlign:'center', fontSize:11, fontWeight:700, color:mention.color }}>{mention.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {page === 'presences' && (
            <div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Appel du {today}</div>
                <div style={{ fontSize:13, color:'#888780' }}>Cliquez sur le bouton pour changer le statut</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[
                  { lbl:'Presents', val:students.filter(s=>attendance[s.id]==='PRESENT').length, color:'#3B6D11', bg:'#EAF3DE' },
                  { lbl:'Absents', val:students.filter(s=>attendance[s.id]==='ABSENT').length, color:'#A32D2D', bg:'#FCEBEB' },
                  { lbl:'Retards', val:students.filter(s=>attendance[s.id]==='LATE').length, color:'#854F0B', bg:'#FAEEDA' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:14, textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:700, color:m.color }}>{m.val}</div>
                    <div style={{ fontSize:11, color:'#888780', fontWeight:700, textTransform:'uppercase', marginTop:4 }}>{m.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8, marginBottom:12, justifyContent:'flex-end' }}>
                <button onClick={() => { const a={}; students.forEach(s => a[s.id]='PRESENT'); setAttendance(a); }}
                  style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Tous presents
                </button>
                <button onClick={savePresences} disabled={saving}
                  style={{ background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {saving?'...':saved?'✓ Enregistre !':'Enregistrer & Notifier WA'}
                </button>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                {students.map(s => {
                  const st = STATUS[attendance[s.id]] || STATUS.PRESENT;
                  return (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom:'1px solid #F5F5F3' }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color:'#888780' }}>{s.massar}</div>
                      </div>
                      <button onClick={() => cycle(s.id)}
                        style={{ padding:'7px 16px', borderRadius:8, border:'1px solid '+st.border, cursor:'pointer', fontWeight:700, fontSize:12, background:st.bg, color:st.color, minWidth:100 }}>
                        {st.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {page === 'eleves' && (
            <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#F5F5F3' }}>
                    {['Eleve','Code Massar','Moyenne','Mention','Tel. Parent'].map(h => (
                      <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const g = grades[s.id];
                    const mention = getMention(g?.average);
                    return (
                      <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          </div>
                        </td>
                        <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                        <td style={{ padding:'11px 12px', fontWeight:700, color: g?.average ? (g.average < 10 ? '#A32D2D' : '#3B6D11') : '#888780' }}>{g?.average ?? '-'}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background: g?.average ? (g.average < 10 ? '#FCEBEB' : '#EAF3DE') : '#F5F5F3', color:mention.color }}>
                            {mention.label}
                          </span>
                        </td>
                        <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {page === 'tawjih' && <Tawjih />}
          {page === 'massar' && <MassarExport />}

          {page === 'messages' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:4 }}>Messages parents</div>
                <div style={{ fontSize:13, color:'#888780' }}>Selectionnez un eleve pour envoyer un message WhatsApp</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14 }}>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#042C53', marginBottom:12, textTransform:'uppercase' }}>Eleves</div>
                  {students.map(s => {
                    const g = grades[s.id];
                    const hasLowGrade = g?.average != null && g.average < 10;
                    return (
                      <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #F5F5F3', cursor:'pointer' }}
                        onClick={() => setSelectedMsg(s.id === selectedMsg ? null : s.id)}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background: s.id===selectedMsg?'#064E3B':'#D1FAE5', color:s.id===selectedMsg?'white':'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                          <div style={{ display:'flex', gap:4, marginTop:2 }}>
                            {hasLowGrade && <span style={{ fontSize:9, background:'#FCEBEB', color:'#A32D2D', padding:'1px 6px', borderRadius:10, fontWeight:700 }}>Note faible</span>}
                            {attendance[s.id] === 'ABSENT' && <span style={{ fontSize:9, background:'#FAEEDA', color:'#854F0B', padding:'1px 6px', borderRadius:10, fontWeight:700 }}>Absent</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  {!selectedMsg ? (
                    <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:32, textAlign:'center' }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>💬</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#042C53' }}>Selectionnez un eleve</div>
                    </div>
                  ) : (() => {
                    const s = students.find(x => x.id === selectedMsg);
                    if (!s) return null;
                    const g = grades[s.id];
                    const hasLowGrade = g?.average != null && g.average < 10;
                    const isAbsent = attendance[s.id] === 'ABSENT';
                    return (
                      <div>
                        <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:14, marginBottom:12, display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:44, height:44, borderRadius:10, background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div>
                            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{s.firstName} {s.lastName}</div>
                            <div style={{ fontSize:12, color:'#888780' }}>{s.massar} · {s.parentPhone || 'Pas de telephone'}</div>
                          </div>
                        </div>
                        {!s.parentPhone ? (
                          <div style={{ background:'#FCEBEB', borderRadius:10, padding:14, textAlign:'center', color:'#A32D2D', fontSize:13, fontWeight:700 }}>
                            Aucun telephone pour cet eleve
                          </div>
                        ) : (
                          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                            {hasLowGrade && (
                              <div style={{ background:'#FCEBEB', border:'1px solid #F09595', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:22 }}>📊</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:13, fontWeight:700, color:'#A32D2D' }}>Note insuffisante — {g.average}/20</div>
                                  <div style={{ fontSize:11, color:'#888780' }}>En {subject} · Soutien recommande</div>
                                </div>
                                <button onClick={() => sendWA(s.parentPhone, 'Bonjour, votre enfant ' + s.firstName + ' a obtenu ' + g.average + '/20 en ' + subject + '. Un soutien scolaire est fortement recommande. ' + school?.name)}
                                  style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'7px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                                  💬 WA urgent
                                </button>
                              </div>
                            )}
                            {isAbsent && (
                              <div style={{ background:'#FAEEDA', border:'1px solid #FAC775', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:22 }}>✅</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:13, fontWeight:700, color:'#854F0B' }}>Absent aujourd hui</div>
                                </div>
                                <button onClick={() => sendWA(s.parentPhone, 'Bonjour, votre enfant ' + s.firstName + ' etait absent(e) aujourd hui. Merci de nous contacter. ' + school?.name)}
                                  style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'7px 12px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                                  💬 WA absence
                                </button>
                              </div>
                            )}
                            {[
                              { ic:'⏰', title:'Retard', msg:'Bonjour, votre enfant ' + s.firstName + ' est arrive(e) en retard aujourd hui. ' + school?.name },
                              { ic:'📅', title:'Convocation', msg:'Bonjour, vous etes convoques pour un entretien concernant ' + s.firstName + '. Contactez-nous. ' + school?.name },
                              { ic:'🎉', title:'Felicitations', msg:'Bonjour, ' + s.firstName + ' a obtenu d excellents resultats ! Bravo ! ' + school?.name },
                            ].map(t => (
                              <div key={t.title} style={{ background:'#F5F5F3', borderRadius:10, padding:'11px 14px', display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:20 }}>{t.ic}</span>
                                <div style={{ flex:1, fontSize:12, fontWeight:700, color:'#042C53' }}>{t.title}</div>
                                <button onClick={() => sendWA(s.parentPhone, t.msg)}
                                  style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                                  💬 Envoyer
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
