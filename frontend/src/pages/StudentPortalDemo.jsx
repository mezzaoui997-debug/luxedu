import { useState, useEffect } from 'react';

const DEMO_STUDENTS = {
  'LUX-2026-001': {
    prenom: 'Omar', nom: 'Moussa', code: 'LUX-2026-001',
    niveau: '2ème Bac', classe: 'TCS-A',
    notes: [
      { matiere: 'Mathématiques', valeur: 16, type: 'Contrôle', date: '2026-04-10', coef: 7 },
      { matiere: 'Physique-Chimie', valeur: 14, type: 'Devoir', date: '2026-04-15', coef: 5 },
      { matiere: 'Français', valeur: 13, type: 'Contrôle', date: '2026-04-20', coef: 3 },
      { matiere: 'Anglais', valeur: 15, type: 'Contrôle', date: '2026-04-22', coef: 2 },
      { matiere: 'SVT', valeur: 12, type: 'Devoir', date: '2026-04-25', coef: 4 },
      { matiere: 'Histoire-Géo', valeur: 11, type: 'Contrôle', date: '2026-04-28', coef: 2 },
      { matiere: 'Education Islamique', valeur: 17, type: 'Contrôle', date: '2026-05-02', coef: 2 },
    ],
    absences: [
      { matiere: 'Mathématiques', date: '2026-04-08', heure: '2h', justifiee: true },
      { matiere: 'Histoire-Géo', date: '2026-04-18', heure: '1h', justifiee: false },
    ],
    devoirs: [
      { titre: 'Exercices intégrales', matiere: 'Mathématiques', dateLimite: '2026-05-30', description: 'Pages 45-47 du manuel', rendu: false, priorite: 'haute' },
      { titre: 'Rédaction — Mon avenir', matiere: 'Français', dateLimite: '2026-05-28', description: '300 mots minimum', rendu: true, priorite: 'normale' },
      { titre: 'TP Electricité', matiere: 'Physique-Chimie', dateLimite: '2026-06-02', description: 'Rapport de TP complet', rendu: false, priorite: 'haute' },
      { titre: 'Exposé Biodiversité', matiere: 'SVT', dateLimite: '2026-06-05', description: 'Présentation 10 minutes', rendu: false, priorite: 'normale' },
    ]
  },
  'LUX-2026-002': {
    prenom: 'Youssef', nom: 'Benjelloun', code: 'LUX-2026-002',
    niveau: '1ère Bac', classe: 'TC-B',
    notes: [
      { matiere: 'Mathématiques', valeur: 11, type: 'Contrôle', date: '2026-04-10', coef: 6 },
      { matiere: 'Français', valeur: 15, type: 'Contrôle', date: '2026-04-15', coef: 3 },
      { matiere: 'Anglais', valeur: 16, type: 'Devoir', date: '2026-04-20', coef: 2 },
      { matiere: 'Histoire-Géo', valeur: 14, type: 'Contrôle', date: '2026-04-22', coef: 2 },
      { matiere: 'SVT', valeur: 10, type: 'Contrôle', date: '2026-04-25', coef: 3 },
    ],
    absences: [],
    devoirs: [
      { titre: 'Exposé Histoire', matiere: 'Histoire-Géo', dateLimite: '2026-05-29', description: 'Le Maroc moderne', rendu: false, priorite: 'normale' },
    ]
  }
};

const CONCOURS = [
  { nom: 'Concours CPGE', description: 'Classes Préparatoires aux Grandes Ecoles', url: 'https://cpge.ma', deadline: '30 Juin 2026', niveau: ['2ème Bac'], type: 'National' },
  { nom: 'Concours ENSA', description: 'Ecoles Nationales des Sciences Appliquées', url: 'https://ensa.ac.ma', deadline: '15 Juillet 2026', niveau: ['2ème Bac'], type: 'National' },
  { nom: 'Concours ENCG', description: 'Ecoles Nationales de Commerce et Gestion', url: 'https://encg.ac.ma', deadline: '20 Juillet 2026', niveau: ['2ème Bac'], type: 'National' },
  { nom: 'Concours INPT', description: 'Institut National des Postes et Télécommunications', url: 'https://inpt.ac.ma', deadline: '10 Juillet 2026', niveau: ['2ème Bac'], type: 'National' },
  { nom: 'Concours ISCAE', description: 'Institut Supérieur de Commerce et d\'Administration des Entreprises', url: 'https://iscae.ac.ma', deadline: '25 Juillet 2026', niveau: ['2ème Bac'], type: 'National' },
  { nom: 'Orientation Bac — Massar', description: 'Portail officiel orientation post-baccalauréat Maroc', url: 'https://www.men.gov.ma', deadline: 'Après résultats', niveau: ['2ème Bac', '1ère Bac'], type: 'Officiel' },
  { nom: 'Campus France Maroc', description: 'Etudes supérieures en France', url: 'https://maroc.campusfrance.org', deadline: '15 Mars 2026', niveau: ['2ème Bac', '1ère Bac'], type: 'International' },
  { nom: 'Bourses du Gouvernement Marocain', description: 'Bourses pour études à l\'étranger', url: 'https://www.men.gov.ma/Fr/Pages/Bourses.aspx', deadline: 'Selon programme', niveau: ['2ème Bac'], type: 'Bourse' },
];

const MOROCCAN_UNIS = [
  { name: 'Université Mohammed V', url: 'https://www.um5.ac.ma', field: 'Pluridisciplinaire', city: 'Rabat', tags: ['Sciences', 'Droit', 'Lettres'] },
  { name: 'ENCG Casablanca', url: 'https://www.encg-casa.ma', field: 'Commerce & Gestion', city: 'Casablanca', tags: ['Business', 'Finance'] },
  { name: 'ENSA Marrakech', url: 'https://www.ensa.uca.ma', field: 'Ingénierie', city: 'Marrakech', tags: ['Informatique', 'Génie Civil'] },
  { name: 'INPT Rabat', url: 'https://www.inpt.ac.ma', field: 'Télécommunications', city: 'Rabat', tags: ['Télécom', 'IA'] },
  { name: 'ISCAE Casablanca', url: 'https://www.iscae.ac.ma', field: 'Management', city: 'Casablanca', tags: ['Management', 'Audit'] },
  { name: 'Université Cadi Ayyad', url: 'https://www.uca.ma', field: 'Pluridisciplinaire', city: 'Marrakech', tags: ['Sciences', 'Médecine'] },
];

const FOREIGN_UNIS = [
  { name: 'Sorbonne Université', url: 'https://www.sorbonne-universite.fr', country: 'France', field: 'Lettres & Sciences', rank: '#83 mondial' },
  { name: 'Sciences Po Paris', url: 'https://www.sciencespo.fr', country: 'France', field: 'Sciences Politiques', rank: 'Top 10 Europe' },
  { name: 'HEC Paris', url: 'https://www.hec.edu', country: 'France', field: 'Management', rank: '#1 Business' },
  { name: 'Université de Montréal', url: 'https://www.umontreal.ca', country: 'Canada', field: 'Pluridisciplinaire', rank: 'Top 100 mondial' },
  { name: 'McGill University', url: 'https://www.mcgill.ca', country: 'Canada', field: 'Sciences & Médecine', rank: '#46 mondial' },
  { name: 'King Abdulaziz University', url: 'https://www.kau.edu.sa', country: 'Arabie Saoudite', field: 'Ingénierie', rank: 'Top 200 mondial' },
];

function getOrientation(notes) {
  if (!notes || notes.length === 0) return null;
  const avg = notes.reduce((a, b) => a + b.valeur, 0) / notes.length;
  const mathAvg = avgBy(notes, ['Math']);
  const sciAvg = avgBy(notes, ['Physique', 'SVT', 'Chimie']);
  const langAvg = avgBy(notes, ['Français', 'Anglais', 'Arabe']);
  if (mathAvg >= 14 && sciAvg >= 13) return { filiere: 'Sciences & Ingénierie', desc: 'Excellence en Maths et Sciences. Visez les grandes écoles d\'ingénieurs et les filières scientifiques.', color: '#2563eb', bg: '#eff6ff', pct: 95 };
  if (langAvg >= 14 && avg >= 13) return { filiere: 'Lettres & Sciences Humaines', desc: 'Maitrise exceptionnelle des langues. Les filières littéraires vous correspondent.', color: '#7c3aed', bg: '#f5f3ff', pct: 88 };
  if (avg >= 14) return { filiere: 'Classe Préparatoire', desc: 'Niveau d\'excellence. Les classes préparatoires aux grandes écoles sont à votre portée.', color: '#d97706', bg: '#fffbeb', pct: 92 };
  if (avg >= 12) return { filiere: 'Economie & Gestion', desc: 'Profil équilibré idéal pour les filières économiques.', color: '#059669', bg: '#ecfdf5', pct: 80 };
  return { filiere: 'Formation Professionnelle', desc: 'Une formation professionnelle ciblée vous permettra de vous spécialiser.', color: '#0891b2', bg: '#ecfeff', pct: 70 };
}

function avgBy(notes, keywords) {
  const f = notes.filter(n => keywords.some(k => n.matiere.includes(k)));
  return f.length > 0 ? f.reduce((a, b) => a + b.valeur, 0) / f.length : 0;
}

function NoteBar({ note }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(note.valeur / 20 * 100), 150); return () => clearTimeout(t); }, [note.valeur]);
  const color = note.valeur >= 16 ? '#059669' : note.valeur >= 12 ? '#2563eb' : note.valeur >= 10 ? '#d97706' : '#dc2626';
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#1e2d4f' }}>{note.matiere}</span>
          <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 4 }}>{note.type}</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color }}>{note.valeur}<span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>/20</span></span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: width + '%', background: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

function MiniChart({ notes }) {
  const w = 400, h = 110, pad = 16;
  const pts = notes.map((n, i) => ({
    x: pad + (i / Math.max(notes.length - 1, 1)) * (w - pad * 2),
    y: h - pad - (n.valeur / 20) * (h - pad * 2)
  }));
  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const area = path + ` L ${pts[pts.length-1].x} ${h-pad} L ${pts[0].x} ${h-pad} Z`;
  const midY = h - pad - (10/20) * (h - pad*2);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 90 }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1={pad} y1={midY} x2={w-pad} y2={midY} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.4"/>
      <path d={area} fill="url(#g1)"/>
      <path d={path} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#2563eb" strokeWidth="2"/>)}
    </svg>
  );
}

const navy = '#1e2d4f';
const gold = '#b8860b';

export default function StudentPortalDemo() {
  const [step, setStep] = useState('login');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [tawjihTab, setTawjihTab] = useState('concours');

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    const s = DEMO_STUDENTS[code.toUpperCase()];
    if (!s) { setError('Code étudiant invalide'); return; }
    if (password !== '1234') { setError('Mot de passe incorrect'); return; }
    setStudent(s);
    setStep('dashboard');
  }

  const TAWJIH_LEVELS = ['Bac', '1ère', '2ème', '9ème', '5ème', '6ème'];
  const isTawjihLevel = student && TAWJIH_LEVELS.some(l => student.niveau?.includes(l));
  const orientation = student ? getOrientation(student.notes) : null;
  const avg = student ? (student.notes.reduce((a, b) => a + b.valeur, 0) / student.notes.length).toFixed(2) : 0;

  const tabs = [
    { id: 'home', label: 'Tableau de bord' },
    { id: 'notes', label: 'Notes' },
    { id: 'presences', label: 'Absences' },
    { id: 'devoirs', label: 'Devoirs' },
    ...(isTawjihLevel ? [{ id: 'tawjih', label: 'Tawjih' }] : []),
  ];

  const inp = { width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafafa' };

  if (step === 'login') return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: navy, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 16, height: 16, border: '2px solid white', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: navy, letterSpacing: '-0.02em' }}>LuxEdu</span>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Portail Etudiant</div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: navy, margin: '0 0 4px' }}>Connexion</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px' }}>Entrez votre code et mot de passe</p>
          <div style={{ background: '#f0f7ff', border: '1px solid #dbeafe', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#2563eb' }}>
            Demo — Code: <strong>LUX-2026-001</strong> · Mot de passe: <strong>1234</strong>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>CODE ETUDIANT</label>
              <input style={inp} placeholder="LUX-2026-001" value={code} onChange={e => setCode(e.target.value)} required onFocus={e => e.target.style.borderColor=navy} onBlur={e => e.target.style.borderColor='#e2e8f0'}/>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>MOT DE PASSE</label>
              <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required onFocus={e => e.target.style.borderColor=navy} onBlur={e => e.target.style.borderColor='#e2e8f0'}/>
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#dc2626' }}>{error}</div>}
            <button style={{ padding: '13px', borderRadius: 8, background: navy, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 }} type="submit">
              Accéder a mon espace
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#cbd5e1', marginTop: 16 }}>Code remis par votre établissement</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Topbar */}
      <div style={{ background: navy, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>
            {student?.prenom?.[0]}{student?.nom?.[0]}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{student?.prenom} {student?.nom}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{student?.niveau} · {student?.classe}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'monospace' }}>{student?.code}</span>
          <button onClick={() => { setStep('login'); setStudent(null); }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', padding: '0 24px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab===t.id ? 600 : 400, color: activeTab===t.id ? navy : '#64748b', borderBottom: `2px solid ${activeTab===t.id ? navy : 'transparent'}`, whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>

        {/* DASHBOARD */}
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Moyenne générale', value: avg + ' / 20', sub: parseFloat(avg) >= 10 ? 'Satisfaisant' : 'A ameliorer', good: parseFloat(avg) >= 10 },
                { label: 'Absences', value: student.absences.length + 'h', sub: student.absences.filter(a=>!a.justifiee).length + ' non justifiée(s)', good: student.absences.length < 4 },
                { label: 'Devoirs en attente', value: student.devoirs.filter(d=>!d.rendu).length, sub: student.devoirs.filter(d=>!d.rendu&&d.priorite==='haute').length + ' urgent(s)', good: student.devoirs.filter(d=>!d.rendu).length < 3 },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: navy, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.good ? '#059669' : '#d97706', fontWeight: 500 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart + Orientation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 2 }}>Evolution des notes</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>Tendance ce semestre</div>
                <MiniChart notes={student.notes} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  {student.notes.map((n, i) => (
                    <div key={i} style={{ fontSize: 10, color: '#cbd5e1', maxWidth: 48, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.matiere.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
              {orientation && (
                <div style={{ background: orientation.bg, borderRadius: 12, padding: 20, border: `1px solid ${orientation.color}25` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Orientation IA</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 6 }}>{orientation.filiere}</div>
                  <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 4, marginBottom: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: orientation.pct+'%', background: orientation.color, borderRadius: 4 }}/>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Compatibilité <strong style={{ color: orientation.color }}>{orientation.pct}%</strong></div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: '0 0 14px' }}>{orientation.desc}</p>
                  {isTawjihLevel && (
                    <button onClick={() => setActiveTab('tawjih')} style={{ background: orientation.color, color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                      Voir les établissements
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Prochains devoirs */}
            <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 14 }}>Prochains devoirs</div>
              {student.devoirs.filter(d => !d.rendu).map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < student.devoirs.filter(d=>!d.rendu).length-1 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.priorite === 'haute' ? '#ef4444' : '#f59e0b' }}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: navy }}>{d.titre}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{d.matiere}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{d.dateLimite}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Moyenne générale', value: avg + '/20', color: '#2563eb' },
                { label: 'Meilleure note', value: Math.max(...student.notes.map(n=>n.valeur)) + '/20', color: '#059669' },
                { label: 'Note la plus basse', value: Math.min(...student.notes.map(n=>n.valeur)) + '/20', color: '#d97706' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 4 }}>Notes par matière</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>La ligne rouge indique la moyenne requise (10/20)</div>
              {student.notes.map((n, i) => <NoteBar key={i} note={n} />)}
            </div>
          </div>
        )}

        {/* ABSENCES */}
        {activeTab === 'presences' && (
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: navy }}>Historique des absences</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Année scolaire 2025–2026</div>
              </div>
              <div style={{ background: student.absences.length===0 ? '#f0fdf4' : '#fefce8', color: student.absences.length===0 ? '#059669' : '#d97706', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: `1px solid ${student.absences.length===0?'#bbf7d0':'#fef08a'}` }}>
                {student.absences.length === 0 ? 'Aucune absence' : student.absences.length + 'h au total'}
              </div>
            </div>
            {student.absences.length > 0 ? student.absences.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fafafa', borderRadius: 10, border: '1px solid #f1f5f9', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: navy }}>{a.matiere}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{a.date} · {a.heure}</div>
                </div>
                <span style={{ background: a.justifiee ? '#f0fdf4' : '#fef2f2', color: a.justifiee ? '#059669' : '#dc2626', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  {a.justifiee ? 'Justifiee' : 'Non justifiee'}
                </span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#059669' }}>Aucune absence enregistree</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Félicitations pour votre assiduité</div>
              </div>
            )}
          </div>
        )}

        {/* DEVOIRS */}
        {activeTab === 'devoirs' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'En attente', value: student.devoirs.filter(d=>!d.rendu).length, color: '#d97706', bg: '#fffbeb' },
                { label: 'Rendus', value: student.devoirs.filter(d=>d.rendu).length, color: '#059669', bg: '#f0fdf4' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: `1px solid ${s.color}15` }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {student.devoirs.map((d, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: `1px solid ${d.rendu ? '#dcfce7' : d.priorite==='haute' ? '#fecaca' : '#f1f5f9'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.rendu ? '#059669' : d.priorite==='haute' ? '#ef4444' : '#f59e0b', flexShrink: 0 }}/>
                      <span style={{ fontWeight: 600, fontSize: 14, color: navy }}>{d.titre}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{d.matiere} · {d.dateLimite}</div>
                    <div style={{ fontSize: 13, color: '#475569' }}>{d.description}</div>
                  </div>
                  <span style={{ marginLeft: 14, background: d.rendu ? '#f0fdf4' : d.priorite==='haute' ? '#fef2f2' : '#fefce8', color: d.rendu ? '#059669' : d.priorite==='haute' ? '#dc2626' : '#d97706', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    {d.rendu ? 'Rendu' : d.priorite==='haute' ? 'Urgent' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAWJIH */}
        {activeTab === 'tawjih' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ background: navy, borderRadius: 16, padding: '28px 32px', color: 'white' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Portail Orientation</div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Tawjih — توجيه</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Premiere plateforme d'orientation scolaire propulsee par IA au Maroc · {student?.niveau}</div>
            </div>

            {orientation && (
              <div style={{ background: orientation.bg, borderRadius: 12, padding: 20, border: `1px solid ${orientation.color}30` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: orientation.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Recommandation IA — Basée sur vos résultats</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 6 }}>{orientation.filiere}</div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: orientation.pct+'%', background: orientation.color, borderRadius: 4 }}/>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{orientation.desc}</p>
              </div>
            )}

            {/* Sub tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['concours', 'maroc', 'international'].map(t => (
                <button key={t} onClick={() => setTawjihTab(t)} style={{ padding: '8px 18px', borderRadius: 8, background: tawjihTab===t ? navy : 'white', color: tawjihTab===t ? 'white' : '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${tawjihTab===t ? navy : '#e2e8f0'}` }}>
                  {t === 'concours' ? 'Concours & Admissions' : t === 'maroc' ? 'Universités Marocaines' : 'Etranger'}
                </button>
              ))}
            </div>

            {tawjihTab === 'concours' && (
              <div style={{ display: 'grid', gap: 12 }}>
                {CONCOURS.map((c, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: navy }}>{c.nom}</span>
                        <span style={{ fontSize: 11, background: c.type==='Officiel' ? '#eff6ff' : c.type==='International' ? '#f5f3ff' : c.type==='Bourse' ? '#fefce8' : '#f0fdf4', color: c.type==='Officiel' ? '#2563eb' : c.type==='International' ? '#7c3aed' : c.type==='Bourse' ? '#d97706' : '#059669', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{c.type}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{c.description}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>Date limite : <strong style={{ color: '#d97706' }}>{c.deadline}</strong></div>
                    </div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: navy, color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      S'inscrire
                    </a>
                  </div>
                ))}
              </div>
            )}

            {tawjihTab === 'maroc' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {MOROCCAN_UNIS.map((u, i) => (
                  <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '18px', border: '1px solid #f1f5f9', display: 'block' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = navy; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: navy, marginBottom: 4 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{u.field} · {u.city}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {u.tags.map((t, j) => <span key={j} style={{ background: '#f1f5f9', color: '#475569', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
                    </div>
                    <div style={{ fontSize: 12, color: navy, fontWeight: 600 }}>Visiter le site</div>
                  </a>
                ))}
              </div>
            )}

            {tawjihTab === 'international' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {FOREIGN_UNIS.map((u, i) => (
                  <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '18px', border: '1px solid #f1f5f9', display: 'block' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = navy; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: navy, marginBottom: 4 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{u.country} · {u.field}</div>
                    <div style={{ fontSize: 11, background: '#fefce8', color: '#d97706', padding: '3px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10, fontWeight: 600 }}>{u.rank}</div>
                    <div style={{ fontSize: 12, color: navy, fontWeight: 600, display: 'block' }}>Visiter le site</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
