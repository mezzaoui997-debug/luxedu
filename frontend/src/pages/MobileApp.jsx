import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://luxedu-production.up.railway.app';
const navy = '#1e2d4f';
const gold = '#C9963F';
const green = '#059669';

function groupGrades(grades = []) {
  const map = {};
  grades.forEach(g => {
    if (!map[g.subject]) map[g.subject] = { matiere: g.subject, evaluations: [], coef: 1 };
    if (g.devoir1 != null) map[g.subject].evaluations.push({ titre: 'Devoir 1', valeur: g.devoir1, date: '' });
    if (g.devoir2 != null) map[g.subject].evaluations.push({ titre: 'Devoir 2', valeur: g.devoir2, date: '' });
    if (g.exam != null) map[g.subject].evaluations.push({ titre: 'Examen', valeur: g.exam, date: '' });
  });
  return Object.values(map).filter(m => m.evaluations.length > 0);
}

function matiereAvg(m) {
  if (!m.evaluations.length) return 0;
  return (m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length).toFixed(1);
}

function globalAvg(notes = []) {
  if (!notes.length) return '0.00';
  let total = 0, coefTotal = 0;
  notes.forEach(m => {
    const avg = m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length;
    total += avg * m.coef; coefTotal += m.coef;
  });
  return (total / coefTotal).toFixed(2);
}

function getOrientation(notes = []) {
  const findAvg = (kw) => {
    const ms = notes.filter(m => kw.some(k => m.matiere.toLowerCase().includes(k.toLowerCase())));
    return ms.length ? ms.reduce((a, m) => a + parseFloat(matiereAvg(m)), 0) / ms.length : 0;
  };
  const mathAvg = findAvg(['math']);
  const sciAvg = findAvg(['physique', 'svt', 'chimie']);
  const langAvg = findAvg(['fran', 'anglais', 'arabe']);
  if (mathAvg >= 14 && sciAvg >= 13) return { filiere: 'Sciences & Ingenierie', color: '#2563eb', bg: '#eff6ff', pct: 95, desc: 'Excellence en Maths et Sciences.' };
  if (langAvg >= 14) return { filiere: 'Lettres & Sciences Humaines', color: '#7c3aed', bg: '#f5f3ff', pct: 88, desc: 'Maitrise des langues remarquable.' };
  if (parseFloat(globalAvg(notes)) >= 14) return { filiere: 'Classe Preparatoire', color: '#d97706', bg: '#fffbeb', pct: 92, desc: "Niveau d'excellence." };
  return { filiere: 'Economie & Gestion', color: green, bg: '#ecfdf5', pct: 80, desc: 'Profil equilibre.' };
}


const DEMO_PARENT_DATA = {
  prenom: 'Karim', nom: 'Alaoui', phone: 'demo',
  enfant: {
    prenom: 'Sara', nom: 'Alaoui', _id: 'demo', niveau: '2eme Bac Sciences', classe: 'TCS-A',
    notes: [
      { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 16.5, date: '10/03/2026' }, { titre: 'Controle 2', valeur: 17, date: '15/04/2026' }], coef: 7 },
      { matiere: 'Physique-Chimie', evaluations: [{ titre: 'Devoir 1', valeur: 14, date: '15/03/2026' }, { titre: 'Controle', valeur: 15, date: '20/04/2026' }], coef: 5 },
      { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 15, date: '20/03/2026' }, { titre: 'Controle', valeur: 16, date: '22/04/2026' }], coef: 3 },
      { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 17, date: '22/03/2026' }], coef: 2 },
      { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 13, date: '25/03/2026' }], coef: 4 },
    ],
    absences: [{ matiere: 'Mathematiques', date: '08/04/2026', duree: '2h', justifiee: true }],
    devoirs: [],
    paiements: [
      { mois: 'Mai 2026', montant: 1200, statut: 'paye', date: '02/05/2026' },
      { mois: 'Avril 2026', montant: 1200, statut: 'paye', date: '01/04/2026' },
      { mois: 'Juin 2026', montant: 1200, statut: 'en_attente', date: null },
    ]
  }
};

const DEMO_STUDENT_DATA = {
  prenom: 'Youssef', nom: 'Bennani', code: 'LUX-DEMO-001', niveau: '2eme Bac', classe: 'TCS-B',
  notes: [
    { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 15, date: '10/03/2026' }, { titre: 'Controle 2', valeur: 16, date: '15/04/2026' }], coef: 7 },
    { matiere: 'Physique-Chimie', evaluations: [{ titre: 'Devoir 1', valeur: 14, date: '15/03/2026' }], coef: 5 },
    { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 15, date: '20/03/2026' }], coef: 3 },
    { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 16, date: '22/03/2026' }], coef: 2 },
    { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 13, date: '25/03/2026' }], coef: 4 },
  ],
  absences: [],
  devoirs: [
    { id: 1, titre: 'Exercices integrales ch.5', matiere: 'Mathematiques', deadline: '2026-06-10', rendu: false, urgent: true, description: 'Exercices pages 45 a 47 du manuel.', enseignant: 'M. Benali' },
    { id: 2, titre: 'Redaction avenir professionnel', matiere: 'Francais', deadline: '2026-06-05', rendu: true, urgent: false, description: 'Redaction 300 mots minimum.', enseignant: 'Mme. Cherkaoui', note: '14/20' },
  ],
  messages: [
    { id: 1, expediteur: 'M. Benali', matiere: 'Mathematiques', texte: 'Excellent travail Youssef!', heure: '14:30', lu: false },
  ]
};

const EVENTS = [
  { date: '2026-06-05', label: 'Reunion parents-professeurs', type: 'school' },
  { date: '2026-06-15', label: 'Debut des examens', type: 'exam' },
  { date: '2026-07-30', label: 'Fete du Trone', type: 'national' },
  { date: '2026-08-20', label: 'Revolution du Roi', type: 'national' },
  { date: '2026-11-18', label: "Fete de l'Independance", type: 'national' },
  { date: '2026-09-03', label: 'Rentree scolaire 2026-2027', type: 'school' },
];

function getUpcomingEvents() {
  return EVENTS.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
}

function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }

function Avatar({ name = '', size = 36, bg = gold }) {
  return <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: 'white', flexShrink: 0 }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}</div>;
}

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>;
}

function NoteBar({ label, value, coef }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value / 20 * 100), 100); return () => clearTimeout(t); }, [value]);
  const color = value >= 16 ? green : value >= 12 ? '#2563eb' : value >= 10 ? '#d97706' : '#dc2626';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <div><span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{label}</span>{coef && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>coef. {coef}</span>}</div>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: w + '%', background: color, borderRadius: 4, transition: 'width .8s ease' }} /></div>
    </div>
  );
}

const inp = { width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fafafa', fontFamily: 'inherit' };

export default function MobileApp() {
  const [screen, setScreen] = useState('home');
  const [loginType, setLoginType] = useState('student');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [studentToken, setStudentToken] = useState('');
  const [studentTab, setStudentTab] = useState('home');
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activites, setActivites] = useState([]);
  const [tawjihTab, setTawjihTab] = useState('profil');
  const [parent, setParent] = useState(null);
  const [parentToken, setParentToken] = useState('');
  const [parentStudentData, setParentStudentData] = useState(null);
  const [parentTab, setParentTab] = useState('home');
  const [recs, setRecs] = useState([]);
  const [recSujet, setRecSujet] = useState('');
  const [recMsg, setRecMsg] = useState('');
  const [recOk, setRecOk] = useState(false);

  async function handleLogin() {
    setError(''); setLoading(true);
    try {
      if (loginType === 'student') {
        const res = await fetch(`${API}/api/student/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Code ou mot de passe incorrect');
        if (data.mustSetPassword) throw new Error('Premiere connexion: creez votre mot de passe sur luxeduschool.com/etudiant');
        setStudentToken(data.token);
        setStudent({ prenom: data.student.prenom, nom: data.student.nom, code: data.student.code, niveau: data.student.niveau || '', classe: data.student.classe || '', notes: data.student.notes || [], absences: data.student.absences || [], devoirs: data.student.devoirs || [] });
        setMsgs(data.student.messages || []);
        setActivites([{ id: 1, titre: 'Club de Mathematiques', jour: 'Mercredi', heure: '14h-16h', salle: 'Salle 12', inscrit: false }, { id: 2, titre: 'Club Informatique', jour: 'Mardi', heure: '13h-15h', salle: 'Labo', inscrit: false }, { id: 3, titre: 'Equipe de Football', jour: 'Vendredi', heure: '15h-17h', salle: 'Terrain', inscrit: false }]);
        setStudentTab('home'); setScreen('student');
      } else {
        const res = await fetch(`${API}/api/parent/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: code, massar: password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Numero ou code Massar incorrect');
        const s = data.student;
        const tok = data.token;
        setParentToken(tok);
        setParent({ prenom: s.firstName, nom: s.lastName, phone: code });
        setParentStudentData({ prenom: s.firstName, nom: s.lastName, _id: s.id, niveau: s.class?.level || '', classe: s.class?.name || '', notes: groupGrades(s.grades || []), absences: (s.attendances || []).filter(a => a.status === 'ABSENT').map(a => ({ matiere: 'N/A', date: new Date(a.date).toLocaleDateString('fr-FR'), duree: '1h', justifiee: false })), devoirs: [], paiements: (s.payments || []).map(p => ({ mois: p.month, montant: p.amount, statut: p.status === 'PAID' ? 'paye' : p.status === 'LATE' ? 'en_retard' : 'en_attente', date: p.paidAt ? new Date(p.paidAt).toLocaleDateString('fr-FR') : null })) });
        try {
          const r2 = await fetch(`${API}/api/parent/reclamations/${s.id}`, { headers: { Authorization: `Bearer ${tok}` } });
          if (r2.ok) { const d2 = await r2.json(); setRecs(Array.isArray(d2) ? d2.map(r => ({ id: r.id, sujet: r.sujet, date: new Date(r.createdAt).toLocaleDateString('fr-FR'), statut: r.statut, reponse: r.reponse })) : []); }
        } catch(e) {}
        setParentTab('home'); setScreen('parent');
      }
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function sendRec() {
    if (!recSujet.trim() || !recMsg.trim()) return;
    try {
      const res = await fetch(`${API}/api/parent/reclamations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${parentToken}` }, body: JSON.stringify({ sujet: recSujet, message: recMsg }) });
      const data = await res.json();
      if (res.ok) { setRecs(prev => [{ id: data.id, sujet: recSujet, date: new Date().toLocaleDateString('fr-FR'), statut: 'en_attente', reponse: null }, ...prev]); setRecSujet(''); setRecMsg(''); setRecOk(true); setTimeout(() => setRecOk(false), 4000); }
    } catch(e) { console.log('send rec error', e); }
  }

  function logout() { setScreen('home'); setStudent(null); setParent(null); setParentStudentData(null); setStudentToken(''); setParentToken(''); setCode(''); setPassword(''); setError(''); setRecs([]); }

  // HOME
  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: navy, padding: '60px 28px 44px', textAlign: 'center', background: `linear-gradient(160deg, #1e2d4f 0%, #152238 100%)` }}>
        <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 120, width: 'auto', filter: 'drop-shadow(0 8px 32px rgba(201,150,63,0.5))' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '.2em', textTransform: 'uppercase' }}>PLATEFORME SCOLAIRE</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ width: 32, height: 1, background: 'rgba(201,150,63,0.4)' }} />
            <div style={{ fontSize: 13, color: gold, letterSpacing: '.2em', fontWeight: 700 }}>MAROC</div>
            <div style={{ width: 32, height: 1, background: 'rgba(201,150,63,0.4)' }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 4 }}>Selectionnez votre espace</div>
        {[
          { type: 'student', title: 'Espace Etudiant', desc: 'Notes · Devoirs · Absences · Tawjih', bg: '#eff6ff', sc: '#2563eb' },
          { type: 'parent', title: 'Espace Parent', desc: 'Suivi enfant · Paiements · Reclamations', bg: '#f0fdf4', sc: green },
        ].map((item, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e8edf5', borderRadius: 18, padding: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, background: item.bg, borderRadius: 14, boxShadow: `0 2px 8px ${item.sc}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={item.sc} strokeWidth="1.5">
                  {item.type === 'student' ? <><path d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" /><circle cx="12" cy="8" r="4" /></> : <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>}
                </svg>
              </div>
              <div><div style={{ fontSize: 16, fontWeight: 800, color: navy, letterSpacing: '-.01em' }}>{item.title}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.desc}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <button onClick={() => {
                if (item.type === 'student') {
                  setStudent({ ...DEMO_STUDENT_DATA });
                  setMsgs([...DEMO_STUDENT_DATA.messages]);
                  setActivites([{ id: 1, titre: 'Club Mathematiques', jour: 'Mercredi', heure: '14h-16h', salle: 'Salle 12', inscrit: true }, { id: 2, titre: 'Club Informatique', jour: 'Mardi', heure: '13h-15h', salle: 'Labo', inscrit: false }]);
                  setStudentTab('home'); setScreen('student');
                } else {
                  setParent({ prenom: 'Karim', nom: 'Alaoui', phone: 'demo', _token: null });
                  setParentStudentData({ ...DEMO_PARENT_DATA.enfant });
                  setRecs([{ id: 1, sujet: 'Absence injustifiee du 08/04', date: '10/04/2026', statut: 'traitee', reponse: "Apres verification, l'absence a ete justifiee." }]);
                  setParentTab('home'); setScreen('parent');
                }
              }} style={{ flex: 1, padding: '11px 8px', borderRadius: 10, border: `1.5px solid ${item.sc}`, background: 'white', color: item.sc, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all .2s' }}>
                Voir la demo
              </button>
              <button onClick={() => { setLoginType(item.type); setScreen('login'); setError(''); setCode(''); setPassword(''); }} style={{ flex: 1, padding: '11px 8px', borderRadius: 10, border: 'none', background: item.sc, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: `0 4px 16px ${item.sc}50` }}>
                Connexion
              </button>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 24, textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '.05em' }}>2026 LuxEdu Casablanca, Maroc</div></div>
      </div>
    </div>
  );

  // LOGIN
  if (screen === 'login') {
    const isS = loginType === 'student';
    const color = isS ? navy : green;
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: color, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 26, width: 'auto' }} onError={e => e.target.style.display = 'none'} />
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{isS ? 'Espace Etudiant' : 'Espace Parent'}</span>
        </div>
        <div style={{ padding: '32px 24px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: navy, marginBottom: 4 }}>Connexion {isS ? 'Etudiant' : 'Parent'}</div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>{isS ? 'Code unique et mot de passe' : 'Numero de telephone et code Massar'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{isS ? 'CODE ETUDIANT' : 'TELEPHONE'}</label>
              <input style={inp} placeholder={isS ? 'Ex: LUX-2026-001' : 'Ex: +212661234567'} value={code} onChange={e => setCode(e.target.value)} onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{isS ? 'MOT DE PASSE' : 'CODE MASSAR'}</label>
              <input style={inp} type={isS ? 'password' : 'text'} placeholder={isS ? '........' : 'Ex: G412252321'} value={password} onChange={e => setPassword(e.target.value)} onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{error}</div>}
            <button style={{ width: '100%', padding: '14px', borderRadius: 10, background: color, color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
              {loading ? 'Connexion...' : 'Acceder a mon espace'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STUDENT DASHBOARD
  if (screen === 'student' && student) {
    const avg = globalAvg(student.notes);
    const orientation = getOrientation(student.notes);
    const unread = msgs.filter(m => !m.lu).length;
    const events = getUpcomingEvents();
    const showTawjih = ['bac', '1ere', '2eme', '9eme', '5eme', '6eme'].some(l => student.niveau?.toLowerCase().includes(l));
    const sTabs = [{ id: 'home', label: 'Accueil' }, { id: 'notes', label: 'Notes' }, { id: 'devoirs', label: 'Devoirs' }, { id: 'activites', label: 'Activites' }, { id: 'messages', label: `Messages${unread ? ` (${unread})` : ''}` }, ...(showTawjih ? [{ id: 'tawjih', label: 'Tawjih' }] : [])];

    if (selectedDevoir) return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedDevoir(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <span style={{ color: 'white', fontWeight: 600 }}>Detail du devoir</span>
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, border: `2px solid ${selectedDevoir.rendu ? '#bbf7d0' : selectedDevoir.urgent ? '#fecaca' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 4 }}>{selectedDevoir.titre}</div><div style={{ fontSize: 13, color: '#64748b' }}>{selectedDevoir.matiere}</div></div>
              <Badge label={selectedDevoir.rendu ? 'Rendu' : selectedDevoir.urgent ? 'Urgent' : 'En attente'} color={selectedDevoir.rendu ? green : selectedDevoir.urgent ? '#dc2626' : '#d97706'} bg={selectedDevoir.rendu ? '#f0fdf4' : selectedDevoir.urgent ? '#fef2f2' : '#fefce8'} />
            </div>
            {selectedDevoir.deadline && <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}><span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>A rendre le {selectedDevoir.deadline}</span></div>}
            {selectedDevoir.description && <><div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Instructions</div><div style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>{selectedDevoir.description}</div></>}
            {selectedDevoir.note && <div style={{ marginTop: 14, background: '#f0fdf4', borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, color: green, textTransform: 'uppercase', marginBottom: 4 }}>Note obtenue</div><div style={{ fontSize: 32, fontWeight: 700, color: green }}>{selectedDevoir.note}</div></div>}
          </div>
        </div>
      </div>
    );

    if (selectedMatiere) return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedMatiere(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <span style={{ color: 'white', fontWeight: 600 }}>{selectedMatiere.matiere}</span>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Moyenne</div><div style={{ fontSize: 32, fontWeight: 700 }}>{matiereAvg(selectedMatiere)}<span style={{ fontSize: 14, fontWeight: 400 }}>/20</span></div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Coefficient</div><div style={{ fontSize: 28, fontWeight: 700 }}>{selectedMatiere.coef}</div></div>
          </div>
          {selectedMatiere.evaluations.map((ev, i) => {
            const color = ev.valeur >= 16 ? green : ev.valeur >= 12 ? '#2563eb' : ev.valeur >= 10 ? '#d97706' : '#dc2626';
            return (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div><div style={{ fontSize: 15, fontWeight: 600, color: navy }}>{ev.titre}</div>{ev.date && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{ev.date}</div>}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color }}>{ev.valeur}<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>/20</span></div>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (ev.valeur / 20 * 100) + '%', background: color, borderRadius: 4 }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={`${student.prenom} ${student.nom}`} size={38} bg={gold} />
            <div><div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{student.prenom} {student.nom}</div><div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{student.code} · {student.classe}</div></div>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Changer de compte
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {studentTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 16, padding: 20, color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Annee scolaire 2025-2026</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Bonjour, {student.prenom}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20', good: parseFloat(avg) >= 10 }, { label: 'Absences', value: student.absences.length + 'h', good: student.absences.length < 4 }, { label: 'Devoirs', value: (student.devoirs || []).filter(d => !d.rendu).length, good: true }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: item.good ? '#4ade80' : '#f87171' }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {student.notes.length > 0 && (
                <div style={{ background: orientation.bg, borderRadius: 14, padding: 16, border: `1px solid ${orientation.color}25` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Orientation IA</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 6 }}>{orientation.filiere}</div>
                  <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: orientation.pct + '%', background: orientation.color, borderRadius: 4 }} /></div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: showTawjih ? 10 : 0 }}>Compatibilite <strong style={{ color: orientation.color }}>{orientation.pct}%</strong></div>
                  {showTawjih && <button onClick={() => setStudentTab('tawjih')} style={{ background: orientation.color, color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Voir les etablissements</button>}
                </div>
              )}
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Prochains evenements</div>
                {events.slice(0, 3).map((ev, i) => {
                  const days = daysUntil(ev.date);
                  const tc = { national: '#2563eb', religieux: '#d97706', exam: '#dc2626', school: '#7c3aed' }[ev.type] || '#64748b';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 40, height: 40, background: '#f8fafc', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: tc, lineHeight: 1 }}>{new Date(ev.date).getDate()}</div>
                        <div style={{ fontSize: 9, color: tc }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>{days <= 0 ? "Aujourd'hui" : `Dans ${days} jours`}</div></div>
                    </div>
                  );
                })}
              </div>
              {unread > 0 && <button onClick={() => setStudentTab('messages')} style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e', flex: 1 }}>{unread} message(s) non lu(s)</span>
              </button>}
            </div>
          )}
          {studentTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {student.notes.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: 14 }}>Aucune note disponible</div> : (
                <>
                  <div style={{ background: navy, borderRadius: 14, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                    <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Moyenne generale</div><div style={{ fontSize: 30, fontWeight: 700 }}>{avg}<span style={{ fontSize: 14, fontWeight: 400 }}>/20</span></div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{student.notes.length} matieres</div></div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Appuyez sur une matiere pour le detail</div>
                  {student.notes.map((m, i) => {
                    const a = parseFloat(matiereAvg(m));
                    const color = a >= 16 ? green : a >= 12 ? '#2563eb' : a >= 10 ? '#d97706' : '#dc2626';
                    return (
                      <button key={i} onClick={() => setSelectedMatiere(m)} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{m.matiere}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Coef. {m.coef} · {m.evaluations.length} eval.</div></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ fontSize: 20, fontWeight: 700, color }}>{a}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></div>
                        </div>
                        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (a / 20 * 100) + '%', background: color, borderRadius: 4 }} /></div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
          {studentTab === 'devoirs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(student.devoirs || []).length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: 14 }}>Aucun devoir disponible</div> : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 4 }}>
                    {[{ label: 'En attente', value: (student.devoirs || []).filter(d => !d.rendu).length, color: '#d97706', bg: '#fffbeb' }, { label: 'Rendus', value: (student.devoirs || []).filter(d => d.rendu).length, color: green, bg: '#f0fdf4' }, { label: 'Urgents', value: (student.devoirs || []).filter(d => !d.rendu && d.urgent).length, color: '#dc2626', bg: '#fef2f2' }].map((item, i) => (
                      <div key={i} style={{ background: item.bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{item.label}</div></div>
                    ))}
                  </div>
                  {(student.devoirs || []).map((d, i) => (
                    <button key={i} onClick={() => setSelectedDevoir(d)} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${d.rendu ? '#dcfce7' : d.urgent ? '#fecaca' : '#f1f5f9'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><div style={{ width: 7, height: 7, borderRadius: '50%', background: d.rendu ? green : d.urgent ? '#ef4444' : '#f59e0b', flexShrink: 0 }} /><span style={{ fontSize: 14, fontWeight: 600, color: navy }}>{d.titre}</span></div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{d.matiere} · {d.deadline}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 10 }}>
                          <Badge label={d.rendu ? 'Rendu' : d.urgent ? 'Urgent' : 'En attente'} color={d.rendu ? green : d.urgent ? '#dc2626' : '#d97706'} bg={d.rendu ? '#f0fdf4' : d.urgent ? '#fef2f2' : '#fefce8'} />
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
          {studentTab === 'activites' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 14 }}>Clubs et Activites</div>
                {activites.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < activites.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <div style={{ width: 44, height: 44, background: a.inscrit ? '#eff6ff' : '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a.inscrit ? '#2563eb' : '#94a3b8'} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{a.titre}</div><div style={{ fontSize: 12, color: '#64748b' }}>{a.jour} · {a.heure} · {a.salle}</div></div>
                    <button onClick={() => setActivites(prev => prev.map(act => act.id === a.id ? { ...act, inscrit: !act.inscrit } : act))} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: a.inscrit ? '#fef2f2' : '#f0fdf4', color: a.inscrit ? '#dc2626' : green, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>{a.inscrit ? 'Quitter' : "S'inscrire"}</button>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 14 }}>Agenda</div>
                {events.map((ev, i) => {
                  const days = daysUntil(ev.date);
                  const tc = { national: '#2563eb', religieux: '#d97706', exam: '#dc2626', school: '#7c3aed' }[ev.type] || '#64748b';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < events.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 46, height: 46, background: '#f8fafc', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: tc, lineHeight: 1 }}>{new Date(ev.date).getDate()}</div>
                        <div style={{ fontSize: 10, color: tc, fontWeight: 600 }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>{days <= 0 ? "Aujourd'hui" : `Dans ${days}j`}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {studentTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 4 }}>Messages</div>
              {msgs.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: 14 }}>Aucun message</div> : msgs.map((m, i) => (
                <button key={i} onClick={() => { setMsgs(prev => prev.map(msg => msg.id === m.id ? { ...msg, lu: true } : msg)); setSelectedMsg(m); }} style={{ background: m.lu ? 'white' : '#f0f7ff', borderRadius: 12, padding: '14px 16px', border: `1px solid ${m.lu ? '#f1f5f9' : '#bfdbfe'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!m.lu && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />}
                      <Avatar name={m.expediteur} size={32} bg={navy} />
                      <div><div style={{ fontSize: 14, fontWeight: m.lu ? 500 : 700, color: navy }}>{m.expediteur}</div><div style={{ fontSize: 11, color: '#2563eb', fontWeight: 500 }}>{m.matiere}</div></div>
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{m.heure}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 40 }}>{m.texte}</div>
                </button>
              ))}
              {selectedMsg && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 32px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={selectedMsg.expediteur} size={40} bg={navy} /><div><div style={{ fontSize: 16, fontWeight: 800, color: navy, letterSpacing: '-.01em' }}>{selectedMsg.expediteur}</div><div style={{ fontSize: 12, color: '#64748b' }}>{selectedMsg.matiere}</div></div></div>
                      <button onClick={() => setSelectedMsg(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                    </div>
                    <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>{selectedMsg.texte}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input style={{ ...inp, flex: 1, fontSize: 14 }} placeholder="Repondre..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                      <button onClick={() => { if (!replyText.trim()) return; setMsgs(prev => [...prev, { id: Date.now(), expediteur: 'Moi', matiere: selectedMsg.matiere, texte: replyText, heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), lu: true }]); setReplyText(''); setSelectedMsg(null); }} style={{ padding: '12px 16px', background: navy, border: 'none', borderRadius: 10, cursor: 'pointer', flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {studentTab === 'tawjih' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 14, padding: 20, color: 'white' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Portail Orientation</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Tawjih</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{student.niveau}</div>
              </div>
              {student.notes.length > 0 && <div style={{ background: orientation.bg, borderRadius: 12, padding: 16, border: `1px solid ${orientation.color}30` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Recommandation IA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 8 }}>{orientation.filiere}</div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: orientation.pct + '%', background: orientation.color, borderRadius: 4 }} /></div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{orientation.desc}</div>
              </div>}
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
                {['profil', 'concours', 'maroc', 'international'].map(t => <button key={t} onClick={() => setTawjihTab(t)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', background: tawjihTab === t ? 'white' : 'transparent', color: tawjihTab === t ? navy : '#94a3b8', fontSize: 11, fontWeight: tawjihTab === t ? 700 : 400, cursor: 'pointer' }}>{t === 'profil' ? 'Mon profil' : t === 'concours' ? 'Concours' : t === 'maroc' ? 'Maroc' : 'Monde'}</button>)}
              </div>
              {tawjihTab === 'profil' && student.notes.length > 0 && <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>{student.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}</div>}
              {tawjihTab === 'concours' && [
                { nom: 'Concours CPGE', desc: 'Classes Preparatoires', url: 'https://cpge.ma', deadline: '30 Juin 2026' },
                { nom: 'Concours ENSA', desc: 'Ecoles Sciences Appliquees', url: 'https://ensa.ac.ma', deadline: '15 Juillet 2026' },
                { nom: 'Portail Massar MEN', desc: 'Orientation officielle', url: 'https://men.gov.ma', deadline: 'Apres resultats' },
                { nom: 'Campus France Maroc', desc: 'Etudes en France', url: 'https://maroc.campusfrance.org', deadline: '15 Mars 2026' },
              ].map((c, i) => <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{c.nom}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.desc}</div><div style={{ fontSize: 11, color: '#d97706', fontWeight: 600, marginTop: 4 }}>Deadline: {c.deadline}</div></div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>)}
              {tawjihTab === 'maroc' && [
                { name: 'Universite Mohammed V', field: 'Pluridisciplinaire', city: 'Rabat', url: 'https://um5.ac.ma' },
                { name: 'ENCG Casablanca', field: 'Commerce et Gestion', city: 'Casablanca', url: 'https://encg-casa.ma' },
                { name: 'ENSA Marrakech', field: 'Ingenierie', city: 'Marrakech', url: 'https://ensa.uca.ma' },
              ].map((u, i) => <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{u.name}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{u.field} · {u.city}</div></div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>)}
              {tawjihTab === 'international' && [
                { name: 'Sorbonne Universite', country: 'France', rank: '#83 mondial', url: 'https://sorbonne-universite.fr' },
                { name: 'HEC Paris', country: 'France', rank: '#1 Business', url: 'https://hec.edu' },
                { name: 'McGill University', country: 'Canada', rank: '#46 mondial', url: 'https://mcgill.ca' },
              ].map((u, i) => <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{u.name}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{u.country} · <span style={{ color: '#d97706', fontWeight: 600 }}>{u.rank}</span></div></div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>)}
            </div>
          )}
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e8edf5', display: 'flex', paddingTop: 6, paddingBottom: 28, zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
          {sTabs.map(t => (
            <button key={t.id} onClick={() => { setStudentTab(t.id); setSelectedDevoir(null); setSelectedMatiere(null); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: studentTab === t.id ? navy : '#94a3b8', padding: '4px 0', position: 'relative' }}>
              {t.id === 'messages' && unread > 0 && <div style={{ position: 'absolute', top: 0, right: '14%', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid white' }} />}
              <div style={{ width: 28, height: 28, borderRadius: 8, background: studentTab === t.id ? '#eff6ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.id === 'home' && <svg width="16" height="16" viewBox="0 0 24 24" fill={studentTab === t.id ? navy : 'none'} stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                {t.id === 'notes' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                {t.id === 'devoirs' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                {t.id === 'activites' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                {t.id.startsWith('messages') && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                {t.id === 'tawjih' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={studentTab === t.id ? navy : '#94a3b8'} strokeWidth="1.8"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>}
              </div>
              <span style={{ fontSize: 9, fontWeight: studentTab === t.id ? 700 : 400 }}>{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // PARENT DASHBOARD
  if (screen === 'parent' && parent && parentStudentData) {
    const s = parentStudentData;
    const avg = globalAvg(s.notes);
    const events = getUpcomingEvents();
    const pTabs = [{ id: 'home', label: 'Accueil' }, { id: 'enfant', label: 'Mon enfant' }, { id: 'paiements', label: 'Paiements' }, { id: 'reclamations', label: 'Reclamations' }];
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: green, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={`${parent.prenom} ${parent.nom}`} size={38} bg="rgba(255,255,255,0.25)" />
            <div><div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{parent.prenom} {parent.nom}</div><div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Espace Parent</div></div>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Changer de compte
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {parentTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: green, borderRadius: 16, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Tableau de bord parent</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Bonjour, {parent.prenom}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20' }, { label: 'Absences', value: s.absences.length + 'h' }, { label: 'Impayes', value: s.paiements.filter(p => p.statut !== 'paye').length }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{item.label}</div></div>
                  ))}
                </div>
              </div>
              {s.paiements.some(p => p.statut === 'en_retard') && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Paiement en retard</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Necessite votre attention</div></div><button onClick={() => setParentTab('paiements')} style={{ background: '#dc2626', border: 'none', borderRadius: 8, color: 'white', padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Voir</button></div>}
              <button onClick={() => setParentTab('enfant')} style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={`${s.prenom} ${s.nom}`} size={42} bg={navy} /><div><div style={{ fontSize: 16, fontWeight: 800, color: navy, letterSpacing: '-.01em' }}>{s.prenom} {s.nom}</div><div style={{ fontSize: 12, color: '#64748b' }}>{s.niveau} · {s.classe}</div></div></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[{ label: 'Moyenne', value: avg + '/20', color: parseFloat(avg) >= 10 ? green : '#dc2626' }, { label: 'Absences', value: s.absences.length + 'h', color: '#d97706' }, { label: 'Devoirs att.', value: (s.devoirs || []).filter(d => !d.rendu).length, color: '#2563eb' }].map((item, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div><div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.label}</div></div>
                  ))}
                </div>
              </button>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Prochains evenements</div>
                {events.slice(0, 3).map((ev, i) => {
                  const days = daysUntil(ev.date);
                  return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}><div style={{ width: 36, height: 36, background: '#f0fdf4', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: green, lineHeight: 1 }}>{new Date(ev.date).getDate()}</div><div style={{ fontSize: 9, color: green }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div></div><div><div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>{days <= 0 ? "Aujourd'hui" : `Dans ${days} jours`}</div></div></div>;
                })}
              </div>
            </div>
          )}
          {parentTab === 'enfant' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.prenom} {s.nom}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 14 }}>{s.niveau} · {s.classe}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20' }, { label: 'Absences', value: s.absences.length + 'h' }, { label: 'Devoirs att.', value: (s.devoirs || []).filter(d => !d.rendu).length }].map((item, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700 }}>{item.value}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{item.label}</div></div>)}
                </div>
              </div>
              {s.notes.length > 0 && <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}><div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 14 }}>Notes par matiere</div>{s.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}</div>}
              {s.absences.length > 0 && <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}><div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Absences</div>{s.absences.map((a, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < s.absences.length - 1 ? '1px solid #f8fafc' : 'none' }}><div><div style={{ fontSize: 13, fontWeight: 500, color: navy }}>{a.matiere}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{a.date} · {a.duree}</div></div><Badge label={a.justifiee ? 'Justifiee' : 'Non justifiee'} color={a.justifiee ? green : '#dc2626'} bg={a.justifiee ? '#f0fdf4' : '#fef2f2'} /></div>)}</div>}
            </div>
          )}
          {parentTab === 'paiements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(() => {
                const totalPaye = s.paiements.filter(p => p.statut === 'paye').reduce((a, p) => a + p.montant, 0);
                const totalDu = s.paiements.length * (s.paiements[0]?.montant || 1200);
                return <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Paiements - {s.prenom} {s.nom}</div><div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{totalPaye.toLocaleString()} MAD</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>payes sur {totalDu.toLocaleString()} MAD</div><div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (totalDu > 0 ? totalPaye / totalDu * 100 : 0) + '%', background: '#4ade80', borderRadius: 4 }} /></div></div>;
              })()}
              {s.paiements.length === 0 ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 14 }}>Aucun paiement enregistre</div> : s.paiements.map((p, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${p.statut === 'paye' ? '#dcfce7' : p.statut === 'en_retard' ? '#fecaca' : '#fef9c3'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: p.statut !== 'paye' ? 10 : 0 }}>
                    <div><div style={{ fontSize: 16, fontWeight: 800, color: navy, letterSpacing: '-.01em' }}>{p.mois}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{p.statut === 'paye' ? `Paye le ${p.date}` : p.statut === 'en_retard' ? 'En retard' : 'A venir'}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: 16, fontWeight: 700, color: navy }}>{p.montant.toLocaleString()} MAD</div><Badge label={p.statut === 'paye' ? 'Paye' : p.statut === 'en_retard' ? 'En retard' : 'En attente'} color={p.statut === 'paye' ? green : p.statut === 'en_retard' ? '#dc2626' : '#d97706'} bg={p.statut === 'paye' ? '#f0fdf4' : p.statut === 'en_retard' ? '#fef2f2' : '#fefce8'} /></div>
                  </div>
                  {p.statut !== 'paye' && <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8 }}>Virement bancaire</div>
                    {[{ label: 'Banque', value: 'Attijariwafa Bank' }, { label: 'Beneficiaire', value: 'LuxEdu Excellence' }, { label: 'RIB', value: '007 780 0000123456789012 26' }, { label: 'Motif', value: `Scolarite ${p.mois}` }].map((item, idx) => <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none' }}><span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{item.label}</span><span style={{ fontSize: 12, color: navy, fontWeight: 600, fontFamily: idx === 2 ? 'monospace' : 'inherit' }}>{item.value}</span></div>)}
                    <button onClick={() => navigator.clipboard?.writeText('007 780 0000123456789012 26')} style={{ marginTop: 10, background: navy, color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Copier le RIB</button>
                  </div>}
                </div>
              ))}
            </div>
          )}
          {parentTab === 'reclamations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 12 }}>Nouvelle reclamation</div>
                {recOk && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: green, marginBottom: 10 }}>Reclamation envoyee. Reponse sous 48h.</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input style={inp} placeholder="Sujet de la reclamation" value={recSujet} onChange={e => setRecSujet(e.target.value)} onFocus={e => e.target.style.borderColor = green} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <textarea style={{ ...inp, minHeight: 90, resize: 'none' }} placeholder="Decrivez votre reclamation..." value={recMsg} onChange={e => setRecMsg(e.target.value)} onFocus={e => e.target.style.borderColor = green} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <button style={{ width: '100%', padding: '14px', borderRadius: 10, background: green, color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={sendRec}>Envoyer la reclamation</button>
                </div>
              </div>
              {recs.length > 0 && <><div style={{ fontSize: 13, fontWeight: 700, color: navy }}>Historique</div>{recs.map((r, i) => <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}><div style={{ fontSize: 14, fontWeight: 600, color: navy, flex: 1 }}>{r.sujet}</div><Badge label={r.statut === 'traitee' ? 'Traitee' : r.statut === 'en_cours' ? 'En cours' : 'En attente'} color={r.statut === 'traitee' ? green : r.statut === 'en_cours' ? '#2563eb' : '#d97706'} bg={r.statut === 'traitee' ? '#f0fdf4' : r.statut === 'en_cours' ? '#eff6ff' : '#fefce8'} /></div><div style={{ fontSize: 12, color: '#94a3b8', marginBottom: r.reponse ? 10 : 0 }}>{r.date}</div>{r.reponse && <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#1e40af', borderLeft: '3px solid #2563eb' }}><div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>REPONSE DE L ECOLE</div>{r.reponse}</div>}</div>)}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e8edf5', display: 'flex', paddingTop: 6, paddingBottom: 28, zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
          {pTabs.map(t => <button key={t.id} onClick={() => setParentTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: parentTab === t.id ? green : '#94a3b8', padding: '4px 0' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: parentTab === t.id ? '#f0fdf4' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t.id === 'home' && <svg width="16" height="16" viewBox="0 0 24 24" fill={parentTab === t.id ? green : 'none'} stroke={parentTab === t.id ? green : '#94a3b8'} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              {t.id === 'enfant' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={parentTab === t.id ? green : '#94a3b8'} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
              {t.id === 'paiements' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={parentTab === t.id ? green : '#94a3b8'} strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              {t.id === 'reclamations' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={parentTab === t.id ? green : '#94a3b8'} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            </div>
            <span style={{ fontSize: 9, fontWeight: parentTab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>)}
        </div>
      </div>
    );
  }

  return null;
}