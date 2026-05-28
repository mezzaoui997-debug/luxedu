import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://luxedu-production.up.railway.app';


const navy = '#1e2d4f';
const gold = '#C9963F';

const MOROCCAN_HOLIDAYS = [
  { date: '2026-01-01', label: 'Nouvel An', type: 'national' },
  { date: '2026-01-11', label: "Manifeste de l'Independance", type: 'national' },
  { date: '2026-03-30', label: 'Aid Al Fitr (1er jour)', type: 'religieux' },
  { date: '2026-05-01', label: 'Fete du Travail', type: 'national' },
  { date: '2026-06-05', label: 'Aid Al Adha (1er jour)', type: 'religieux' },
  { date: '2026-07-30', label: 'Fete du Trone', type: 'national' },
  { date: '2026-08-20', label: 'Revolution du Roi et du Peuple', type: 'national' },
  { date: '2026-08-21', label: 'Fete de la Jeunesse', type: 'national' },
  { date: '2026-11-06', label: 'Marche Verte', type: 'national' },
  { date: '2026-11-18', label: "Fete de l'Independance", type: 'national' },
];

const SCHOOL_EVENTS = [
  { date: '2026-06-05', label: 'Reunion parents-professeurs', type: 'school' },
  { date: '2026-06-15', label: 'Debut des examens de fin annee', type: 'exam' },
  { date: '2026-06-25', label: 'Dernier jour de cours', type: 'school' },
  { date: '2026-07-10', label: 'Publication des resultats', type: 'result' },
  { date: '2026-05-30', label: 'Journee sportive annuelle', type: 'activity' },
  { date: '2026-06-02', label: "Concours d'eloquence", type: 'activity' },
];

const DEMO_STUDENTS = {
  'OM-2026-001': {
    prenom: 'Omar', nom: 'Moussa', code: 'OM-2026-001',
    niveau: '2eme Bac', classe: 'TCS-A', parentPhone: '0612345678',
    notes: [
      { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 16, date: '10/03/2026' }, { titre: 'Controle 2', valeur: 14, date: '15/04/2026' }], coef: 7 },
      { matiere: 'Physique-Chimie', evaluations: [{ titre: 'Devoir 1', valeur: 14, date: '15/03/2026' }, { titre: 'Controle', valeur: 13, date: '20/04/2026' }], coef: 5 },
      { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 13, date: '20/03/2026' }, { titre: 'Controle', valeur: 15, date: '22/04/2026' }], coef: 3 },
      { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 15, date: '22/03/2026' }, { titre: 'Ecrit', valeur: 16, date: '10/04/2026' }], coef: 2 },
      { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 12, date: '25/03/2026' }, { titre: 'Controle', valeur: 11, date: '28/04/2026' }], coef: 4 },
      { matiere: 'Histoire-Geo', evaluations: [{ titre: 'Controle', valeur: 11, date: '28/03/2026' }], coef: 2 },
      { matiere: 'Education Islamique', evaluations: [{ titre: 'Controle', valeur: 17, date: '02/04/2026' }], coef: 2 },
    ],
    absences: [
      { matiere: 'Mathematiques', date: '08/04/2026', duree: '2h', justifiee: true, motif: 'Certificat medical' },
      { matiere: 'Histoire-Geo', date: '18/04/2026', duree: '1h', justifiee: false },
    ],
    devoirs: [
      { id: 1, titre: 'Exercices sur les integrales', matiere: 'Mathematiques', deadline: '2026-05-30', rendu: false, urgent: true, description: 'Faire les exercices pages 45 a 47 du manuel. Montrer toutes les etapes.', enseignant: 'M. Benali', fichiers: ['Manuel p.45-47'] },
      { id: 2, titre: 'Redaction Mon avenir', matiere: 'Francais', deadline: '2026-05-28', rendu: true, urgent: false, description: 'Redaction de 300 mots minimum sur votre projet professionnel.', enseignant: 'Mme. Cherkaoui', fichiers: [], note: '14/20' },
      { id: 3, titre: 'Rapport TP Electricite', matiere: 'Physique-Chimie', deadline: '2026-06-02', rendu: false, urgent: true, description: 'Rediger le rapport complet du TP sur les circuits electriques.', enseignant: 'M. Idrissi', fichiers: ['Fiche TP'] },
      { id: 4, titre: 'Expose Biodiversite', matiere: 'SVT', deadline: '2026-06-05', rendu: false, urgent: false, description: 'Preparer une presentation de 10 minutes sur la biodiversite au Maroc.', enseignant: 'Mme. Alami', fichiers: [] },
    ],
    activites: [
      { id: 1, titre: 'Club de Mathematiques', jour: 'Mercredi', heure: '14h-16h', salle: 'Salle 12', inscrit: true },
      { id: 2, titre: 'Equipe de Football', jour: 'Vendredi', heure: '15h-17h', salle: 'Terrain', inscrit: true },
      { id: 3, titre: 'Club Theatre', jour: 'Jeudi', heure: '14h-16h', salle: 'Salle polyvalente', inscrit: false },
      { id: 4, titre: 'Club Informatique et IA', jour: 'Mardi', heure: '13h-15h', salle: 'Labo Informatique', inscrit: false },
    ],
    messages: [
      { id: 1, expediteur: 'M. Benali', matiere: 'Mathematiques', texte: "N'oubliez pas les exercices sur les integrales pour vendredi.", date: '25/05/2026', heure: '14:30', lu: false },
      { id: 2, expediteur: 'Mme. Cherkaoui', matiere: 'Francais', texte: 'Tres bonne redaction Omar, continuez ainsi!', date: '24/05/2026', heure: '10:15', lu: true },
      { id: 3, expediteur: 'Direction', matiere: 'Administration', texte: 'Rappel: Reunion parents-professeurs le 5 juin a 18h.', date: '23/05/2026', heure: '09:00', lu: true },
    ],
    paiements: [
      { mois: 'Mai 2026', montant: 1200, statut: 'paye', date: '02/05/2026', methode: 'Virement' },
      { mois: 'Avril 2026', montant: 1200, statut: 'paye', date: '01/04/2026', methode: 'Especes' },
      { mois: 'Juin 2026', montant: 1200, statut: 'en_attente', date: null, methode: null },
    ],
  },
  'YB-2026-002': {
    prenom: 'Youssef', nom: 'Benjelloun', code: 'YB-2026-002',
    niveau: '1ere Bac', classe: 'TC-B', parentPhone: '0698765432',
    notes: [
      { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 11, date: '10/03/2026' }], coef: 6 },
      { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 15, date: '15/03/2026' }], coef: 3 },
      { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 16, date: '20/03/2026' }], coef: 2 },
      { matiere: 'Histoire-Geo', evaluations: [{ titre: 'Controle', valeur: 14, date: '22/03/2026' }], coef: 2 },
      { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 10, date: '25/03/2026' }], coef: 3 },
    ],
    absences: [],
    devoirs: [
      { id: 1, titre: 'Expose Histoire du Maroc', matiere: 'Histoire-Geo', deadline: '2026-05-29', rendu: false, urgent: true, description: 'Presentation PowerPoint de 10 diapositives sur le Maroc moderne.', enseignant: 'M. Tahiri', fichiers: [] },
    ],
    activites: [
      { id: 1, titre: 'Club Informatique et IA', jour: 'Mardi', heure: '13h-15h', salle: 'Labo Informatique', inscrit: true },
      { id: 2, titre: 'Club de Mathematiques', jour: 'Mercredi', heure: '14h-16h', salle: 'Salle 12', inscrit: false },
    ],
    messages: [
      { id: 1, expediteur: 'M. Tahiri', matiere: 'Histoire-Geo', texte: 'Preparez bien votre expose pour la semaine prochaine.', date: '25/05/2026', heure: '11:00', lu: false },
    ],
    paiements: [
      { mois: 'Mai 2026', montant: 1200, statut: 'paye', date: '05/05/2026', methode: 'Especes' },
      { mois: 'Juin 2026', montant: 1200, statut: 'en_retard', date: null, methode: null },
    ],
  },
};

const DEMO_PARENTS = {
  '0612345678': { prenom: 'Hassan', nom: 'Moussa', phone: '0612345678', enfants: ['OM-2026-001'] },
  '0698765432': { prenom: 'Ahmed', nom: 'Benjelloun', phone: '0698765432', enfants: ['YB-2026-002'] },
};

function matiereAvg(m) {
  return (m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length).toFixed(1);
}

function globalAvg(student) {
  let total = 0, coefTotal = 0;
  student.notes.forEach(m => {
    const avg = m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length;
    total += avg * m.coef; coefTotal += m.coef;
  });
  return (total / coefTotal).toFixed(2);
}

function getOrientation(student) {
  const findAvg = (kw) => { const ms = student.notes.filter(m => kw.some(k => m.matiere.includes(k))); return ms.length ? ms.reduce((a, m) => a + parseFloat(matiereAvg(m)), 0) / ms.length : 0; };
  const mathAvg = findAvg(['Math']); const sciAvg = findAvg(['Physique', 'SVT']); const langAvg = findAvg(['Franc', 'Anglais']);
  if (mathAvg >= 14 && sciAvg >= 13) return { filiere: 'Sciences et Ingenierie', color: '#2563eb', bg: '#eff6ff', pct: 95, desc: "Excellence en Maths et Sciences. Les grandes ecoles d'ingenieurs vous sont accessibles." };
  if (langAvg >= 14) return { filiere: 'Lettres et Sciences Humaines', color: '#7c3aed', bg: '#f5f3ff', pct: 88, desc: 'Maitrise remarquable des langues. Les filieres litteraires vous correspondent.' };
  return { filiere: 'Economie et Gestion', color: '#059669', bg: '#ecfdf5', pct: 80, desc: 'Profil equilibre oriente vers les filieres economiques.' };
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(dateStr) {
  const days = daysUntil(dateStr);
  const formatted = new Date(dateStr).toLocaleDateString('fr-FR');
  if (days < 0) return { text: 'En retard', color: '#dc2626', formatted };
  if (days === 0) return { text: "Aujourd'hui", color: '#dc2626', formatted };
  if (days <= 3) return { text: `Dans ${days} jours`, color: '#d97706', formatted };
  return { text: `Dans ${days} jours`, color: '#64748b', formatted };
}

function getUpcomingEvents() {
  return [...MOROCCAN_HOLIDAYS.map(e => ({ ...e, category: 'Jour ferie' })), ...SCHOOL_EVENTS.map(e => ({ ...e, category: 'Evenement scolaire' }))]
    .filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 8);
}

function Avatar({ name, size = 36, bg = gold }) {
  return <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: 'white', flexShrink: 0 }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>;
}

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>;
}

function NoteBar({ label, value, coef }) {
  const color = value >= 16 ? '#059669' : value >= 12 ? '#2563eb' : value >= 10 ? '#d97706' : '#dc2626';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <div><span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{label}</span>{coef && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>coef. {coef}</span>}</div>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: (value / 20 * 100) + '%', background: color, borderRadius: 4, transition: 'width .8s ease' }} />
      </div>
    </div>
  );
}

const inp = { width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fafafa', fontFamily: 'inherit' };

export default function MobileApp() {
  const [screen, setScreen] = useState('home');
  const [studentCode, setStudentCode] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentPass, setParentPass] = useState('');
  const [error, setError] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentParent, setCurrentParent] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activites, setActivites] = useState(null);
  const [reclamationSujet, setReclamationSujet] = useState('');
  const [reclamationTexte, setReclamationTexte] = useState('');
  const [reclamations, setReclamations] = useState([
    { id: 1, sujet: 'Absence injustifiee du 18/04', date: '20/05/2026', statut: 'traitee', reponse: "Apres verification, l'absence a ete enregistree correctement." },
    { id: 2, sujet: 'Note de controle SVT', date: '22/05/2026', statut: 'en_attente', reponse: null },
  ]);
  const [recSuccess, setRecSuccess] = useState(false);
  const [tawjihTab, setTawjihTab] = useState('orientation');
  const [selectedEnfantIdx, setSelectedEnfantIdx] = useState(0);

  async function loginStudent() {
    setError('');
    if (!studentCode.trim() || !studentPass.trim()) { setError('Remplissez tous les champs'); return; }
    try {
      const res = await fetch(API + '/api/student/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: studentCode.toUpperCase(), password: studentPass })
      });
      const data = await res.json();
      if (!res.ok) {
        // Fallback to demo data if API fails
        const s = DEMO_STUDENTS[studentCode.toUpperCase()];
        if (s && studentPass === '1234') {
          setCurrentStudent(s); setMessages([...s.messages]); setActivites([...s.activites]);
          setScreen('student-dash'); setActiveTab('home'); return;
        }
        setError(data.message || 'Code ou mot de passe incorrect'); return;
      }
      if (data.mustSetPassword) {
        setError('Premiere connexion — veuillez definir votre mot de passe sur luxeduschool.com/etudiant'); return;
      }
      // Merge API data with demo data for missing fields
      const demoStudent = DEMO_STUDENTS[studentCode.toUpperCase()] || {};
      const merged = {
        prenom: data.student.prenom || demoStudent.prenom,
        nom: data.student.nom || demoStudent.nom,
        code: data.student.code || studentCode.toUpperCase(),
        niveau: data.student.niveau || demoStudent.niveau,
        classe: data.student.classe || demoStudent.classe,
        notes: data.student.notes?.length > 0 ? data.student.notes.map(n => ({
          matiere: n.matiere, evaluations: [{ titre: n.type || 'Evaluation', valeur: n.valeur, date: n.date || '' }], coef: 1
        })) : (demoStudent.notes || []),
        absences: data.student.absences || demoStudent.absences || [],
        devoirs: demoStudent.devoirs || [],
        activites: demoStudent.activites || [],
        messages: demoStudent.messages || [],
        paiements: demoStudent.paiements || [],
        parentPhone: demoStudent.parentPhone || '',
      };
      setCurrentStudent(merged);
      setMessages([...(demoStudent.messages || [])]);
      setActivites([...(demoStudent.activites || [])]);
      setScreen('student-dash'); setActiveTab('home');
    } catch (err) {
      // Network error - fallback to demo
      const s = DEMO_STUDENTS[studentCode.toUpperCase()];
      if (s && studentPass === '1234') {
        setCurrentStudent(s); setMessages([...s.messages]); setActivites([...s.activites]);
        setScreen('student-dash'); setActiveTab('home'); return;
      }
      setError('Erreur de connexion. Verifiez votre connexion internet.');
    }
  }

  async function loginParent() {
    setError('');
    if (!parentPhone.trim() || !parentPass.trim()) { setError('Remplissez tous les champs'); return; }
    try {
      const res = await fetch(API + '/api/parent/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: parentPhone, password: parentPass })
      });
      if (!res.ok) {
        // Fallback to demo
        const p = DEMO_PARENTS[parentPhone];
        if (p && parentPass === '1234') {
          setCurrentParent(p); setScreen('parent-dash'); setActiveTab('home'); setSelectedEnfantIdx(0); return;
        }
        const data = await res.json();
        setError(data.message || 'Numero ou mot de passe incorrect'); return;
      }
      const data = await res.json();
      const p = DEMO_PARENTS[parentPhone] || { prenom: data.prenom || 'Parent', nom: data.nom || '', phone: parentPhone, enfants: ['OM-2026-001'] };
      setCurrentParent(p); setScreen('parent-dash'); setActiveTab('home'); setSelectedEnfantIdx(0);
    } catch (err) {
      const p = DEMO_PARENTS[parentPhone];
      if (p && parentPass === '1234') {
        setCurrentParent(p); setScreen('parent-dash'); setActiveTab('home'); setSelectedEnfantIdx(0); return;
      }
      setError('Erreur de connexion. Verifiez votre connexion internet.');
    }
  }

  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: `linear-gradient(160deg, ${navy} 0%, #162340 60%, #0f1929 100%)`, padding: '64px 28px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,63,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 120, width: 'auto', filter: 'drop-shadow(0 8px 40px rgba(201,150,63,0.6))' }} onError={e => e.target.style.display = 'none'} />
        </div>
        <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '.2em', textTransform: 'uppercase' }}>PLATEFORME SCOLAIRE</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 32, height: 1, background: 'rgba(201,150,63,0.4)' }} />
          <div style={{ fontSize: 12, color: gold, letterSpacing: '.15em', fontWeight: 600 }}>MAROC</div>
          <div style={{ width: 32, height: 1, background: 'rgba(201,150,63,0.4)' }} />
        </div>
      </div>
      </div>
      <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Selectionnez votre espace</div>
        {[
          { s: 'student-login', icon: 'M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z M12 4 a4 4 0 1 0 0 8 a4 4 0 0 0 0-8z', bg: '#eff6ff', sc: '#2563eb', title: 'Espace Etudiant', desc: 'Notes · Devoirs · Absences · Tawjih · Messagerie · Activites' },
          { s: 'parent-login', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3 a4 4 0 1 0 0 8 a4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', bg: '#f0fdf4', sc: '#059669', title: 'Espace Parent', desc: 'Suivi · Paiements · Reclamations · Agenda' },
        ].map((item, i) => (
          <button key={i} onClick={() => { setScreen(item.s); setError(''); }} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 52, height: 52, background: item.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.sc} strokeWidth="1.5"><path d={item.icon} /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: navy }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{item.desc}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#cbd5e1' }}>2026 LuxEdu Casablanca, Maroc v1.0</div>
        </div>
      </div>
    </div>
  );

  if (screen === 'student-login' || screen === 'parent-login') {
    const isS = screen === 'student-login';
    const color = isS ? navy : '#059669';
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: color, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { setScreen('home'); setError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 28, width: 'auto' }} onError={e => e.target.style.display = 'none'} />
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{isS ? 'Espace Etudiant' : 'Espace Parent'}</span>
        </div>
        <div style={{ padding: '32px 24px' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: navy, marginBottom: 4 }}>Connexion {isS ? 'Etudiant' : 'Parent'}</div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>{isS ? 'Entrez votre code unique et mot de passe' : 'Accedez au suivi de vos enfants'}</div>
          <div style={{ background: isS ? '#eff6ff' : '#f0fdf4', border: `1px solid ${isS ? '#bfdbfe' : '#bbf7d0'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 24, fontSize: 13, color: isS ? '#2563eb' : '#059669' }}>
            Demo {isS ? 'Code: OM-2026-001' : 'Tel: 0612345678'} Mot de passe: 1234
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{isS ? 'CODE ETUDIANT' : 'TELEPHONE'}</label>
              <input style={inp} placeholder={isS ? 'OM-2026-001' : '0612345678'} value={isS ? studentCode : parentPhone} onChange={e => isS ? setStudentCode(e.target.value) : setParentPhone(e.target.value)} onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>MOT DE PASSE</label>
              <input style={inp} type="password" placeholder="..." value={isS ? studentPass : parentPass} onChange={e => isS ? setStudentPass(e.target.value) : setParentPass(e.target.value)} onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = '#e2e8f0'} onKeyDown={e => e.key === 'Enter' && (isS ? loginStudent() : loginParent())} />
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{error}</div>}
            <button style={{ width: '100%', padding: '14px', borderRadius: 10, background: color, color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={isS ? loginStudent : loginParent}>Acceder a mon espace</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'student-dash' && currentStudent) {
    const s = currentStudent;
    const avg = globalAvg(s);
    const orientation = getOrientation(s);
    const unread = messages.filter(m => !m.lu).length;
    const upcomingEvents = getUpcomingEvents();

    if (selectedDevoir) return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedDevoir(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Detail du devoir</span>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, border: `2px solid ${selectedDevoir.rendu ? '#bbf7d0' : selectedDevoir.urgent ? '#fecaca' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 4 }}>{selectedDevoir.titre}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selectedDevoir.matiere} {selectedDevoir.enseignant}</div>
              </div>
              <Badge label={selectedDevoir.rendu ? 'Rendu' : selectedDevoir.urgent ? 'Urgent' : 'En attente'} color={selectedDevoir.rendu ? '#059669' : selectedDevoir.urgent ? '#dc2626' : '#d97706'} bg={selectedDevoir.rendu ? '#f0fdf4' : selectedDevoir.urgent ? '#fef2f2' : '#fefce8'} />
            </div>
            {(() => { const dl = formatDeadline(selectedDevoir.deadline); return <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}><span style={{ fontSize: 13, color: dl.color, fontWeight: 600 }}>A rendre le {dl.formatted} {dl.text}</span></div>; })()}
            <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Instructions</div>
            <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>{selectedDevoir.description}</div>
            {selectedDevoir.fichiers?.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Documents</div>
                {selectedDevoir.fichiers.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', borderRadius: 10, padding: '10px 14px' }}><span style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>{f}</span></div>)}
              </div>
            )}
            {selectedDevoir.note && <div style={{ marginTop: 14, background: '#f0fdf4', borderRadius: 12, padding: '16px', border: '1px solid #bbf7d0', textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: 4 }}>Note obtenue</div><div style={{ fontSize: 32, fontWeight: 700, color: '#059669' }}>{selectedDevoir.note}</div></div>}
          </div>
        </div>
      </div>
    );

    if (selectedMatiere) return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedMatiere(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{selectedMatiere.matiere}</span>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Moyenne</div><div style={{ fontSize: 32, fontWeight: 700 }}>{matiereAvg(selectedMatiere)}<span style={{ fontSize: 14, fontWeight: 400 }}>/20</span></div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Coefficient</div><div style={{ fontSize: 28, fontWeight: 700 }}>{selectedMatiere.coef}</div></div>
          </div>
          {selectedMatiere.evaluations.map((ev, i) => {
            const color = ev.valeur >= 16 ? '#059669' : ev.valeur >= 12 ? '#2563eb' : ev.valeur >= 10 ? '#d97706' : '#dc2626';
            return (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div><div style={{ fontSize: 15, fontWeight: 600, color: navy }}>{ev.titre}</div><div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{ev.date}</div></div>
                  <div style={{ fontSize: 26, fontWeight: 700, color }}>{ev.valeur}<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>/20</span></div>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (ev.valeur / 20 * 100) + '%', background: color, borderRadius: 4 }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    );

    const tabs = [
      { id: 'home', label: 'Accueil' },
      { id: 'notes', label: 'Notes' },
      { id: 'devoirs', label: 'Devoirs' },
      { id: 'activites', label: 'Activites' },
      { id: 'messages', label: 'Messages' },
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: navy, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, paddingTop: 52, paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 32, width: 'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{s.prenom} {s.nom}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{s.niveau} · {s.classe}</div>
            </div>
            <Avatar name={s.prenom + ' ' + s.nom} size={34} bg={gold} />
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 16, padding: '20px', color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Annee scolaire 2025-2026</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Bonjour, {s.prenom}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20', good: parseFloat(avg) >= 10 }, { label: 'Absences', value: s.absences.length + 'h', good: s.absences.length < 4 }, { label: 'Devoirs', value: s.devoirs.filter(d => !d.rendu).length, good: true }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: item.good ? '#4ade80' : '#f87171' }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: orientation.bg, borderRadius: 14, padding: 16, border: `1px solid ${orientation.color}25` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Orientation IA</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 6 }}>{orientation.filiere}</div>
                <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: orientation.pct + '%', background: orientation.color, borderRadius: 4 }} /></div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Compatibilite <strong style={{ color: orientation.color }}>{orientation.pct}%</strong></div>
                <button onClick={() => setActiveTab('tawjih')} style={{ background: orientation.color, color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Voir les etablissements</button>
              </div>

              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Prochains evenements</div>
                {upcomingEvents.slice(0, 3).map((ev, i) => {
                  const days = daysUntil(ev.date);
                  const typeColor = { national: '#2563eb', religieux: '#d97706', exam: '#dc2626', activity: '#059669', school: '#7c3aed', result: '#059669' }[ev.type] || '#64748b';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 40, height: 40, background: '#f8fafc', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: typeColor, lineHeight: 1 }}>{new Date(ev.date).getDate()}</div>
                        <div style={{ fontSize: 9, color: typeColor }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{days <= 0 ? "Aujourd'hui" : `Dans ${days} jours`}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Prochains devoirs</div>
                {s.devoirs.filter(d => !d.rendu).slice(0, 3).map((d, i) => {
                  const dl = formatDeadline(d.deadline);
                  return (
                    <button key={i} onClick={() => setSelectedDevoir(d)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none', textAlign: 'left' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.urgent ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: navy }}>{d.titre}</div><div style={{ fontSize: 11, color: dl.color, fontWeight: 500 }}>{d.matiere} {dl.text}</div></div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  );
                })}
              </div>

              {unread > 0 && <button onClick={() => setActiveTab('messages')} style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e', flex: 1 }}>{unread} message(s) non lu(s)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>}
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: navy, borderRadius: 14, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Moyenne generale</div><div style={{ fontSize: 30, fontWeight: 700 }}>{avg}<span style={{ fontSize: 14, fontWeight: 400 }}>/20</span></div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.notes.length} matieres</div><div style={{ fontSize: 13, color: parseFloat(avg) >= 10 ? '#4ade80' : '#f87171', marginTop: 2, fontWeight: 600 }}>{parseFloat(avg) >= 10 ? 'Satisfaisant' : 'A ameliorer'}</div></div>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', padding: '2px 0' }}>Appuyez sur une matiere pour le detail</div>
              {s.notes.map((m, i) => {
                const a = parseFloat(matiereAvg(m));
                const color = a >= 16 ? '#059669' : a >= 12 ? '#2563eb' : a >= 10 ? '#d97706' : '#dc2626';
                return (
                  <button key={i} onClick={() => setSelectedMatiere(m)} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{m.matiere}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Coef. {m.coef} {m.evaluations.length} eval.</div></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ fontSize: 20, fontWeight: 700, color }}>{a}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></div>
                    </div>
                    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (a / 20 * 100) + '%', background: color, borderRadius: 4 }} /></div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'devoirs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 4 }}>
                {[{ label: 'En attente', value: s.devoirs.filter(d => !d.rendu).length, color: '#d97706', bg: '#fffbeb' }, { label: 'Rendus', value: s.devoirs.filter(d => d.rendu).length, color: '#059669', bg: '#f0fdf4' }, { label: 'Urgents', value: s.devoirs.filter(d => !d.rendu && d.urgent).length, color: '#dc2626', bg: '#fef2f2' }].map((item, i) => (
                  <div key={i} style={{ background: item.bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center', border: `1px solid ${item.color}15` }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Appuyez pour voir les details</div>
              {s.devoirs.map((d, i) => {
                const dl = formatDeadline(d.deadline);
                return (
                  <button key={i} onClick={() => setSelectedDevoir(d)} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${d.rendu ? '#dcfce7' : d.urgent ? '#fecaca' : '#f1f5f9'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.rendu ? '#059669' : d.urgent ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: navy }}>{d.titre}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{d.matiere} {d.enseignant}</div>
                        <div style={{ fontSize: 12, color: dl.color, fontWeight: 500 }}>{dl.text} {dl.formatted}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 10 }}>
                        <Badge label={d.rendu ? 'Rendu' : d.urgent ? 'Urgent' : 'En attente'} color={d.rendu ? '#059669' : d.urgent ? '#dc2626' : '#d97706'} bg={d.rendu ? '#f0fdf4' : d.urgent ? '#fef2f2' : '#fefce8'} />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'activites' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 4 }}>Clubs et Activites parascolaires</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>Appuyez pour vous inscrire ou desinscrire</div>
                {activites && activites.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < activites.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <div style={{ width: 44, height: 44, background: a.inscrit ? '#eff6ff' : '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a.inscrit ? '#2563eb' : '#94a3b8'} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{a.titre}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{a.jour} {a.heure} {a.salle}</div>
                    </div>
                    <button onClick={() => setActivites(prev => prev.map(act => act.id === a.id ? { ...act, inscrit: !act.inscrit } : act))} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: a.inscrit ? '#fef2f2' : '#f0fdf4', color: a.inscrit ? '#dc2626' : '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                      {a.inscrit ? 'Quitter' : "S'inscrire"}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 4 }}>Agenda conges et evenements</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>Jours feries nationaux et evenements scolaires</div>
                {upcomingEvents.map((ev, i) => {
                  const days = daysUntil(ev.date);
                  const typeColor = { national: '#2563eb', religieux: '#d97706', exam: '#dc2626', activity: '#059669', school: '#7c3aed', result: '#059669' }[ev.type] || '#64748b';
                  const typeBg = { national: '#eff6ff', religieux: '#fffbeb', exam: '#fef2f2', activity: '#f0fdf4', school: '#f5f3ff', result: '#f0fdf4' }[ev.type] || '#f8fafc';
                  const typeLabel = { national: 'Ferie national', religieux: 'Ferie religieux', exam: 'Examen', activity: 'Activite', school: 'Scolaire', result: 'Resultats' }[ev.type] || '';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < upcomingEvents.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 46, height: 46, background: typeBg, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${typeColor}20` }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: typeColor, lineHeight: 1 }}>{new Date(ev.date).getDate()}</div>
                        <div style={{ fontSize: 10, color: typeColor, fontWeight: 600 }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <span style={{ fontSize: 11, background: typeBg, color: typeColor, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{typeLabel}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>Dans {days}j</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 4 }}>Messages des enseignants</div>
              {messages.map((m, i) => (
                <button key={i} onClick={() => { setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, lu: true } : msg)); setSelectedMessage(m); }} style={{ background: m.lu ? 'white' : '#f0f7ff', borderRadius: 12, padding: '14px 16px', border: `1px solid ${m.lu ? '#f1f5f9' : '#bfdbfe'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
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
              {selectedMessage && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 32px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={selectedMessage.expediteur} size={40} bg={navy} />
                        <div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>{selectedMessage.expediteur}</div><div style={{ fontSize: 12, color: '#64748b' }}>{selectedMessage.matiere} {selectedMessage.date}</div></div>
                      </div>
                      <button onClick={() => setSelectedMessage(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                    <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, background: '#f8fafc', borderRadius: 12, padding: '16px', marginBottom: 16 }}>{selectedMessage.texte}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input style={{ ...inp, flex: 1, fontSize: 14 }} placeholder="Repondre..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                      <button onClick={() => { if (!newMessage.trim()) return; setMessages(prev => [...prev, { id: Date.now(), expediteur: 'Moi', matiere: selectedMessage.matiere, texte: newMessage, date: new Date().toLocaleDateString('fr-FR'), heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), lu: true }]); setNewMessage(''); setSelectedMessage(null); }} style={{ padding: '12px 16px', background: navy, border: 'none', borderRadius: 10, cursor: 'pointer', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tawjih' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 14, padding: '20px', color: 'white' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Portail Orientation</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Tawjih</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.niveau} Premiere plateforme IA Maroc</div>
              </div>
              <div style={{ background: orientation.bg, borderRadius: 12, padding: 16, border: `1px solid ${orientation.color}30` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Recommandation IA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 8 }}>{orientation.filiere}</div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: orientation.pct + '%', background: orientation.color, borderRadius: 4 }} /></div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{orientation.desc}</div>
              </div>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
                {['orientation', 'concours', 'maroc', 'international'].map(t => (
                  <button key={t} onClick={() => setTawjihTab(t)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', background: tawjihTab === t ? 'white' : 'transparent', color: tawjihTab === t ? navy : '#94a3b8', fontSize: 11, fontWeight: tawjihTab === t ? 700 : 400, cursor: 'pointer', boxShadow: tawjihTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                    {t === 'orientation' ? 'Mon profil' : t === 'concours' ? 'Concours' : t === 'maroc' ? 'Maroc' : 'Monde'}
                  </button>
                ))}
              </div>
              {tawjihTab === 'orientation' && <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>{s.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}</div>}
              {tawjihTab === 'concours' && [
                { nom: 'Concours CPGE', desc: 'Classes Preparatoires Grandes Ecoles', url: 'https://cpge.ma', deadline: '30 Juin 2026' },
                { nom: 'Concours ENSA', desc: 'Ecoles Nationales Sciences Appliquees', url: 'https://ensa.ac.ma', deadline: '15 Juillet 2026' },
                { nom: 'Concours ENCG', desc: 'Ecoles Commerce et Gestion', url: 'https://encg.ac.ma', deadline: '20 Juillet 2026' },
                { nom: 'Portail Massar MEN', desc: 'Orientation officielle post-bac', url: 'https://men.gov.ma', deadline: 'Apres resultats' },
                { nom: 'Campus France Maroc', desc: 'Etudes superieures en France', url: 'https://maroc.campusfrance.org', deadline: '15 Mars 2026' },
              ].map((c, i) => (
                <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{c.nom}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.desc}</div><div style={{ fontSize: 11, color: '#d97706', fontWeight: 600, marginTop: 4 }}>Deadline: {c.deadline}</div></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </a>
              ))}
              {tawjihTab === 'maroc' && [
                { name: 'Universite Mohammed V', field: 'Pluridisciplinaire', city: 'Rabat', url: 'https://um5.ac.ma' },
                { name: 'ENCG Casablanca', field: 'Commerce et Gestion', city: 'Casablanca', url: 'https://encg-casa.ma' },
                { name: 'ENSA Marrakech', field: 'Ingenierie', city: 'Marrakech', url: 'https://ensa.uca.ma' },
                { name: 'INPT Rabat', field: 'Telecommunications', city: 'Rabat', url: 'https://inpt.ac.ma' },
              ].map((u, i) => (
                <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{u.name}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{u.field} {u.city}</div></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </a>
              ))}
              {tawjihTab === 'international' && [
                { name: 'Sorbonne Universite', country: 'France', rank: '#83 mondial', url: 'https://sorbonne-universite.fr' },
                { name: 'HEC Paris', country: 'France', rank: '#1 Business', url: 'https://hec.edu' },
                { name: 'Universite de Montreal', country: 'Canada', rank: 'Top 100', url: 'https://umontreal.ca' },
                { name: 'McGill University', country: 'Canada', rank: '#46 mondial', url: 'https://mcgill.ca' },
              ].map((u, i) => (
                <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{u.name}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{u.country} <span style={{ color: '#d97706', fontWeight: 600 }}>{u.rank}</span></div></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', padding: '8px 0 20px', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          {[
            { id: 'home', label: 'Accueil', path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
            { id: 'notes', label: 'Notes', path: 'M22 12h-4l-3 9L9 3l-3 9H2' },
            { id: 'devoirs', label: 'Devoirs', path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
            { id: 'activites', label: 'Agenda', path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
            { id: 'messages', label: 'Messages', path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
          ].map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSelectedDevoir(null); setSelectedMatiere(null); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === t.id ? navy : '#94a3b8', padding: '4px 0', position: 'relative' }}>
              {t.id === 'messages' && unread > 0 && <div style={{ position: 'absolute', top: 2, right: '20%', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid white' }} />}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === t.id ? 2.5 : 1.8}><path d={t.path} strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400, letterSpacing: '.02em' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'parent-dash' && currentParent) {
    const p = currentParent;
    const enfantsData = p.enfants.map(code => DEMO_STUDENTS[code]).filter(Boolean);
    const enfant = enfantsData[selectedEnfantIdx] || enfantsData[0];
    const upcomingEvents = getUpcomingEvents();

    const parentTabs = [
      { id: 'home', label: 'Accueil' },
      { id: 'enfants', label: 'Enfants' },
      { id: 'paiements', label: 'Paiements' },
      { id: 'reclamations', label: 'Reclamations' },
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: '#059669', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, paddingTop: 52, paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 32, width: 'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{p.prenom} {p.nom}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{enfantsData.length} enfant(s)</div>
            </div>
            <Avatar name={p.prenom + ' ' + p.nom} size={34} bg="rgba(255,255,255,0.25)" />
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#059669', borderRadius: 16, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Tableau de bord parent</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Bonjour, {p.prenom}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Enfants', value: enfantsData.length }, { label: 'Absences', value: enfantsData.reduce((a, e) => a + e.absences.length, 0) + 'h' }, { label: 'Impayes', value: enfantsData.reduce((a, e) => a + e.paiements.filter(p => p.statut !== 'paye').length, 0) }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {enfantsData.some(e => e.paiements.some(p => p.statut === 'en_retard')) && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Paiement en retard</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Un paiement necessite votre attention</div></div>
                  <button onClick={() => setActiveTab('paiements')} style={{ background: '#dc2626', border: 'none', borderRadius: 8, color: 'white', padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Voir</button>
                </div>
              )}

              {enfantsData.map((e, i) => (
                <button key={i} onClick={() => { setSelectedEnfantIdx(i); setActiveTab('enfants'); }} style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={e.prenom + ' ' + e.nom} size={42} bg={navy} />
                      <div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>{e.prenom} {e.nom}</div><div style={{ fontSize: 12, color: '#64748b' }}>{e.niveau} {e.classe}</div></div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[{ label: 'Moyenne', value: globalAvg(e) + '/20', color: parseFloat(globalAvg(e)) >= 10 ? '#059669' : '#dc2626' }, { label: 'Absences', value: e.absences.length + 'h', color: '#d97706' }, { label: 'Devoirs', value: e.devoirs.filter(d => !d.rendu).length, color: '#2563eb' }].map((s, j) => (
                      <div key={j} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}

              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Prochains evenements</div>
                {upcomingEvents.slice(0, 3).map((ev, i) => {
                  const days = daysUntil(ev.date);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 36, height: 36, background: '#f0fdf4', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', lineHeight: 1 }}>{new Date(ev.date).getDate()}</div>
                        <div style={{ fontSize: 9, color: '#059669' }}>{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: navy }}>{ev.label}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Dans {days} jours</div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'enfants' && enfant && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enfantsData.length > 1 && (
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 3 }}>
                  {enfantsData.map((e, i) => <button key={i} onClick={() => setSelectedEnfantIdx(i)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: selectedEnfantIdx === i ? 'white' : 'transparent', color: selectedEnfantIdx === i ? navy : '#94a3b8', fontSize: 13, fontWeight: selectedEnfantIdx === i ? 700 : 400, cursor: 'pointer' }}>{e.prenom}</button>)}
                </div>
              )}
              <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{enfant.prenom} {enfant.nom}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 14 }}>{enfant.niveau} {enfant.classe}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: globalAvg(enfant) + '/20' }, { label: 'Absences', value: enfant.absences.length + 'h' }, { label: 'Devoirs att.', value: enfant.devoirs.filter(d => !d.rendu).length }].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 14 }}>Notes par matiere</div>
                {enfant.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}
              </div>
              {enfant.absences.length > 0 && (
                <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Absences</div>
                  {enfant.absences.map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < enfant.absences.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div><div style={{ fontSize: 13, fontWeight: 500, color: navy }}>{a.matiere}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{a.date} {a.duree}</div></div>
                      <Badge label={a.justifiee ? 'Justifiee' : 'Non justifiee'} color={a.justifiee ? '#059669' : '#dc2626'} bg={a.justifiee ? '#f0fdf4' : '#fef2f2'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'paiements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enfantsData.length > 1 && (
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 3 }}>
                  {enfantsData.map((e, i) => <button key={i} onClick={() => setSelectedEnfantIdx(i)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: selectedEnfantIdx === i ? 'white' : 'transparent', color: selectedEnfantIdx === i ? navy : '#94a3b8', fontSize: 13, fontWeight: selectedEnfantIdx === i ? 700 : 400, cursor: 'pointer' }}>{e.prenom}</button>)}
                </div>
              )}
              {(() => {
                const paiements = enfant.paiements;
                const totalPaye = paiements.filter(p => p.statut === 'paye').reduce((a, p) => a + p.montant, 0);
                const totalDu = paiements.length * 1200;
                return (
                  <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Paiements {enfant.prenom}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{totalPaye.toLocaleString()} MAD</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>payes sur {totalDu.toLocaleString()} MAD</div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (totalPaye / totalDu * 100) + '%', background: '#4ade80', borderRadius: 4 }} /></div>
                  </div>
                );
              })()}
              {enfant.paiements.map((p, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${p.statut === 'paye' ? '#dcfce7' : p.statut === 'en_retard' ? '#fecaca' : '#fef9c3'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: p.statut !== 'paye' ? 10 : 0 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>{p.mois}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{p.statut === 'paye' ? `Paye le ${p.date} par ${p.methode}` : p.statut === 'en_retard' ? 'Paiement en retard' : 'Echeance a venir'}</div></div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: navy }}>{p.montant.toLocaleString()} MAD</div>
                      <Badge label={p.statut === 'paye' ? 'Paye' : p.statut === 'en_retard' ? 'En retard' : 'En attente'} color={p.statut === 'paye' ? '#059669' : p.statut === 'en_retard' ? '#dc2626' : '#d97706'} bg={p.statut === 'paye' ? '#f0fdf4' : p.statut === 'en_retard' ? '#fef2f2' : '#fefce8'} />
                    </div>
                  </div>
                  {p.statut !== 'paye' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Payer via :</div>
                      <a href="https://www.cmi.co.ma" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, background: p.statut === 'en_retard' ? '#dc2626' : '#059669', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Payer par carte CMI</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Visa / Mastercard / CIH / Attijariwafa / BMCE</div>
                        </div>
                      </a>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={navy} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>Virement bancaire</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[
                            { label: 'Banque', value: 'Attijariwafa Bank' },
                            { label: 'Beneficiaire', value: 'LuxEdu Excellence' },
                            { label: 'RIB', value: '007 780 0000123456789012 26' },
                            { label: 'Motif', value: `Scolarite ${p.mois} - ${enfant.prenom} ${enfant.nom}` },
                          ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none' }}>
                              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{item.label}</span>
                              <span style={{ fontSize: 12, color: navy, fontWeight: 600, fontFamily: idx === 2 ? 'monospace' : 'inherit' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { navigator.clipboard?.writeText('007 780 0000123456789012 26'); }} style={{ marginTop: 10, background: navy, color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                          Copier le RIB
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reclamations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 12 }}>Nouvelle reclamation</div>
                {recSuccess && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#059669', marginBottom: 10 }}>Reclamation envoyee. Reponse sous 48h.</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input style={inp} placeholder="Sujet de la reclamation" value={reclamationSujet} onChange={e => setReclamationSujet(e.target.value)} onFocus={e => e.target.style.borderColor = '#059669'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <textarea style={{ ...inp, minHeight: 90, resize: 'none' }} placeholder="Decrivez votre reclamation..." value={reclamationTexte} onChange={e => setReclamationTexte(e.target.value)} onFocus={e => e.target.style.borderColor = '#059669'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <button style={{ width: '100%', padding: '14px', borderRadius: 10, background: '#059669', color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={() => { if (!reclamationSujet.trim() || !reclamationTexte.trim()) return; setReclamations(prev => [{ id: Date.now(), sujet: reclamationSujet, date: new Date().toLocaleDateString('fr-FR'), statut: 'en_attente', reponse: null }, ...prev]); setReclamationSujet(''); setReclamationTexte(''); setRecSuccess(true); setTimeout(() => setRecSuccess(false), 4000); }}>Envoyer la reclamation</button>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: navy }}>Historique</div>
              {reclamations.map((r, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: navy, flex: 1 }}>{r.sujet}</div>
                    <Badge label={r.statut === 'traitee' ? 'Traitee' : r.statut === 'en_cours' ? 'En cours' : 'En attente'} color={r.statut === 'traitee' ? '#059669' : r.statut === 'en_cours' ? '#2563eb' : '#d97706'} bg={r.statut === 'traitee' ? '#f0fdf4' : r.statut === 'en_cours' ? '#eff6ff' : '#fefce8'} />
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: r.reponse ? 10 : 0 }}>{r.date}</div>
                  {r.reponse && <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#1e40af', borderLeft: '3px solid #2563eb' }}><div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>REPONSE DE L'ECOLE</div>{r.reponse}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', padding: '8px 0 20px', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          {[
            { id: 'home', label: 'Accueil', path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
            { id: 'enfants', label: 'Enfants', path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
            { id: 'paiements', label: 'Paiements', path: 'M1 4h22v16H1z M1 10h22' },
            { id: 'reclamations', label: 'Messages', path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === t.id ? '#059669' : '#94a3b8', padding: '4px 0' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === t.id ? 2.5 : 1.8}><path d={t.path} strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400, letterSpacing: '.02em' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
