import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

const FILIERES = [
  { id:'SM', lbl:'Sciences Mathematiques', color:'#042C53', bg:'#E6F1FB', min:15, icon:'📐', debouches:'Ingenierie, Medecine, CPGE', matieres:['Mathematiques','Physique-Chimie','SVT'] },
  { id:'PC', lbl:'Sciences Physiques', color:'#185FA5', bg:'#E6F1FB', min:13, icon:'⚗️', debouches:'Chimie, Pharmacie, Ingenierie', matieres:['Physique-Chimie','Mathematiques','SVT'] },
  { id:'SVT', lbl:'Sciences de la Vie', color:'#3B6D11', bg:'#EAF3DE', min:12, icon:'🌿', debouches:'Medecine, Pharmacie, Biologie', matieres:['SVT','Physique-Chimie','Mathematiques'] },
  { id:'ECO', lbl:'Sciences Economiques', color:'#854F0B', bg:'#FAEEDA', min:11, icon:'📈', debouches:'Commerce, Finance, ENCG', matieres:['Mathematiques','Francais','Anglais'] },
  { id:'LSH', lbl:'Lettres et Sciences Humaines', color:'#534AB7', bg:'#EEEDFE', min:10, icon:'📚', debouches:'Droit, Langues, Journalisme', matieres:['Arabe','Francais','Histoire-Geo'] },
];

const JOURS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const HEURES = ['08h-09h','09h-10h','10h-11h','11h-12h','14h-15h','15h-16h','16h-17h'];

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
  { id:'cahier', ic:'📖', lbl:'Cahier de textes' },
  { id:'devoirs', ic:'📝', lbl:'Devoirs' },
  { id:'eleves', ic:'👥', lbl:'Mes eleves' },
  { sec:'Orientation' },
  { id:'tawjih', ic:'🎓', lbl:'Tawjih BAC' },
  { id:'massar', ic:'🇲🇦', lbl:'Saisie Massar' },
  { sec:'Planning' },
  { id:'planning', ic:'📅', lbl:'Mon planning' },
  { id:'classes', ic:'🏫', lbl:'Mes classes' },
];

export default function TeacherDashboard() {
  const { user, school, logout } = useAuthStore();
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [allGrades, setAllGrades] = useState({});
  const [attendance, setAttendance] = useState({});
  const [subject, setSubject] = useState('Mathematiques');
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(null);
  const [massarSubject, setMassarSubject] = useState('Mathematiques');
  const [massarSemester, setMassarSemester] = useState(1);
  const [massarGrades, setMassarGrades] = useState({});
  const [cahier, setCahier] = useState([]);
  const [newLecon, setNewLecon] = useState({ date: new Date().toISOString().split('T')[0], matiere: 'Mathematiques', classe: '', titre: '', contenu: '', travail: '' });
  const [devoirs, setDevoirs] = useState([]);
  const [planning, setPlanning] = useState({});
  const [newCours, setNewCours] = useState({ jour:'Lundi', heure:'08h-09h', matiere:'Mathematiques', classe:'', salle:'' });
  const [newDevoir, setNewDevoir] = useState({ matiere: 'Mathematiques', classe: '', titre: '', dateRemise: '', description: '' });
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  useEffect(() => {
    if (!students.length) return;
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades && s.grades[0];
        map[s.id] = g ? { devoir1:g.devoir1??'', devoir2:g.devoir2??'', exam:g.exam??'', average:g.average } : { devoir1:'', devoir2:'', exam:'', average:null };
      });
      setGrades(map);
    });
  }, [subject, semester, students]);

  useEffect(() => {
    if (!students.length) return;
    api.get('/grades?subject=' + massarSubject + '&semester=' + massarSemester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades && s.grades[0];
        map[s.id] = g ? { devoir1:g.devoir1, devoir2:g.devoir2, exam:g.exam, average:g.average } : null;
      });
      setMassarGrades(map);
    });
  }, [massarSubject, massarSemester, students]);

  useEffect(() => {
    const loadAll = async () => {
      const map = {};
      for (const subj of SUBJECTS) {
        try {
          const r = await api.get('/grades?subject=' + subj + '&semester=1');
          r.data.forEach(s => {
            if (!map[s.id]) map[s.id] = {};
            if (s.grades && s.grades[0]) map[s.id][subj] = s.grades[0].average;
          });
        } catch {}
      }
      setAllGrades(map);
    };
    if (students.length) loadAll();
  }, [students]);

  useEffect(() => {
    const init = {};
    students.forEach(s => { init[s.id] = 'PRESENT'; });
    setAttendance(init);
  }, [students]);

  const setGradeField = (studentId, field, value) => {
    const updated = { ...grades, [studentId]: { ...grades[studentId], [field]: value } };
    const g = updated[studentId];
    const d1 = parseFloat(g.devoir1), d2 = parseFloat(g.devoir2), ex = parseFloat(g.exam);
    const vals = [isNaN(d1)?null:d1, isNaN(d2)?null:d2, isNaN(ex)?null:ex, isNaN(ex)?null:ex].filter(v => v !== null);
    updated[studentId].average = vals.length >= 3 ? +(vals.reduce((a,b) => a+b, 0) / 4).toFixed(2) : null;
    setGrades(updated);
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await Promise.all(students.map(s => {
        const g = grades[s.id];
        if (!g) return Promise.resolve();
        return api.post('/grades', { studentId:s.id, subject, semester,
          devoir1: g.devoir1!==''?+g.devoir1:null,
          devoir2: g.devoir2!==''?+g.devoir2:null,
          exam: g.exam!==''?+g.exam:null });
      }));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const cycle = (id) => {
    const order = ['PRESENT','ABSENT','RETARD'];
    const cur = order.indexOf(attendance[id] || 'PRESENT');
    setAttendance(prev => ({...prev, [id]: order[(cur+1)%3]}));
  };

  const savePresences = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({ studentId:s.id, status:attendance[s.id]||'PRESENT', date:new Date().toISOString().split('T')[0] }));
      await api.post('/attendance', { records });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const getAvg = (sid) => {
    const g = allGrades[sid] || {};
    const vals = Object.values(g).filter(v => v != null);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2) : null;
  };

  const getFilieres = (sid) => {
    const avg = parseFloat(getAvg(sid));
    if (!avg) return [];
    const g = allGrades[sid] || {};
    return FILIERES.filter(f => {
      if (avg < f.min) return false;
      const subAvgs = f.matieres.map(m => g[m]).filter(v => v != null);
      return subAvgs.length === 0 || (subAvgs.reduce((a,b)=>a+b,0)/subAvgs.length) >= f.min - 1;
    });
  };

  const exportMassar = () => {
    const lines = ['CODE_MASSAR;NOM;PRENOM;MATIERE;SEMESTRE;NOTE_DS1;NOTE_DS2;NOTE_EXAM;MOYENNE'];
    students.filter(s => /^[A-Z][0-9]{9}$/.test(s.massar)).forEach(s => {
      const g = massarGrades[s.id];
      lines.push([s.massar, s.lastName.toUpperCase(), s.firstName, massarSubject, massarSemester,
        g?.devoir1??'', g?.devoir2??'', g?.exam??'', g?.average??''].join(';'));
    });
    const blob = new Blob([lines.join('\r\n')], { type:'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Massar_' + massarSubject.replace(/ /g,'_') + '_S' + massarSemester + '.csv'; a.click();
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(String(text));
    setCopied(id); setTimeout(() => setCopied(null), 1500);
  };

  const STATUS = {
    PRESENT: { bg:'#EAF3DE', color:'#3B6D11', border:'#97C459', label:'Present' },
    ABSENT: { bg:'#FCEBEB', color:'#A32D2D', border:'#F09595', label:'Absent' },
    RETARD: { bg:'#FAEEDA', color:'#854F0B', border:'#FAC775', label:'Retard' },
  };

  const classAvg = (() => { const avgs = students.map(s=>grades[s.id]?.average).filter(a=>a!=null); return avgs.length?(avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(1):null; })();
  const lowGrades = students.filter(s => grades[s.id]?.average!=null && grades[s.id].average < 10);
  const absents = students.filter(s => attendance[s.id] === 'ABSENT');
  const retards = students.filter(s => attendance[s.id] === 'RETARD');

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
              <span style={{ fontSize:14 }}>{item.ic}</span><span style={{ flex:1 }}>{item.lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}>
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
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{MENUS.filter(m=>m.id).find(m=>m.id===page)?.lbl}</div>
            <div style={{ fontSize:11, color:'#888780' }}>{today}</div>
          </div>
          <div style={{ background:'#D1FAE5', color:'#065F46', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>Enseignant</div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>

          {page === 'dashboard' && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Bonjour, {user?.firstName} 👋</div>
                <div style={{ fontSize:13, color:'#888780' }}>Matiere : {subject} · Semestre {semester}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
                {[
                  { ic:'👥', lbl:'Mes eleves', val:students.length, color:'#065F46', bg:'#D1FAE5' },
                  { ic:'📊', lbl:'Moyenne classe', val:classAvg||'–', color:'#185FA5', bg:'#E6F1FB' },
                  { ic:'⚠️', lbl:'Eleves < 10', val:lowGrades.length, color:'#A32D2D', bg:'#FCEBEB' },
                  { ic:'📋', lbl:'Absents', val:absents.length, color:'#854F0B', bg:'#FAEEDA' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:17 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:11 }}>{m.ic}</div>
                    <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>{m.lbl}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              {lowGrades.length > 0 && (
                <div style={{ background:'linear-gradient(135deg, #064E3B 0%, #059669 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:28 }}>🤖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>Alerte IA — {lowGrades.length} eleve(s) en difficulte en {subject}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{lowGrades.map(s=>s.firstName).join(', ')}</div>
                  </div>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Eleves — {subject}</div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ background:'#F5F5F3' }}>
                        {['Eleve','Massar','Moy.','Mention'].map(h => (
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
                            <td style={{ padding:'10px 12px', fontWeight:700, color:g?.average?(g.average<10?'#A32D2D':'#3B6D11'):'#888780' }}>{g?.average??'–'}</td>
                            <td style={{ padding:'10px 12px' }}>
                              <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:g?.average?(g.average<10?'#FCEBEB':'#EAF3DE'):'#F5F5F3', color:mention.color }}>{mention.label}</span>
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
                      { ic:'📊', lbl:'Saisir notes', p:'notes', color:'#065F46', bg:'#D1FAE5' },
                      { ic:'✅', lbl:'Faire appel', p:'presences', color:'#185FA5', bg:'#E6F1FB' },
                      { ic:'📖', lbl:'Cahier de textes', p:'cahier', color:'#534AB7', bg:'#EEEDFE' },
                      { ic:'📝', lbl:'Programmer devoir', p:'devoirs', color:'#854F0B', bg:'#FAEEDA' },
                      { ic:'🎓', lbl:'Tawjih BAC', p:'tawjih', color:'#042C53', bg:'#E6F1FB' },
                      { ic:'🇲🇦', lbl:'Massar', p:'massar', color:'#A32D2D', bg:'#FCEBEB' },
                    ].map(a => (
                      <button key={a.p} onClick={() => setPage(a.p)}
                        style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:6 }}>
                        <span style={{ fontSize:14 }}>{a.ic}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                        <span style={{ color:a.color }}>→</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ background:'#064E3B', borderRadius:10, padding:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:8 }}>Matiere active</div>
                    <select value={subject} onChange={e => setSubject(e.target.value)}
                      style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'none', fontSize:12, fontWeight:700, background:'rgba(255,255,255,0.1)', color:'white', outline:'none', marginBottom:8 }}>
                      {SUBJECTS.map(s => <option key={s} style={{ color:'#042C53' }}>{s}</option>)}
                    </select>
                    <div style={{ display:'flex', gap:6 }}>
                      {[1,2].map(s => (
                        <button key={s} onClick={() => setSemester(s)}
                          style={{ flex:1, padding:'6px', borderRadius:7, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background:semester===s?'#EF9F27':'rgba(255,255,255,0.1)', color:semester===s?'#633806':'rgba(255,255,255,0.6)' }}>
                          S{s}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize:22, fontWeight:700, color:'white', marginTop:10 }}>{classAvg||'–'}<span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>/20</span></div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Moyenne classe</div>
                  </div>
                </div>
              </div>

              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#042C53' }}>📅 Calendrier scolaire 2025-2026 · MEN Maroc</div>
                  <span style={{ background:'#EAF3DE', color:'#3B6D11', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>Officiel</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {[
                    { ic:'🏫', lbl:'Rentree scolaire', date:'08 Sep 2025', color:'#3B6D11', bg:'#EAF3DE' },
                    { ic:'🌙', lbl:'1ere pause', date:'19-26 Oct 2025', color:'#185FA5', bg:'#E6F1FB' },
                    { ic:'🇲🇦', lbl:'Marche Verte', date:'06 Nov 2025', color:'#854F0B', bg:'#FAEEDA' },
                    { ic:'🇲🇦', lbl:'Fete Independance', date:'18 Nov 2025', color:'#854F0B', bg:'#FAEEDA' },
                    { ic:'❄️', lbl:'2eme pause', date:'07-14 Dec 2025', color:'#185FA5', bg:'#E6F1FB' },
                    { ic:'🇲🇦', lbl:'Manifeste Independance', date:'11 Jan 2026', color:'#854F0B', bg:'#FAEEDA' },
                    { ic:'📚', lbl:'Vacances mi-annee S1', date:'25 Jan-01 Fev 2026', color:'#534AB7', bg:'#EEEDFE' },
                    { ic:'🌸', lbl:'3eme pause', date:'15-22 Mars 2026', color:'#185FA5', bg:'#E6F1FB' },
                    { ic:'🇲🇦', lbl:'Fete du Travail', date:'01 Mai 2026', color:'#854F0B', bg:'#FAEEDA' },
                    { ic:'☀️', lbl:'4eme pause', date:'03-10 Mai 2026', color:'#185FA5', bg:'#E6F1FB' },
                    { ic:'🌙', lbl:'Aid Al-Adha', date:'27-29 Mai 2026', color:'#854F0B', bg:'#FAEEDA' },
                    { ic:'📝', lbl:'Examens BAC', date:'Juin 2026', color:'#A32D2D', bg:'#FCEBEB' },
                  ].map((ev,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', borderRadius:9, background:ev.bg, border:'1px solid '+ev.color+'33' }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{ev.ic}</span>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:ev.color, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.lbl}</div>
                        <div style={{ fontSize:10, color:'#888780', marginTop:1 }}>{ev.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'notes' && (
            <div>
              <div style={{ background:'#E6F1FB', border:'1px solid #B5D4F4', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#042C53' }}>
                <strong>Format MEN :</strong> Moyenne = (DS1 + DS2 + 2×Exam) / 4
              </div>
              <div style={{ display:'flex', gap:8, marginBottom:16, alignItems:'center' }}>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={semester} onChange={e => setSemester(+e.target.value)}
                  style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                  <option value={1}>Semestre 1</option>
                  <option value={2}>Semestre 2</option>
                </select>
                <button onClick={saveNotes} disabled={saving} style={{ marginLeft:'auto', background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {saving?'...':saved?'✓ Enregistre!':'Enregistrer'}
                </button>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 110px 120px', gap:8, padding:'10px 16px', background:'#042C53' }}>
                  {['Eleve','DS1 /20','DS2 /20','Exam /20','Moyenne','Mention'].map(h => (
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', textAlign:h==='Eleve'?'left':'center' }}>{h}</div>
                  ))}
                </div>
                {students.map(s => {
                  const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
                  const mention = getMention(g.average);
                  return (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 110px 120px', gap:8, padding:'10px 16px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          <div style={{ fontSize:10, color:'#888780', fontFamily:'monospace' }}>{s.massar}</div>
                        </div>
                      </div>
                      {['devoir1','devoir2','exam'].map(field => (
                        <input key={field} type="number" min="0" max="20" step="0.25"
                          value={g[field]} onChange={e => setGradeField(s.id, field, e.target.value)} placeholder="-"
                          style={{ textAlign:'center', padding:'7px', borderRadius:8, fontSize:13, outline:'none', width:'100%',
                            border:'1.5px solid '+(g[field]!==''&&+g[field]<10?'#F09595':'#E8E6E0'),
                            background:g[field]!==''&&+g[field]<10?'#FFF8F8':'white' }} />
                      ))}
                      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, padding:'7px', borderRadius:8,
                        background:g.average==null?'#F5F5F3':g.average<10?'#FCEBEB':g.average>=14?'#EAF3DE':'#E6F1FB', color:mention.color }}>
                        {g.average??'–'}
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
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Appel — {today}</div>
                <div style={{ fontSize:13, color:'#888780' }}>Cliquez pour changer: Present → Absent → Retard</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[
                  { lbl:'Presents', val:students.filter(s=>(attendance[s.id]||'PRESENT')==='PRESENT').length, color:'#3B6D11', bg:'#EAF3DE' },
                  { lbl:'Absents', val:absents.length, color:'#A32D2D', bg:'#FCEBEB' },
                  { lbl:'Retards', val:retards.length, color:'#854F0B', bg:'#FAEEDA' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:14, textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:700, color:m.color }}>{m.val}</div>
                    <div style={{ fontSize:11, color:'#888780', fontWeight:700, textTransform:'uppercase', marginTop:4 }}>{m.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8, marginBottom:12, justifyContent:'flex-end' }}>
                <button onClick={() => { const a={}; students.forEach(s=>a[s.id]='PRESENT'); setAttendance(a); }}
                  style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Tous presents
                </button>
                <button onClick={savePresences} disabled={saving}
                  style={{ background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {saving?'...':saved?'✓ Enregistre!':'Enregistrer l appel'}
                </button>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                {students.map(s => {
                  const cur = attendance[s.id] || 'PRESENT';
                  const st = STATUS[cur] || STATUS.PRESENT;
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
                        style={{ padding:'8px 22px', borderRadius:8, border:'1.5px solid '+st.border, cursor:'pointer', fontWeight:700, fontSize:12, background:st.bg, color:st.color, minWidth:110, transition:'all .15s' }}>
                        {st.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {page === 'cahier' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Cahier de textes</div>
                <div style={{ fontSize:13, color:'#888780' }}>Enregistrez vos lecons et le travail donne aux eleves</div>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Ajouter une seance</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Date</label>
                    <input type="date" value={newLecon.date} onChange={e => setNewLecon({...newLecon, date:e.target.value})}
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Matiere</label>
                    <select value={newLecon.matiere} onChange={e => setNewLecon({...newLecon, matiere:e.target.value})}
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Classe</label>
                    <input value={newLecon.classe} onChange={e => setNewLecon({...newLecon, classe:e.target.value})} placeholder="ex: 3eme Excellence"
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Titre de la lecon *</label>
                  <input value={newLecon.titre} onChange={e => setNewLecon({...newLecon, titre:e.target.value})} placeholder="ex: Les equations du second degre"
                    style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Contenu de la seance</label>
                    <textarea value={newLecon.contenu} onChange={e => setNewLecon({...newLecon, contenu:e.target.value})} rows={3}
                      placeholder="Objectifs et contenu enseigne..."
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', resize:'vertical' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Travail a faire</label>
                    <textarea value={newLecon.travail} onChange={e => setNewLecon({...newLecon, travail:e.target.value})} rows={3}
                      placeholder="Exercices, revisions, devoirs..."
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', resize:'vertical' }} />
                  </div>
                </div>
                <button onClick={() => {
                  if (!newLecon.titre) { alert('Entrez le titre de la lecon'); return; }
                  setCahier([{ ...newLecon, id: Date.now() }, ...cahier]);
                  setNewLecon({ date: new Date().toISOString().split('T')[0], matiere:'Mathematiques', classe:'', titre:'', contenu:'', travail:'' });
                }} style={{ background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Enregistrer la seance
                </button>
              </div>
              {cahier.length === 0 ? (
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:32, textAlign:'center', color:'#888780' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📖</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#042C53' }}>Cahier de textes vide</div>
                  <div style={{ fontSize:13 }}>Enregistrez votre premiere seance</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {cahier.map(l => (
                    <div key={l.id} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                        <div style={{ background:'#EEF2FF', color:'#4F46E5', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700 }}>{new Date(l.date).toLocaleDateString('fr-FR')}</div>
                        <div style={{ background:'#D1FAE5', color:'#065F46', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700 }}>{l.matiere}</div>
                        {l.classe && <div style={{ background:'#F5F5F3', color:'#888780', borderRadius:8, padding:'6px 12px', fontSize:11 }}>{l.classe}</div>}
                        <div style={{ flex:1 }}></div>
                        <button onClick={() => setCahier(cahier.filter(x => x.id !== l.id))}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#888780', fontSize:14 }}>✕</button>
                      </div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:6 }}>{l.titre}</div>
                      {l.contenu && <div style={{ fontSize:12, color:'#888780', marginBottom:6 }}>📚 {l.contenu}</div>}
                      {l.travail && <div style={{ fontSize:12, color:'#854F0B', background:'#FAEEDA', padding:'6px 10px', borderRadius:7 }}>📝 Travail : {l.travail}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === 'devoirs' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Devoirs et controles</div>
                <div style={{ fontSize:13, color:'#888780' }}>Programmez vos devoirs surveilles et travaux a rendre</div>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Programmer un devoir</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Matiere</label>
                    <select value={newDevoir.matiere} onChange={e => setNewDevoir({...newDevoir, matiere:e.target.value})}
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Classe</label>
                    <input value={newDevoir.classe} onChange={e => setNewDevoir({...newDevoir, classe:e.target.value})} placeholder="ex: 3eme Excellence"
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Date remise</label>
                    <input type="date" value={newDevoir.dateRemise} onChange={e => setNewDevoir({...newDevoir, dateRemise:e.target.value})}
                      style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Titre du devoir *</label>
                  <input value={newDevoir.titre} onChange={e => setNewDevoir({...newDevoir, titre:e.target.value})} placeholder="ex: DS1 - Equations et inequations"
                    style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Description / Chapitres concernes</label>
                  <textarea value={newDevoir.description} onChange={e => setNewDevoir({...newDevoir, description:e.target.value})} rows={2}
                    placeholder="Chapitres, exercices, documents..."
                    style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', resize:'vertical' }} />
                </div>
                <button onClick={() => {
                  if (!newDevoir.titre) { alert('Entrez le titre du devoir'); return; }
                  setDevoirs([{ ...newDevoir, id: Date.now(), done: false }, ...devoirs]);
                  setNewDevoir({ matiere:'Mathematiques', classe:'', titre:'', dateRemise:'', description:'' });
                }} style={{ background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'10px 22px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Programmer le devoir
                </button>
              </div>
              {devoirs.length === 0 ? (
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:32, textAlign:'center', color:'#888780' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📝</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#042C53' }}>Aucun devoir programme</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {devoirs.map(d => (
                    <div key={d.id} style={{ background:'white', borderRadius:10, border:'1px solid '+(d.done?'#97C459':'#E8E6E0'), padding:16, opacity:d.done?0.7:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <input type="checkbox" checked={d.done} onChange={() => setDevoirs(devoirs.map(x => x.id===d.id?{...x,done:!x.done}:x))}
                          style={{ width:18, height:18, accentColor:'#064E3B', cursor:'pointer' }} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <span style={{ background:'#D1FAE5', color:'#065F46', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{d.matiere}</span>
                            {d.classe && <span style={{ background:'#F5F5F3', color:'#888780', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{d.classe}</span>}
                            {d.dateRemise && <span style={{ background:'#FEF3C7', color:'#D97706', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>📅 {new Date(d.dateRemise).toLocaleDateString('fr-FR')}</span>}
                          </div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#042C53', textDecoration:d.done?'line-through':'none' }}>{d.titre}</div>
                          {d.description && <div style={{ fontSize:12, color:'#888780', marginTop:3 }}>{d.description}</div>}
                        </div>
                        <button onClick={() => setDevoirs(devoirs.filter(x => x.id !== d.id))}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#888780' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === 'eleves' && (
            <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#064E3B' }}>
                    {['Eleve','Code Massar','Moy. '+subject,'Mention','Filiere BAC'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const g = grades[s.id];
                    const mention = getMention(g?.average);
                    const filieres = getFilieres(s.id);
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
                        <td style={{ padding:'11px 12px', fontWeight:700, color:g?.average?(g.average<10?'#A32D2D':'#3B6D11'):'#888780' }}>{g?.average??'–'}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:g?.average?(g.average<10?'#FCEBEB':'#EAF3DE'):'#F5F5F3', color:mention.color }}>{mention.label}</span>
                        </td>
                        <td style={{ padding:'11px 12px' }}>
                          {filieres.length > 0 ? (
                            <div style={{ display:'flex', gap:4 }}>
                              {filieres.slice(0,2).map((f,i) => (
                                <span key={f.id} style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:i===0?f.color:f.bg, color:i===0?'white':f.color }}>
                                  {f.icon} {f.id}
                                </span>
                              ))}
                            </div>
                          ) : <span style={{ fontSize:11, color:'#888780' }}>–</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {page === 'tawjih' && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Tawjih — Filieres BAC Maroc</div>
                <div style={{ fontSize:13, color:'#888780' }}>SM · PC · SVT · ECO · LSH — Recommandations basees sur les notes</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:18 }}>
                {FILIERES.map(f => (
                  <div key={f.id} style={{ background:'white', borderRadius:9, border:'1px solid '+f.color+'33', padding:'12px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:22 }}>{f.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:f.color, marginTop:4 }}>{f.id}</div>
                    <div style={{ fontSize:10, color:'#888780', marginTop:2, lineHeight:1.3 }}>{f.lbl}</div>
                    <div style={{ fontSize:9, color:f.color, marginTop:4, fontWeight:700 }}>Min: {f.min}/20</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {students.map(s => {
                  const avg = getAvg(s.id);
                  const filieres = getFilieres(s.id);
                  const g = allGrades[s.id] || {};
                  return (
                    <div key={s.id} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                        <div style={{ width:42, height:42, borderRadius:10, background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:'#042C53' }}>{s.firstName} {s.lastName}</div>
                          <div style={{ fontSize:11, color:'#888780' }}>{s.massar}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:26, fontWeight:700, color:!avg?'#888780':parseFloat(avg)<10?'#A32D2D':parseFloat(avg)>=14?'#3B6D11':'#854F0B' }}>{avg||'–'}</div>
                          <div style={{ fontSize:10, color:'#888780' }}>Moy. generale</div>
                        </div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:12 }}>
                        {['Mathematiques','Physique-Chimie','SVT','Francais','Arabe'].map(subj => (
                          <div key={subj} style={{ background:'#F5F5F3', borderRadius:7, padding:'6px 8px', textAlign:'center' }}>
                            <div style={{ fontSize:8, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{subj.slice(0,6)}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:!g[subj]?'#888780':g[subj]<10?'#A32D2D':'#3B6D11' }}>{g[subj]||'–'}</div>
                          </div>
                        ))}
                      </div>
                      {filieres.length === 0 ? (
                        <div style={{ background:'#FCEBEB', borderRadius:8, padding:'9px 14px', fontSize:12, color:'#A32D2D', fontWeight:700 }}>
                          Moyenne insuffisante — soutien scolaire recommande
                        </div>
                      ) : (
                        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                          {filieres.map((f,i) => (
                            <div key={f.id} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:20, background:i===0?f.color:f.bg, color:i===0?'white':f.color, border:i===0?'none':'1px solid '+f.color+'44' }}>
                              {i===0&&<span>⭐</span>}
                              <span style={{ fontSize:11, fontWeight:700 }}>{f.icon} {f.id} — {f.lbl}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {page === 'massar' && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Saisie Massar</div>
                <div style={{ fontSize:13, color:'#888780' }}>Exportez les notes au format CSV pour Massar Moudaris</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
                <div style={{ background:'linear-gradient(135deg, #042C53 0%, #185FA5 100%)', borderRadius:10, padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:8 }}>Ouvrir Massar Moudaris</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:12 }}>Connectez-vous avec @taalim.ma</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <a href="https://massar.men.gov.ma/Account" target="_blank" rel="noreferrer"
                      style={{ background:'white', color:'#042C53', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                      🖥️ massar.men.gov.ma
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=ma.gov.men.massar.professeur" target="_blank" rel="noreferrer"
                      style={{ background:'#EF9F27', color:'#633806', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                      📱 App Moudaris
                    </a>
                  </div>
                </div>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:12 }}>Matiere et Semestre</div>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <select value={massarSubject} onChange={e => setMassarSubject(e.target.value)}
                      style={{ flex:1, padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select value={massarSemester} onChange={e => setMassarSemester(+e.target.value)}
                      style={{ padding:'9px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      <option value={1}>S1</option><option value={2}>S2</option>
                    </select>
                  </div>
                  <button onClick={exportMassar}
                    style={{ width:'100%', background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                    📥 Telecharger CSV Massar
                  </button>
                </div>
              </div>
              <div style={{ background:'#EAF3DE', border:'1px solid #97C459', borderRadius:10, padding:'12px 16px', marginBottom:14, fontSize:12, color:'#3B6D11' }}>
                <strong>Comment :</strong> Telechargez le CSV → massar.men.gov.ma → Saisie des notes → Importez le fichier
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', overflow:'hidden' }}>
                <div style={{ padding:'12px 16px', background:'#042C53' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'white' }}>Notes {massarSubject} — S{massarSemester} · Codes Massar</div>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#F5F5F3' }}>
                      {['Code Massar','Eleve','DS1','DS2','Exam','Moyenne','Statut'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => {
                      const g = massarGrades[s.id];
                      const valid = /^[A-Z][0-9]{9}$/.test(s.massar);
                      return (
                        <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3', background:!valid?'#FFF8F8':'white' }}>
                          <td style={{ padding:'11px 12px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, color:valid?'#042C53':'#A32D2D' }}>{s.massar}</span>
                              {valid && <button onClick={() => copy(s.massar, 'm'+s.id)} style={{ background:copied==='m'+s.id?'#EAF3DE':'#F5F5F3', border:'none', borderRadius:5, padding:'2px 6px', fontSize:10, cursor:'pointer' }}>{copied==='m'+s.id?'✓':'📋'}</button>}
                            </div>
                          </td>
                          <td style={{ padding:'11px 12px', fontWeight:700 }}>{s.firstName} {s.lastName}</td>
                          {['devoir1','devoir2','exam'].map(f => (
                            <td key={f} style={{ padding:'11px 12px' }}>
                              {g&&g[f]!=null ? (
                                <button onClick={() => copy(g[f], f+s.id)} style={{ background:copied===f+s.id?'#EAF3DE':'#F5F5F3', border:'1px solid '+(copied===f+s.id?'#97C459':'#E8E6E0'), borderRadius:7, padding:'5px 12px', fontSize:13, fontWeight:700, cursor:'pointer', color:g[f]<10?'#A32D2D':'#3B6D11' }}>
                                  {copied===f+s.id?'✓':g[f]}
                                </button>
                              ) : <span style={{ color:'#C8C5BE' }}>–</span>}
                            </td>
                          ))}
                          <td style={{ padding:'11px 12px' }}>
                            {g?.average!=null ? (
                              <button onClick={() => copy(g.average, 'av'+s.id)} style={{ background:copied==='av'+s.id?'#042C53':'#E6F1FB', border:'none', borderRadius:7, padding:'5px 12px', fontSize:14, fontWeight:700, cursor:'pointer', color:copied==='av'+s.id?'white':g.average<10?'#A32D2D':'#3B6D11' }}>
                                {copied==='av'+s.id?'✓':g.average}
                              </button>
                            ) : <span style={{ color:'#C8C5BE' }}>–</span>}
                          </td>
                          <td style={{ padding:'11px 12px' }}>
                            {!valid?<span style={{ background:'#FCEBEB', color:'#A32D2D', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Code invalide</span>
                            :!g?<span style={{ background:'#FAEEDA', color:'#854F0B', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Sans notes</span>
                            :<span style={{ background:'#EAF3DE', color:'#3B6D11', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>✓ Pret</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {page === 'planning' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Mon emploi du temps</div>
                <div style={{ fontSize:13, color:'#888780' }}>Configurez vos heures de cours par jour</div>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Ajouter un cours</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Jour</label>
                    <select value={newCours.jour} onChange={e => setNewCours({...newCours, jour:e.target.value})}
                      style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:12, outline:'none' }}>
                      {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map(j => <option key={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Heure</label>
                    <select value={newCours.heure} onChange={e => setNewCours({...newCours, heure:e.target.value})}
                      style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:12, outline:'none' }}>
                      {['08h-09h','09h-10h','10h-11h','11h-12h','14h-15h','15h-16h','16h-17h'].map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Matiere</label>
                    <select value={newCours.matiere} onChange={e => setNewCours({...newCours, matiere:e.target.value})}
                      style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:12, outline:'none' }}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Classe</label>
                    <input value={newCours.classe} onChange={e => setNewCours({...newCours, classe:e.target.value})}
                      placeholder="ex: 3eme Exc" style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:12, outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Salle</label>
                    <input value={newCours.salle} onChange={e => setNewCours({...newCours, salle:e.target.value})}
                      placeholder="ex: Salle 3" style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:12, outline:'none' }} />
                  </div>
                </div>
                <button onClick={() => {
                  if (!newCours.classe) { alert('Entrez la classe'); return; }
                  const key = newCours.jour + '_' + newCours.heure;
                  setPlanning(prev => ({...prev, [key]: newCours}));
                  setNewCours({ jour:'Lundi', heure:'08h-09h', matiere:'Mathematiques', classe:'', salle:'' });
                }} style={{ background:'#064E3B', color:'white', border:'none', borderRadius:8, padding:'9px 20px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Ajouter au planning
                </button>
              </div>

              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', overflow:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                  <thead>
                    <tr style={{ background:'#064E3B' }}>
                      <th style={{ padding:'10px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', width:90 }}>Heure</th>
                      {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map(j => (
                        <th key={j} style={{ padding:'10px 12px', textAlign:'center', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>{j}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['08h-09h','09h-10h','10h-11h','11h-12h','14h-15h','15h-16h','16h-17h'].map(h => (
                      <tr key={h} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:'#888780', background:'#F8FAFC' }}>{h}</td>
                        {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'].map(j => {
                          const key = j + '_' + h;
                          const cours = planning[key];
                          return (
                            <td key={j} style={{ padding:'6px', textAlign:'center' }}>
                              {cours ? (
                                <div style={{ background:'#D1FAE5', borderRadius:8, padding:'6px 8px', position:'relative' }}>
                                  <div style={{ fontSize:11, fontWeight:700, color:'#065F46' }}>{cours.matiere.slice(0,6)}</div>
                                  <div style={{ fontSize:10, color:'#888780' }}>{cours.classe}</div>
                                  {cours.salle && <div style={{ fontSize:9, color:'#888780' }}>{cours.salle}</div>}
                                  <button onClick={() => {
                                    const p = {...planning};
                                    delete p[key];
                                    setPlanning(p);
                                  }} style={{ position:'absolute', top:2, right:2, background:'none', border:'none', cursor:'pointer', color:'#888780', fontSize:10 }}>✕</button>
                                </div>
                              ) : (
                                <div style={{ height:48, borderRadius:8, border:'1px dashed #E8E6E0' }}></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'classes' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:2 }}>Mes classes</div>
                <div style={{ fontSize:13, color:'#888780' }}>Classes assignees · {students.length} eleves au total</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[
                  { ic:'👥', lbl:'Total eleves', val:students.length, color:'#065F46', bg:'#D1FAE5' },
                  { ic:'📊', lbl:'Moyenne generale', val:classAvg||'–', color:'#185FA5', bg:'#E6F1FB' },
                  { ic:'⚠️', lbl:'Eleves < 10', val:lowGrades.length, color:'#A32D2D', bg:'#FCEBEB' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:10 }}>{m.ic}</div>
                    <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{m.lbl}</div>
                    <div style={{ fontSize:24, fontWeight:700, color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Liste des eleves</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#064E3B' }}>
                      {['Eleve','Code Massar','Moy. '+subject,'Mention','Filiere'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => {
                      const g = grades[s.id];
                      const mention = getMention(g?.average);
                      const filieres = getFilieres(s.id);
                      return (
                        <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                          <td style={{ padding:'11px 12px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:32, height:32, borderRadius:'50%', background:'#D1FAE5', color:'#065F46', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                                {s.firstName[0]}{s.lastName[0]}
                              </div>
                              <div>
                                <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                                <div style={{ fontSize:11, color:'#888780' }}>{s.parentPhone || 'Pas de tel'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                          <td style={{ padding:'11px 12px', fontWeight:700, color:g?.average?(g.average<10?'#A32D2D':'#3B6D11'):'#888780' }}>{g?.average??'–'}</td>
                          <td style={{ padding:'11px 12px' }}>
                            <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:g?.average?(g.average<10?'#FCEBEB':'#EAF3DE'):'#F5F5F3', color:mention.color }}>{mention.label}</span>
                          </td>
                          <td style={{ padding:'11px 12px' }}>
                            {filieres.length > 0 ? (
                              <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:filieres[0].bg, color:filieres[0].color }}>
                                {filieres[0].icon} {filieres[0].id}
                              </span>
                            ) : <span style={{ fontSize:11, color:'#888780' }}>–</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
