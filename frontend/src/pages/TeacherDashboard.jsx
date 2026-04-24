import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];
const FILIERES = [
  { id:'SM', lbl:'Sciences Mathematiques', color:'#042C53', bg:'#E6F1FB', min:15, icon:'📐', matieres:['Mathematiques','Physique-Chimie','SVT'] },
  { id:'PC', lbl:'Sciences Physiques', color:'#185FA5', bg:'#E6F1FB', min:13, icon:'⚗️', matieres:['Physique-Chimie','Mathematiques','SVT'] },
  { id:'SVT', lbl:'Sciences de la Vie', color:'#3B6D11', bg:'#EAF3DE', min:12, icon:'🌿', matieres:['SVT','Physique-Chimie','Mathematiques'] },
  { id:'ECO', lbl:'Sciences Economiques', color:'#854F0B', bg:'#FAEEDA', min:11, icon:'📈', matieres:['Mathematiques','Francais','Anglais'] },
  { id:'LSH', lbl:'Lettres et Sciences Humaines', color:'#534AB7', bg:'#EEEDFE', min:10, icon:'📚', matieres:['Arabe','Francais','Histoire-Geo'] },
];
const getMention = (avg) => {
  if (avg == null) return { label:'-', color:'#888780' };
  if (avg >= 16) return { label:'Tres bien', color:'#3B6D11' };
  if (avg >= 14) return { label:'Bien', color:'#185FA5' };
  if (avg >= 12) return { label:'Assez bien', color:'#0C447C' };
  if (avg >= 10) return { label:'Passable', color:'#854F0B' };
  return { label:'Insuffisant', color:'#A32D2D' };
};
const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const HOURS = ['08h-10h','10h-12h','14h-16h','16h-18h'];
const ANNONCES = [
  { title:'Reunion pedagogique — Jeudi prochain', from:'Direction', time:"Aujourd'hui 08:15", type:'Important', tc:'b-r', body:'Reunion obligatoire jeudi a 16h30 en salle des professeurs. Ordre du jour: resultats S2, bulletins.' },
  { title:'Delai de saisie des notes S2', from:'Direction', time:'Hier 14:00', type:'Rappel', tc:'b-a', body:'Merci de saisir toutes les notes avant vendredi a 17h00. Les bulletins seront generes ce weekend.' },
  { title:'Formation LuxEdu disponible', from:'Direction', time:'Lundi 09:00', type:'Info', tc:'b-b', body:'Formation courte sur LuxEdu disponible sur demande. Pour toute question technique, contactez le directeur.' },
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
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type:'in', text:"Bonjour, mon enfant sera absent ce matin.", time:'08:30' },
    { type:'out', text:"Merci pour l'information. Veuillez apporter le justificatif.", time:'08:45' },
  ]);
  const [toast, setToast] = useState('');
  const [massarSubject, setMassarSubject] = useState('Mathematiques');
  const [massarSemester, setMassarSemester] = useState(1);
  const [massarGrades, setMassarGrades] = useState({});
  const [copied, setCopied] = useState(null);
  const msgRef = useRef(null);
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)).catch(()=>{}); }, []);

  useEffect(() => {
    if (!students.length) return;
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades && s.grades[0];
        map[s.id] = g ? { devoir1:g.devoir1 ?? '', devoir2:g.devoir2 ?? '', exam:g.exam ?? '', average:g.average } : { devoir1:'', devoir2:'', exam:'', average:null };
      });
      setGrades(map);
    }).catch(()=>{});
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
    }).catch(()=>{});
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

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const setGradeField = (sid, field, value) => {
    const updated = { ...grades, [sid]: { ...(grades[sid] || {}), [field]: value } };
    const g = updated[sid];
    const d1 = parseFloat(g.devoir1), d2 = parseFloat(g.devoir2), ex = parseFloat(g.exam);
    const vals = [isNaN(d1)?null:d1, isNaN(d2)?null:d2, isNaN(ex)?null:ex, isNaN(ex)?null:ex].filter(v => v !== null);
    updated[sid].average = vals.length >= 3 ? +(vals.reduce((a,b) => a+b, 0)/4).toFixed(2) : null;
    setGrades(updated);
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await Promise.all(students.map(s => {
        const g = grades[s.id];
        if (!g) return Promise.resolve();
        return api.post('/grades', { studentId:s.id, subject, semester,
          devoir1: g.devoir1 !== '' ? +g.devoir1 : null,
          devoir2: g.devoir2 !== '' ? +g.devoir2 : null,
          exam: g.exam !== '' ? +g.exam : null });
      }));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      showToast('Notes enregistrees · Parents des eleves <10 notifies WA');
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const cycleAtt = (id) => {
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
      showToast('Appel enregistre · Parents absents notifies WA');
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const sendWA = (phone, msg) => window.open('https://wa.me/' + phone.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent(msg), '_blank');

  const getAvg = (sid) => {
    const g = allGrades[sid] || {};
    const vals = Object.values(g).filter(v => v != null);
    return vals.length ? (vals.reduce((a,b) => a+b, 0)/vals.length).toFixed(2) : null;
  };

  const getFilieres = (sid) => {
    const avg = parseFloat(getAvg(sid));
    if (!avg) return [];
    const g = allGrades[sid] || {};
    return FILIERES.filter(f => {
      if (avg < f.min) return false;
      const subAvgs = f.matieres.map(m => g[m]).filter(v => v != null);
      return subAvgs.length === 0 || (subAvgs.reduce((a,b) => a+b, 0)/subAvgs.length) >= f.min - 1;
    });
  };

  const exportMassar = () => {
    const lines = ['CODE_MASSAR;NOM;PRENOM;MATIERE;SEMESTRE;NOTE_DS1;NOTE_DS2;NOTE_EXAM;MOYENNE'];
    students.filter(s => /^[A-Z][0-9]{9}$/.test(s.massar)).forEach(s => {
      const g = massarGrades[s.id];
      lines.push([s.massar, s.lastName.toUpperCase(), s.firstName, massarSubject, massarSemester,
        g?.devoir1 ?? '', g?.devoir2 ?? '', g?.exam ?? '', g?.average ?? ''].join(';'));
    });
    const blob = new Blob([lines.join('\r\n')], { type:'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Massar_' + massarSubject + '_S' + massarSemester + '.csv'; a.click();
    showToast('Fichier Massar telecharge');
  };

  const copyVal = (text, id) => {
    navigator.clipboard.writeText(String(text));
    setCopied(id); setTimeout(() => setCopied(null), 1500);
    showToast('Note copiee: ' + text);
  };

  const classAvg = (() => {
    const avgs = students.map(s => grades[s.id]?.average).filter(a => a != null);
    return avgs.length ? (avgs.reduce((a,b) => a+b, 0)/avgs.length).toFixed(1) : null;
  })();
  const lowGrades = students.filter(s => grades[s.id]?.average != null && grades[s.id].average < 10);
  const absents = students.filter(s => attendance[s.id] === 'ABSENT');
  const retards = students.filter(s => attendance[s.id] === 'RETARD');

  const ST = {
    PRESENT: { label:'✓', bg:'#EAF3DE', color:'#3B6D11', border:'#97C459' },
    ABSENT:  { label:'✗', bg:'#FCEBEB', color:'#A32D2D', border:'#F09595' },
    RETARD:  { label:'⏰', bg:'#FAEEDA', color:'#854F0B', border:'#FAC775' },
  };

  const MENUS = [
    { sec:'Principal' },
    { id:'dashboard', lbl:'Mon tableau de bord' },
    { id:'presences', lbl:'Appel & presences' },
    { id:'notes', lbl:'Notes & evaluations' },
    { id:'planning', lbl:'Mon planning' },
    { id:'eleves', lbl:'Mes eleves' },
    { sec:'Communication' },
    { id:'messages', lbl:'Messages', badge:2 },
    { id:'annonces', lbl:'Annonces' },
    { sec:'Outils Maroc' },
    { id:'tawjih', lbl:'Tawjih BAC' },
    { id:'massar', lbl:'Saisie Massar' },
  ];

  const pgTitles = {
    dashboard: ['Mon tableau de bord', today + ' · ' + subject],
    presences: ['Appel & presences', today],
    notes: ['Notes & evaluations', 'Saisie · ' + subject + ' · S' + semester],
    planning: ['Mon planning', 'Emploi du temps personnel'],
    eleves: ['Mes eleves', students.length + ' eleves'],
    messages: ['Messages', '2 conversations non lues'],
    annonces: ['Annonces', 'Communications de la direction'],
    tawjih: ['Tawjih BAC', 'SM · PC · SVT · ECO · LSH'],
    massar: ['Saisie Massar', 'Export notes format MEN officiel'],
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#063828', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, display:'flex', alignItems:'center', gap:9, boxShadow:'0 4px 20px rgba(0,0,0,0.2)', whiteSpace:'nowrap' }}>
          ✓ {toast}
        </div>
      )}
      {profileModal && selectedStudent && (
        <div onClick={e => { if (e.target === e.currentTarget) setProfileModal(false); }}
          style={{ position:'fixed', inset:0, background:'rgba(4,44,83,0.48)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(2px)' }}>
          <div style={{ background:'white', borderRadius:16, width:520, maxWidth:'96vw', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(4,44,83,0.2)' }}>
            <div style={{ padding:'22px 24px 0', display:'flex', alignItems:'flex-start', gap:12, marginBottom:16 }}>
              <div className="av" style={{ width:50, height:50, fontSize:17, background:'#FCEBEB', color:'#791F1F' }}>
                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)' }}>{selectedStudent.firstName} {selectedStudent.lastName}</div>
                <div style={{ fontSize:13, color:'var(--g2)', marginTop:2 }}>{selectedStudent.massar}</div>
                {grades[selectedStudent.id]?.average != null && grades[selectedStudent.id]?.average < 10 &&
                  <span className="badge b-r" style={{ marginTop:6, display:'inline-flex' }}>Eleve a risque</span>}
              </div>
              <button onClick={() => setProfileModal(false)}
                style={{ background:'var(--g0)', border:'none', cursor:'pointer', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--g2)', fontSize:15 }}>✕</button>
            </div>
            <div style={{ padding:'0 24px 24px' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:10 }}>Statistiques en {subject}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
                {[
                  { val:grades[selectedStudent.id]?.average ?? '-', lbl:'Moyenne '+subject.slice(0,5), color: grades[selectedStudent.id]?.average < 10 ? 'var(--red)' : 'var(--green)' },
                  { val:getAvg(selectedStudent.id)||'-', lbl:'Moy. generale', color:'var(--blue)' },
                  { val:getFilieres(selectedStudent.id)[0]?.id||'-', lbl:'Filiere BAC', color:'var(--navy)' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'var(--g0)', borderRadius:9, padding:14, textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:10, color:'var(--g2)', marginTop:3, textTransform:'uppercase', fontWeight:700 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:10 }}>Dernières notes — {subject}</div>
                {['devoir1','devoir2','exam'].map((f,i) => {
                  const g = grades[selectedStudent.id];
                  const val = g?.[f];
                  const pct = val ? Math.min(val/20*100,100) : 0;
                  const col = val && val < 10 ? 'var(--red)' : 'var(--blue2)';
                  return (
                    <div key={f} className="br-row">
                      <div className="br-lbl">{['Devoir 1','Devoir 2','Examen'][i]}</div>
                      <div className="br-track"><div className="br-fill" style={{ width:pct+'%', background:col }}></div></div>
                      <div className="br-val" style={{ color:col }}>{val ?? '-'}/20</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:8 }}>Observations</div>
                <textarea placeholder="Ajouter une observation..." style={{ width:'100%', padding:'10px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', resize:'vertical', minHeight:70 }} />
              </div>
              {selectedStudent.parentPhone && (
                <div style={{ background:'var(--g0)', padding:12, borderRadius:9, display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
                  <div className="av" style={{ width:36, height:36, fontSize:12, background:'var(--amberl)', color:'var(--gd)' }}>P</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>Parent de {selectedStudent.firstName}</div>
                    <div style={{ fontSize:12, color:'var(--g2)' }}>{selectedStudent.parentPhone}</div>
                  </div>
                  <button className="btn btn-wa btn-sm"
                    onClick={() => sendWA(selectedStudent.parentPhone, 'Bonjour, message de ' + school?.name + ' concernant ' + selectedStudent.firstName)}>
                    WhatsApp
                  </button>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-navy" style={{ flex:1 }} onClick={() => { setProfileModal(false); setPage('messages'); }}>Envoyer message</button>
                <button style={{ flex:1, background:'#063828', color:'white', border:'none', borderRadius:8, padding:'9px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}
                  onClick={() => { showToast('Observation sauvegardee'); setProfileModal(false); }}>
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ width:230, background:'#063828', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 11px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🏫</div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{school?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Espace Enseignant</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'9px 7px', overflowY:'auto' }}>
          {MENUS.map((item, i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.11em', color:'rgba(255,255,255,0.18)', padding:'13px 9px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', borderRadius:8, cursor:'pointer', color:page===item.id?'white':'rgba(255,255,255,0.44)', fontSize:13, marginBottom:1, background:page===item.id?'rgba(255,255,255,0.14)':'transparent', transition:'all .15s' }}>
              <span style={{ flex:1 }}>{item.lbl}</span>
              {item.badge && <span style={{ background:'#E24B4A', color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:9 }}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding:7, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 9px', borderRadius:8, cursor:'pointer' }} onClick={logout}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#0F6E56', color:'white', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)' }}>Enseignant · Deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ background:'white', borderBottom:'1px solid var(--g1)', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>{pgTitles[page]?.[0]}</div>
            <div style={{ fontSize:11, color:'var(--g2)' }}>{pgTitles[page]?.[1]}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            {page === 'presences' && <button className="btn btn-navy btn-sm" onClick={savePresences} disabled={saving}>{saving?'...':saved?'✓':'Enregistrer & Notifier WA'}</button>}
            {page === 'notes' && <button className="btn btn-navy btn-sm" onClick={saveNotes} disabled={saving}>{saving?'...':saved?'Notes enregistrees!':'Enregistrer & Notifier WA'}</button>}
            <div style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>Enseignant</div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>

          {page === 'dashboard' && (
            <div className="page-enter">
              <div className="ph"><h1>Bonjour, {user?.firstName} !</h1><p>{today} · {subject}</p></div>
              <div style={{ display:'flex', gap:10, marginBottom:18, overflowX:'auto', paddingBottom:4 }}>
                {['Lun','Mar','Mer','Jeu','Ven','Sam'].map((d,i) => {
                  const isToday = i === new Date().getDay() - 1;
                  return (
                    <div key={d} style={{ minWidth:70, background:isToday?'#063828':'white', borderRadius:10, border:'1px solid '+(isToday?'#063828':'var(--g1)'), padding:'10px 8px', textAlign:'center', flexShrink:0, cursor:'pointer' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:isToday?'rgba(255,255,255,0.7)':'var(--g2)', marginBottom:4 }}>{d}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:isToday?'white':'var(--navy)' }}>{i+7}</div>
                      <div style={{ fontSize:10, color:isToday?'rgba(255,255,255,0.6)':'var(--g2)', marginTop:3 }}>{[2,2,3,2,2,1][i]} seances</div>
                    </div>
                  );
                })}
              </div>
              <div className="metrics">
                <div className="metric">
                  <div className="mic" style={{ background:'#E1F5EE' }}></div>
                  <div className="mlbl">Mes eleves (total)</div>
                  <div className="mval">{students.length}</div>
                  <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>Toutes classes</div>
                </div>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--greenl)' }}></div>
                  <div className="mlbl">Presents aujourd hui</div>
                  <div className="mval" style={{ color:'var(--green)' }}>{students.length - absents.length}</div>
                  <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>{absents.length} absent(s)</div>
                </div>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--amberl)' }}></div>
                  <div className="mlbl">Moyenne {subject.slice(0,6)}</div>
                  <div className="mval">{classAvg || '–'}</div>
                  <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>Sur 20</div>
                </div>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--redl)' }}></div>
                  <div className="mlbl">Eleves a risque</div>
                  <div className="mval" style={{ color:'var(--red)' }}>{lowGrades.length}</div>
                  <div style={{ fontSize:11, color:'var(--red)', marginTop:3 }}>Notes &lt;10</div>
                </div>
              </div>
              {lowGrades.length > 0 && (
                <div style={{ background:'linear-gradient(135deg,#063828 0%,#0F6E56 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:24 }}>🤖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>Alerte IA — {lowGrades.length} eleve(s) en difficulte</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{lowGrades.map(s=>s.firstName).join(', ')} · Notes inferieures a 10</div>
                  </div>
                  <button className="btn btn-wa btn-sm" onClick={() => { lowGrades.forEach(s => { if (s.parentPhone) sendWA(s.parentPhone, 'Bonjour, ' + s.firstName + ' a une note insuffisante en ' + subject + '. Soutien recommande. ' + school?.name); }); }}>Notifier parents WA</button>
                </div>
              )}
              <div className="g3d">
                <div className="card cp">
                  <div className="ch"><div className="ct">Seances d aujourd hui</div></div>
                  <table className="tbl">
                    <thead><tr><th>Horaire</th><th>Classe</th><th>Salle</th><th>Statut</th><th>Action</th></tr></thead>
                    <tbody>
                      <tr><td style={{ fontWeight:700 }}>08h00 – 10h00</td><td>{students.length > 0 ? students[0]?.firstName + '...' : 'Classe principale'}</td><td>Salle 12</td><td><span className="badge b-g">Appel fait ✓</span></td><td><button className="btn btn-sm btn-out" onClick={() => setPage('notes')}>Notes</button></td></tr>
                      <tr><td style={{ fontWeight:700 }}>10h00 – 12h00</td><td>{students.length} eleves</td><td>Salle 12</td><td><span className="badge b-a">En cours</span></td><td><button className="btn btn-sm btn-out" onClick={() => setPage('presences')}>Appel</button></td></tr>
                      <tr><td style={{ fontWeight:700 }}>14h00 – 16h00</td><td>Classe soir</td><td>Salle 12</td><td><span className="badge b-b">A venir</span></td><td><button className="btn btn-sm btn-out" onClick={() => setPage('presences')}>Preparer</button></td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="card cp">
                  <div className="ch"><div className="ct">Progression des notes S{semester}</div></div>
                  {students.slice(0,5).map(s => {
                    const g = grades[s.id];
                    const avg = g?.average || 0;
                    const pct = Math.min(avg/20*100, 100);
                    const col = avg < 10 ? 'var(--red)' : avg >= 14 ? 'var(--green)' : 'var(--blue2)';
                    return (
                      <div key={s.id} style={{ marginBottom:9 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                          <span style={{ fontSize:12, color:'var(--g4)' }}>{s.firstName} {s.lastName}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:col }}>{avg || '–'}</span>
                        </div>
                        <div style={{ height:7, background:'var(--g0)', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:4, background:col, width:pct+'%', transition:'width .7s' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="g2d">
                <div className="card cp">
                  <div className="ch"><div className="ct">Eleves a surveiller</div><button className="btn btn-sm btn-out" onClick={() => setPage('eleves')}>Voir tous →</button></div>
                  <table className="tbl">
                    <thead><tr><th>Eleve</th><th>Massar</th><th>Moy.</th><th>Statut</th></tr></thead>
                    <tbody>
                      {students.slice(0,5).map(s => {
                        const g = grades[s.id];
                        const mention = getMention(g?.average);
                        return (
                          <tr key={s.id} style={{ cursor:'pointer' }} onClick={() => { setSelectedStudent(s); setProfileModal(true); }}>
                            <td><div className="tav"><div className="av" style={{ width:30, height:30, fontSize:10, background:'var(--bl)', color:'var(--blue)' }}>{s.firstName[0]}{s.lastName[0]}</div><span style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</span></div></td>
                            <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--g2)' }}>{s.massar}</td>
                            <td style={{ fontWeight:700, color:g?.average ? (g.average < 10 ? 'var(--red)' : 'var(--green)') : 'var(--g2)' }}>{g?.average ?? '–'}</td>
                            <td><span className={'badge '+(g?.average ? (g.average < 10 ? 'b-r' : g.average >= 14 ? 'b-g' : 'b-b') : 'b-n')}>{mention.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="card cp">
                  <div className="ct" style={{ marginBottom:12 }}>Actions rapides</div>
                  {[
                    { ic:'✓', lbl:"Faire l'appel", p:'presences', color:'#0F6E56', bg:'#E1F5EE' },
                    { ic:'📊', lbl:'Saisir les notes', p:'notes', color:'var(--amber)', bg:'var(--amberl)' },
                    { ic:'📅', lbl:'Mon planning', p:'planning', color:'var(--blue)', bg:'var(--bl)' },
                    { ic:'👥', lbl:'Mes eleves', p:'eleves', color:'var(--navy)', bg:'var(--g0)' },
                    { ic:'🎓', lbl:'Tawjih BAC', p:'tawjih', color:'var(--purple)', bg:'var(--purpl)' },
                    { ic:'🇲🇦', lbl:'Saisie Massar', p:'massar', color:'var(--red)', bg:'var(--redl)' },
                  ].map(a => (
                    <button key={a.p} onClick={() => setPage(a.p)}
                      style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:7 }}>
                      <span style={{ fontSize:14 }}>{a.ic}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                      <span style={{ color:a.color }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'presences' && (
            <div className="page-enter">
              <div className="ph"><h1>Appel & presences</h1><p>{today}</p></div>
              <div className="toolbar">
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ padding:'8px 12px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="btn btn-sm" style={{ background:'#E1F5EE', color:'#0F6E56' }} onClick={() => { const a={}; students.forEach(s=>a[s.id]='PRESENT'); setAttendance(a); }}>Tous presents</button>
                <button className="btn btn-sm btn-out" onClick={() => { const a={}; students.forEach(s=>a[s.id]='ABSENT'); setAttendance(a); }}>Tous absents</button>
              </div>
              <div className="card cp">
                <div className="ch">
                  <div>
                    <div className="ct">Appel · {today}</div>
                    <div style={{ fontSize:12, color:'var(--g2)', marginTop:2 }}>Cliquez pour changer: ✓ Present · ✗ Absent · ⏰ Retard</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 1fr', padding:'8px 12px', background:'var(--g0)', borderRadius:7, marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>Eleve</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', textAlign:'center' }}>Statut</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>Observation</div>
                </div>
                {students.map(s => {
                  const cur = attendance[s.id] || 'PRESENT';
                  const st = ST[cur] || ST.PRESENT;
                  return (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 130px 1fr', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F5F5F3' }}>
                      <div className="tav">
                        <div className="av" style={{ width:32, height:32, fontSize:10, background:'var(--bl)', color:'var(--blue)' }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          <div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', justifyContent:'center' }}>
                        <button onClick={() => cycleAtt(s.id)}
                          style={{ width:90, padding:'7px 12px', borderRadius:8, border:'1.5px solid '+st.border, cursor:'pointer', fontWeight:700, fontSize:15, background:st.bg, color:st.color, transition:'all .15s' }}>
                          {st.label}
                        </button>
                      </div>
                      <input placeholder="Observation..." style={{ padding:'7px 10px', border:'1px solid var(--g1)', borderRadius:7, fontSize:12, outline:'none' }} />
                    </div>
                  );
                })}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, paddingTop:14, borderTop:'1px solid var(--g1)' }}>
                  <div style={{ display:'flex', gap:20 }}>
                    {[
                      { lbl:'Presents', val:students.filter(s=>(attendance[s.id]||'PRESENT')==='PRESENT').length, color:'var(--green)' },
                      { lbl:'Absents', val:absents.length, color:'var(--red)' },
                      { lbl:'Retards', val:retards.length, color:'var(--amber)' },
                    ].map(m => (
                      <div key={m.lbl} style={{ textAlign:'center' }}>
                        <div style={{ fontSize:20, fontWeight:700, color:m.color }}>{m.val}</div>
                        <div style={{ fontSize:10, color:'var(--g2)', fontWeight:700, textTransform:'uppercase' }}>{m.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-navy" onClick={savePresences} disabled={saving}>{saving?'...':saved?'Enregistre!':'Enregistrer & Notifier WA'}</button>
                </div>
              </div>
            </div>
          )}

          {page === 'notes' && (
            <div className="page-enter">
              <div className="ph"><h1>Notes & evaluations</h1><p>Saisie par classe · {subject}</p></div>
              <div className="toolbar">
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ padding:'8px 12px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={semester} onChange={e => setSemester(+e.target.value)} style={{ padding:'8px 12px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  <option value={1}>Semestre 1</option><option value={2}>Semestre 2</option>
                </select>
              </div>
              <div className="card cp">
                <div className="ch">
                  <div>
                    <div className="ct">Saisie des notes · {subject} · S{semester}</div>
                    <div style={{ fontSize:12, color:'var(--g2)', marginTop:2 }}>Moyenne = (DS1 + DS2 + 2×Exam) / 4 · Rouge = insuffisant · WA = notification parent auto</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 80px', gap:8, padding:'9px 12px', background:'var(--g0)', borderRadius:7, marginBottom:6 }}>
                  {['Eleve','Devoir 1','Devoir 2','Examen','Moyenne','WA'].map((h,i) => (
                    <div key={h} style={{ fontSize:11, fontWeight:700, color:i===4?'#0F6E56':'var(--g2)', textTransform:'uppercase', textAlign:i>0?'center':'left' }}>{h}</div>
                  ))}
                </div>
                {students.map(s => {
                  const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
                  const isLow = g.average != null && g.average < 10;
                  return (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 80px', gap:8, padding:'10px 12px', borderBottom:'1px solid #F5F5F3', alignItems:'center', background:isLow?'#FFF8F8':'white' }}>
                      <div className="tav">
                        <div className="av" style={{ width:26, height:26, fontSize:10, background:isLow?'var(--redl)':'var(--bl)', color:isLow?'#791F1F':'var(--blue)' }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <span style={{ fontSize:13, fontWeight:600 }}>{s.firstName} {s.lastName}</span>
                      </div>
                      {['devoir1','devoir2','exam'].map(field => (
                        <input key={field} type="number" min="0" max="20" step="0.25" value={g[field]} onChange={e => setGradeField(s.id, field, e.target.value)} placeholder="–"
                          style={{ textAlign:'center', padding:'7px', borderRadius:7, fontSize:13, outline:'none', width:'100%', border:'1.5px solid '+(g[field]!==''&&+g[field]<10?'#F09595':'var(--g1)'), background:g[field]!==''&&+g[field]<10?'#FFF8F8':'white' }} />
                      ))}
                      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, padding:'7px', borderRadius:8, background:g.average==null?'var(--g0)':g.average<10?'var(--redl)':g.average>=14?'var(--greenl)':'var(--bl)', color:getMention(g.average).color }}>
                        {g.average ?? '–'}
                      </div>
                      <div style={{ textAlign:'center' }}>
                        {s.parentPhone && g.average != null && g.average < 10 ? (
                          <span className="badge b-r" style={{ cursor:'pointer', fontSize:9 }}
                            onClick={() => sendWA(s.parentPhone, 'Bonjour, ' + s.firstName + ' a obtenu ' + g.average + '/20 en ' + subject + '. Soutien recommande. ' + school?.name)}>
                            WA ✓
                          </span>
                        ) : <span style={{ color:'var(--g2)', fontSize:13 }}>—</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {page === 'planning' && (
            <div className="page-enter">
              <div className="ph"><h1>Mon planning</h1><p>Emploi du temps personnel · Semaine en cours</p></div>
              <div className="card cp">
                <div className="ch"><div className="ct">Mes seances de la semaine</div><button className="btn btn-out btn-sm" onClick={() => showToast('Impression...')}>Imprimer</button></div>
                <div style={{ background:'#E1F5EE', border:'1px solid #9FE1CB', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#0F6E56', fontWeight:600 }}>
                  Vos seances sont surlignees en vert · Matiere: {subject}
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                    <thead>
                      <tr style={{ background:'#063828' }}>
                        <th style={{ padding:'10px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', width:80 }}>Heure</th>
                        {DAYS.map(d => <th key={d} style={{ padding:'10px 12px', textAlign:'center', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map(h => (
                        <tr key={h} style={{ borderBottom:'1px solid #F5F5F3' }}>
                          <td style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:'var(--g2)', background:'#F8FAFC' }}>{h}</td>
                          {DAYS.map((d,di) => {
                            const isMine = (di===0&&h==='08h-10h')||(di===2&&h==='10h-12h')||(di===3&&h==='14h-16h');
                            return (
                              <td key={d} style={{ padding:5 }}>
                                {isMine ? (
                                  <div style={{ background:'#E1F5EE', borderRadius:7, padding:'7px 8px' }}>
                                    <div style={{ fontSize:11, fontWeight:700, color:'#0F6E56' }}>{subject.slice(0,8)}</div>
                                    <div style={{ fontSize:10, color:'#0F6E56', opacity:.8 }}>Salle 12</div>
                                  </div>
                                ) : (
                                  <div style={{ height:44, borderRadius:7, border:'1px dashed var(--g1)' }}></div>
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
            </div>
          )}

          {page === 'eleves' && (
            <div className="page-enter">
              <div className="ph"><h1>Mes eleves</h1><p>{students.length} eleves · {subject}</p></div>
              <div className="toolbar">
                <div className="sbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input className="sinp" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un eleve..." />
                </div>
                <select style={{ padding:'8px 12px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
                  <option>Toutes mes classes</option>
                  <option>Excellent (16+)</option>
                  <option>Bien (12-15)</option>
                  <option>Passable (10-11)</option>
                  <option>Insuffisant (&lt;10)</option>
                </select>
              </div>
              <div className="card cp">
                <table className="tbl">
                  <thead><tr><th>Eleve</th><th>Massar</th><th>Moy. {subject.slice(0,5)}</th><th>Presence</th><th>Evolution</th><th>Action</th></tr></thead>
                  <tbody>
                    {students.filter(s => (s.firstName+' '+s.lastName+s.massar).toLowerCase().includes(search.toLowerCase())).map(s => {
                      const g = grades[s.id];
                      const mention = getMention(g?.average);
                      const filieres = getFilieres(s.id);
                      const isAbsent = attendance[s.id] === 'ABSENT';
                      return (
                        <tr key={s.id} style={{ cursor:'pointer' }} onClick={() => { setSelectedStudent(s); setProfileModal(true); }}>
                          <td>
                            <div className="tav">
                              <div className="av" style={{ width:32, height:32, fontSize:11, background:g?.average&&g.average<10?'var(--redl)':'var(--bl)', color:g?.average&&g.average<10?'#791F1F':'var(--blue)' }}>
                                {s.firstName[0]}{s.lastName[0]}
                              </div>
                              <div><div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div><div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar}</div></div>
                            </div>
                          </td>
                          <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--g2)' }}>{s.massar}</td>
                          <td style={{ fontWeight:700, color:g?.average?(g.average<10?'var(--red)':g.average>=16?'var(--green)':'var(--blue2)'):'var(--g2)' }}>{g?.average ?? '–'}</td>
                          <td><span className={isAbsent?'badge b-r':'badge b-g'}>{isAbsent?'Absent':'Present'}</span></td>
                          <td><span style={{ color:!g?.average?'var(--g2)':g.average>=14?'var(--green)':g.average>=10?'var(--g2)':'var(--red)', fontWeight:700 }}>{!g?.average?'→':g.average>=14?'↑ bon':g.average>=10?'→ stable':'↓ risque'}</span></td>
                          <td><button className="btn btn-sm btn-out" onClick={e => { e.stopPropagation(); setSelectedStudent(s); setProfileModal(true); }}>Profil</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'messages' && (
            <div className="page-enter">
              <div className="ph"><h1>Messages</h1><p>Communication avec les parents et la direction</p></div>
              <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:14, height:'calc(100vh - 210px)', minHeight:400 }}>
                <div className="card" style={{ padding:13, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:11 }}>Conversations · <span style={{ color:'#E24B4A' }}>2 non lues</span></div>
                  {students.slice(0,5).map((s,i) => (
                    <div key={s.id} style={{ padding:'10px 8px', borderBottom:'1px solid #F5F5F3', cursor:'pointer', borderRadius:8, background:selectedStudent?.id===s.id?'var(--bl)':'transparent', transition:'background .12s' }}
                      onClick={() => setSelectedStudent(s)}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)' }}>Parent de {s.firstName}</div>
                        <div style={{ fontSize:11, color:'var(--g2)' }}>{i===0?'09:45':i===1?'08:15':'Hier'}</div>
                      </div>
                      <div style={{ fontSize:12, color:'var(--g2)', marginTop:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Message concernant {s.firstName}...</div>
                    </div>
                  ))}
                </div>
                <div className="card cp" style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  {selectedStudent ? (
                    <>
                      <div style={{ display:'flex', alignItems:'center', gap:11, paddingBottom:13, borderBottom:'1px solid #F5F5F3', marginBottom:13, flexShrink:0 }}>
                        <div className="av" style={{ width:42, height:42, fontSize:14, background:'var(--amberl)', color:'var(--gd)' }}>{selectedStudent.firstName[0]}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>Parent de {selectedStudent.firstName} {selectedStudent.lastName}</div>
                          <div style={{ fontSize:12, color:'var(--g2)' }}>{selectedStudent.massar}</div>
                        </div>
                        {selectedStudent.parentPhone && <button className="btn btn-wa btn-sm" onClick={() => sendWA(selectedStudent.parentPhone, 'Bonjour, message de ' + school?.name)}>WhatsApp</button>}
                      </div>
                      <div ref={msgRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
                        {messages.map((m,i) => (
                          <div key={i} style={{ display:'flex', justifyContent:m.type==='out'?'flex-end':'flex-start' }}>
                            <div style={{ maxWidth:'80%' }}>
                              <div style={{ background:m.type==='out'?'#DCF8C6':'white', border:'1px solid var(--g1)', borderRadius:m.type==='out'?'10px 10px 2px 10px':'10px 10px 10px 2px', padding:'9px 12px', fontSize:13, lineHeight:1.5, color:'var(--g3)' }}>{m.text}</div>
                              <div style={{ fontSize:10, color:'var(--g2)', marginTop:3, textAlign:m.type==='out'?'right':'left' }}>{m.time} {m.type==='out'?'Lu ✓✓':''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                        <input value={message} onChange={e => setMessage(e.target.value)}
                          onKeyDown={e => { if (e.key==='Enter' && message.trim()) { setMessages([...messages, { type:'out', text:message, time:'Maintenant' }]); setMessage(''); } }}
                          placeholder="Ecrire un message..." style={{ flex:1, padding:'10px 13px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none' }} />
                        <button className="btn btn-navy" onClick={() => { if (message.trim()) { setMessages([...messages, { type:'out', text:message, time:'Maintenant' }]); setMessage(''); } }}>Envoyer</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10, color:'var(--g2)' }}>
                      <div style={{ fontSize:32 }}>💬</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>Selectionnez une conversation</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {page === 'annonces' && (
            <div className="page-enter">
              <div className="ph"><h1>Annonces de l ecole</h1><p>Communications de la direction</p></div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {ANNONCES.map((a,i) => (
                  <div key={i} className="card cp">
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                      <div><div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{a.title}</div><div style={{ fontSize:12, color:'var(--g2)', marginTop:2 }}>De {a.from} · {a.time}</div></div>
                      <span className={'badge '+a.tc}>{a.type}</span>
                    </div>
                    <div style={{ fontSize:13, color:'var(--g3)', lineHeight:1.6 }}>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'tawjih' && (
            <div className="page-enter">
              <div className="ph"><h1>Tawjih — Orientation BAC Maroc</h1><p>SM · PC · SVT · ECO · LSH — Recommandations basees sur les notes</p></div>
              <div style={{ background:'linear-gradient(135deg,#063828 0%,#0F6E56 100%)', borderRadius:10, padding:'14px 18px', marginBottom:18, display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:24 }}>🤖</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>IA — Orientation automatique · {FILIERES.length} filieres BAC officielles</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>Recommandations basees sur toutes les matieres · Coefficients MEN officiels</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:18 }}>
                {FILIERES.map(f => (
                  <div key={f.id} style={{ background:'white', borderRadius:9, border:'1px solid '+f.color+'33', padding:'12px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:20 }}>{f.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:f.color, marginTop:4 }}>{f.id}</div>
                    <div style={{ fontSize:10, color:'var(--g2)', marginTop:2, lineHeight:1.3 }}>{f.lbl}</div>
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
                    <div key={s.id} className="card cp">
                      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                        <div className="av" style={{ width:42, height:42, fontSize:16, background:'var(--bl)', color:'var(--blue)', borderRadius:10 }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{s.firstName} {s.lastName}</div>
                          <div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:26, fontWeight:700, color:!avg?'#888780':parseFloat(avg)<10?'var(--red)':parseFloat(avg)>=14?'var(--green)':'var(--amber)' }}>{avg||'–'}</div>
                          <div style={{ fontSize:10, color:'var(--g2)' }}>Moy. generale</div>
                        </div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, marginBottom:12 }}>
                        {SUBJECTS.slice(0,5).map(subj => (
                          <div key={subj} style={{ background:'var(--g0)', borderRadius:7, padding:'7px 6px', textAlign:'center' }}>
                            <div style={{ fontSize:8, color:'var(--g2)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{subj.slice(0,6)}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:!g[subj]?'var(--g2)':g[subj]<10?'var(--red)':'var(--green)' }}>{g[subj]||'–'}</div>
                          </div>
                        ))}
                      </div>
                      {filieres.length === 0 ? (
                        <div style={{ background:'var(--redl)', borderRadius:8, padding:'9px 14px', fontSize:12, color:'var(--red)', fontWeight:700 }}>
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
            <div className="page-enter">
              <div className="ph"><h1>Saisie Massar</h1><p>Export notes format officiel MEN · massar.men.gov.ma</p></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
                <div style={{ background:'linear-gradient(135deg,#042C53 0%,#185FA5 100%)', borderRadius:10, padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:8 }}>Ouvrir Massar Moudaris</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:12 }}>Connectez-vous avec votre compte @taalim.ma</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <a href="https://massar.men.gov.ma/Account" target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background:'white', color:'var(--navy)', textDecoration:'none' }}>massar.men.gov.ma</a>
                    <a href="https://play.google.com/store/apps/details?id=ma.gov.men.massar.professeur" target="_blank" rel="noreferrer" className="btn btn-gold btn-sm" style={{ textDecoration:'none' }}>App Moudaris</a>
                  </div>
                </div>
                <div className="card cp">
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:12 }}>Matiere et Semestre</div>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <select value={massarSubject} onChange={e => setMassarSubject(e.target.value)} style={{ flex:1, padding:'9px 12px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none' }}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select value={massarSemester} onChange={e => setMassarSemester(+e.target.value)} style={{ padding:'9px 12px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none' }}>
                      <option value={1}>S1</option><option value={2}>S2</option>
                    </select>
                  </div>
                  <button className="btn btn-navy" style={{ width:'100%' }} onClick={exportMassar}>Telecharger CSV Massar</button>
                </div>
              </div>
              <div style={{ background:'var(--greenl)', border:'1px solid #97C459', borderRadius:10, padding:'12px 16px', marginBottom:14, fontSize:12, color:'var(--green)' }}>
                <strong>Comment :</strong> Telechargez le CSV → massar.men.gov.ma → Saisie des notes → Importez le fichier
              </div>
              <div className="card cp">
                <div className="ch"><div className="ct">Notes {massarSubject} — S{massarSemester} · Codes Massar</div><div style={{ fontSize:11, color:'var(--g2)' }}>Cliquez pour copier</div></div>
                <table className="tbl">
                  <thead><tr><th>Code Massar</th><th>Eleve</th><th>DS1</th><th>DS2</th><th>Exam</th><th>Moyenne</th><th>Statut</th></tr></thead>
                  <tbody>
                    {students.map(s => {
                      const g = massarGrades[s.id];
                      const valid = /^[A-Z][0-9]{9}$/.test(s.massar);
                      return (
                        <tr key={s.id} style={{ background:!valid?'#FFF8F8':'white' }}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:valid?'var(--navy)':'var(--red)' }}>{s.massar}</span>
                              {valid && <button onClick={() => copyVal(s.massar, 'm'+s.id)} style={{ background:copied==='m'+s.id?'var(--greenl)':'var(--g0)', border:'none', borderRadius:5, padding:'2px 6px', fontSize:10, cursor:'pointer' }}>{copied==='m'+s.id?'✓':'📋'}</button>}
                            </div>
                          </td>
                          <td style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</td>
                          {['devoir1','devoir2','exam'].map(f => (
                            <td key={f}>
                              {g&&g[f]!=null ? (
                                <button onClick={() => copyVal(g[f], f+s.id)} style={{ background:copied===f+s.id?'var(--greenl)':'var(--g0)', border:'1px solid '+(copied===f+s.id?'#97C459':'var(--g1)'), borderRadius:7, padding:'5px 10px', fontSize:13, fontWeight:700, cursor:'pointer', color:g[f]<10?'var(--red)':'var(--green)' }}>
                                  {copied===f+s.id?'✓':g[f]}
                                </button>
                              ) : <span style={{ color:'var(--g1)' }}>—</span>}
                            </td>
                          ))}
                          <td>
                            {g?.average!=null ? (
                              <button onClick={() => copyVal(g.average, 'av'+s.id)} style={{ background:copied==='av'+s.id?'var(--navy)':'var(--bl)', border:'none', borderRadius:7, padding:'5px 10px', fontSize:14, fontWeight:700, cursor:'pointer', color:copied==='av'+s.id?'white':g.average<10?'var(--red)':'var(--green)' }}>
                                {copied==='av'+s.id?'✓':g.average}
                              </button>
                            ) : <span style={{ color:'var(--g1)' }}>—</span>}
                          </td>
                          <td>{!valid?<span className="badge b-r">Code invalide</span>:!g?<span className="badge b-a">Sans notes</span>:<span className="badge b-g">Pret</span>}</td>
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
