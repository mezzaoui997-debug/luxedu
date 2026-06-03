import { useState } from 'react';

const navy = '#1e2d4f';
const gold = '#C9963F';
const green = '#059669';

const DEMO_PARENT = {
  prenom: 'Karim', nom: 'Alaoui',
  enfant: {
    prenom: 'Sara', nom: 'Alaoui', niveau: '2eme Bac Sciences', classe: 'TCS-A',
    notes: [
      { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 16.5, date: '10/03/2026' }, { titre: 'Controle 2', valeur: 17, date: '15/04/2026' }], coef: 7 },
      { matiere: 'Physique-Chimie', evaluations: [{ titre: 'Devoir 1', valeur: 14, date: '15/03/2026' }, { titre: 'Controle', valeur: 15, date: '20/04/2026' }], coef: 5 },
      { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 15, date: '20/03/2026' }, { titre: 'Controle', valeur: 16, date: '22/04/2026' }], coef: 3 },
      { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 17, date: '22/03/2026' }, { titre: 'Ecrit', valeur: 16, date: '10/04/2026' }], coef: 2 },
      { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 13, date: '25/03/2026' }, { titre: 'Controle', valeur: 14, date: '28/04/2026' }], coef: 4 },
      { matiere: 'Histoire-Geo', evaluations: [{ titre: 'Controle', valeur: 14, date: '28/03/2026' }], coef: 2 },
    ],
    absences: [
      { matiere: 'Mathematiques', date: '08/04/2026', duree: '2h', justifiee: true },
    ],
    paiements: [
      { mois: 'Mai 2026', montant: 1200, statut: 'paye', date: '02/05/2026' },
      { mois: 'Avril 2026', montant: 1200, statut: 'paye', date: '01/04/2026' },
      { mois: 'Mars 2026', montant: 1200, statut: 'paye', date: '03/03/2026' },
      { mois: 'Juin 2026', montant: 1200, statut: 'en_attente', date: null },
    ]
  }
};

const DEMO_STUDENT = {
  prenom: 'Youssef', nom: 'Bennani', code: 'LUX-DEMO-001', niveau: '2eme Bac', classe: 'TCS-B',
  notes: [
    { matiere: 'Mathematiques', evaluations: [{ titre: 'Controle 1', valeur: 15, date: '10/03/2026' }, { titre: 'Controle 2', valeur: 16, date: '15/04/2026' }], coef: 7 },
    { matiere: 'Physique-Chimie', evaluations: [{ titre: 'Devoir', valeur: 14, date: '15/03/2026' }, { titre: 'Controle', valeur: 13, date: '20/04/2026' }], coef: 5 },
    { matiere: 'Francais', evaluations: [{ titre: 'Redaction', valeur: 14, date: '20/03/2026' }], coef: 3 },
    { matiere: 'Anglais', evaluations: [{ titre: 'Oral', valeur: 16, date: '22/03/2026' }], coef: 2 },
    { matiere: 'SVT', evaluations: [{ titre: 'TP', valeur: 13, date: '25/03/2026' }], coef: 4 },
  ],
  absences: [],
  devoirs: [
    { id: 1, titre: 'Exercices integrales ch.5', matiere: 'Mathematiques', deadline: '2026-06-10', rendu: false, urgent: true, description: 'Exercices pages 45 a 47 du manuel. Montrer toutes les etapes.', enseignant: 'M. Benali' },
    { id: 2, titre: 'Redaction avenir professionnel', matiere: 'Francais', deadline: '2026-06-05', rendu: true, urgent: false, description: 'Redaction 300 mots minimum.', enseignant: 'Mme. Cherkaoui', note: '14/20' },
    { id: 3, titre: 'Rapport TP Electricite', matiere: 'Physique-Chimie', deadline: '2026-06-15', rendu: false, urgent: false, description: 'Rapport complet TP circuits electriques.', enseignant: 'M. Idrissi' },
  ],
  messages: [
    { id: 1, expediteur: 'M. Benali', matiere: 'Mathematiques', texte: 'Excellent travail Youssef, continuez ainsi pour le prochain controle!', heure: '14:30', lu: false },
    { id: 2, expediteur: 'Direction', matiere: 'Administration', texte: 'Reunion parents-professeurs le 5 juin a 18h. Presence obligatoire.', heure: '09:00', lu: true },
  ]
};

function matiereAvg(m) {
  if (!m.evaluations.length) return 0;
  return (m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length).toFixed(1);
}

function globalAvg(notes) {
  if (!notes.length) return '0.00';
  let total = 0, coefTotal = 0;
  notes.forEach(m => {
    const avg = m.evaluations.reduce((a, b) => a + b.valeur, 0) / m.evaluations.length;
    total += avg * m.coef; coefTotal += m.coef;
  });
  return (total / coefTotal).toFixed(2);
}

function Avatar({ name, size = 36, bg = gold }) {
  return <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: 'white', flexShrink: 0 }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>;
}

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700 }}>{label}</span>;
}

function NoteBar({ label, value, coef }) {
  const color = value >= 16 ? green : value >= 12 ? '#2563eb' : value >= 10 ? '#d97706' : '#dc2626';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <div><span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{label}</span>{coef && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>coef. {coef}</span>}</div>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: (value / 20 * 100) + '%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

const inp = { width: '100%', padding: '13px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fafafa', fontFamily: 'inherit' };

export default function DemoApp() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState(null); // 'parent' | 'student'
  const [parentTab, setParentTab] = useState('home');
  const [studentTab, setStudentTab] = useState('home');
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [recs, setRecs] = useState([
    { id: 1, sujet: 'Absence injustifiee du 08/04', date: '10/04/2026', statut: 'traitee', reponse: 'Apres verification, un certificat medical a ete accepte. Absence mise a jour.' },
    { id: 2, sujet: 'Note controle Maths', date: '20/04/2026', statut: 'en_attente', reponse: null },
  ]);
  const [recSujet, setRecSujet] = useState('');
  const [recMsg, setRecMsg] = useState('');
  const [recOk, setRecOk] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [msgs, setMsgs] = useState([...DEMO_STUDENT.messages]);
  const unread = msgs.filter(m => !m.lu).length;

  function sendRec() {
    if (!recSujet.trim() || !recMsg.trim()) return;
    setRecs(prev => [{ id: Date.now(), sujet: recSujet, date: new Date().toLocaleDateString('fr-FR'), statut: 'en_attente', reponse: null }, ...prev]);
    setRecSujet(''); setRecMsg(''); setRecOk(true);
    setTimeout(() => setRecOk(false), 4000);
  }

  // HOME
  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: navy, padding: '48px 28px 36px', textAlign: 'center' }}>
        <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ height: 100, filter: 'drop-shadow(0 8px 32px rgba(201,150,63,0.5))' }} onError={e => e.target.style.display = 'none'} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '.2em', textTransform: 'uppercase' }}>DEMO INTERACTIF</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(201,150,63,0.4)' }} />
            <div style={{ fontSize: 12, color: gold, letterSpacing: '.15em', fontWeight: 600 }}>PLATEFORME SCOLAIRE MAROC</div>
            <div style={{ width: 24, height: 1, background: 'rgba(201,150,63,0.4)' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Mode Demonstration</div>
            <div style={{ fontSize: 12, color: '#78350f' }}>Explorez toutes les fonctionnalites avec des donnees fictives</div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Choisissez votre espace</div>

        {[
          { type: 'parent', emoji: '👨‍👩‍👧', title: 'Espace Parent', name: 'Karim Alaoui', desc: 'Suivi de Sara · Notes · Paiements · Reclamations', bg: '#f0fdf4', sc: green, features: ['Notes en temps reel', 'Suivi des absences', 'Paiements et RIB', 'Reclamations'] },
          { type: 'student', emoji: '🎓', title: 'Espace Etudiant', name: 'Youssef Bennani', desc: 'Notes · Devoirs · Orientation · Messagerie', bg: '#eff6ff', sc: '#2563eb', features: ['Bulletin de notes', 'Devoirs et echeances', 'Orientation IA', 'Messagerie profs'] },
        ].map((item, i) => (
          <button key={i} onClick={() => { setMode(item.type); setScreen(item.type); }} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 16px', textAlign: 'left', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, background: item.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: navy }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Demo: {item.name}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {item.features.map((f, j) => <span key={j} style={{ background: item.bg, color: item.sc, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>{f}</span>)}
            </div>
          </button>
        ))}

        <div style={{ background: navy, borderRadius: 14, padding: '16px', marginTop: 4, textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>Pret a equiper votre ecole ?</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Rejoignez les ecoles qui font confiance a LuxEdu</div>
          <a href="mailto:contact@luxeduschool.com" style={{ display: 'inline-block', background: gold, color: 'white', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Contacter LuxEdu</a>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href="/mobile" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>Acces compte existant →</a>
        </div>
      </div>
    </div>
  );

  // PARENT DEMO
  if (screen === 'parent') {
    const s = DEMO_PARENT.enfant;
    const avg = globalAvg(s.notes);
    const pTabs = [{ id: 'home', label: 'Accueil' }, { id: 'enfant', label: 'Mon enfant' }, { id: 'paiements', label: 'Paiements' }, { id: 'reclamations', label: 'Reclamations' }];

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: green, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="Karim Alaoui" size={38} bg="rgba(255,255,255,0.25)" />
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Karim Alaoui</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Mode Demo · Espace Parent</div>
            </div>
          </div>
          <button onClick={() => setScreen('home')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>← Retour</button>
        </div>

        <div style={{ padding: '16px' }}>
          {parentTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#92400e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎯</span> Mode demonstration — donnees fictives
              </div>
              <div style={{ background: green, borderRadius: 16, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Tableau de bord parent</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Bonjour, Karim</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20' }, { label: 'Absences', value: s.absences.length + 'h' }, { label: 'Impayes', value: s.paiements.filter(p => p.statut !== 'paye').length }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setParentTab('enfant')} style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name="Sara Alaoui" size={42} bg={navy} />
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>Sara Alaoui</div><div style={{ fontSize: 12, color: '#64748b' }}>{s.niveau} · {s.classe}</div></div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[{ label: 'Moyenne', value: avg + '/20', color: green }, { label: 'Absences', value: '2h', color: '#d97706' }, { label: 'Devoirs att.', value: '2', color: '#2563eb' }].map((item, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </button>
            </div>
          )}

          {parentTab === 'enfant' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Sara Alaoui</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 14 }}>{s.niveau} · {s.classe}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20' }, { label: 'Absences', value: '2h' }, { label: 'Rang', value: '3eme' }].map((item, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 700 }}>{item.value}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{item.label}</div></div>)}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 14 }}>Notes par matiere</div>
                {s.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Absences</div>
                {s.absences.map((a, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}><div><div style={{ fontSize: 13, fontWeight: 500, color: navy }}>{a.matiere}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{a.date} · {a.duree}</div></div><Badge label="Justifiee" color={green} bg="#f0fdf4" /></div>)}
              </div>
            </div>
          )}

          {parentTab === 'paiements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(() => {
                const totalPaye = s.paiements.filter(p => p.statut === 'paye').reduce((a, p) => a + p.montant, 0);
                const totalDu = s.paiements.length * 1200;
                return (
                  <div style={{ background: navy, borderRadius: 14, padding: '18px 20px', color: 'white' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Paiements — Sara Alaoui</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{totalPaye.toLocaleString()} MAD</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>payes sur {totalDu.toLocaleString()} MAD</div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (totalPaye / totalDu * 100) + '%', background: '#4ade80', borderRadius: 4 }} /></div>
                  </div>
                );
              })()}
              {s.paiements.map((p, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${p.statut === 'paye' ? '#dcfce7' : '#fef9c3'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: p.statut !== 'paye' ? 10 : 0 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>{p.mois}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{p.statut === 'paye' ? `Paye le ${p.date}` : 'Echeance a venir'}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: 16, fontWeight: 700, color: navy }}>{p.montant.toLocaleString()} MAD</div><Badge label={p.statut === 'paye' ? 'Paye' : 'En attente'} color={p.statut === 'paye' ? green : '#d97706'} bg={p.statut === 'paye' ? '#f0fdf4' : '#fefce8'} /></div>
                  </div>
                  {p.statut !== 'paye' && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8 }}>Virement bancaire</div>
                      {[{ label: 'Banque', value: 'Attijariwafa Bank' }, { label: 'Beneficiaire', value: 'Ecole Excellence' }, { label: 'RIB', value: '007 780 0000123456789012 26' }].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: navy, fontWeight: 600, fontFamily: idx === 2 ? 'monospace' : 'inherit' }}>{item.value}</span>
                        </div>
                      ))}
                      <button onClick={() => navigator.clipboard?.writeText('007 780 0000123456789012 26')} style={{ marginTop: 10, background: navy, color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Copier le RIB</button>
                    </div>
                  )}
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
              {recs.length > 0 && (
                <><div style={{ fontSize: 13, fontWeight: 700, color: navy }}>Historique</div>
                {recs.map((r, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: navy, flex: 1 }}>{r.sujet}</div>
                      <Badge label={r.statut === 'traitee' ? 'Traitee' : 'En attente'} color={r.statut === 'traitee' ? green : '#d97706'} bg={r.statut === 'traitee' ? '#f0fdf4' : '#fefce8'} />
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: r.reponse ? 10 : 0 }}>{r.date}</div>
                    {r.reponse && <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#1e40af', borderLeft: '3px solid #2563eb' }}><div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>REPONSE DE L ECOLE</div>{r.reponse}</div>}
                  </div>
                ))}</>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', paddingTop: 8, paddingBottom: 28, zIndex: 100 }}>
          {pTabs.map(t => <button key={t.id} onClick={() => setParentTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: parentTab === t.id ? green : '#94a3b8', padding: '4px 0' }}><div style={{ width: 22, height: 22, borderRadius: 6, background: parentTab === t.id ? '#f0fdf4' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: parentTab === t.id ? green : '#94a3b8' }} /></div><span style={{ fontSize: 9, fontWeight: parentTab === t.id ? 700 : 400 }}>{t.label}</span></button>)}
        </div>
      </div>
    );
  }

  // STUDENT DEMO
  if (screen === 'student') {
    const s = DEMO_STUDENT;
    const avg = globalAvg(s.notes);
    const sTabs = [{ id: 'home', label: 'Accueil' }, { id: 'notes', label: 'Notes' }, { id: 'devoirs', label: 'Devoirs' }, { id: 'messages', label: `Messages${unread ? ' (' + unread + ')' : ''}` }, { id: 'tawjih', label: 'Tawjih' }];

    if (selectedDevoir) return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedDevoir(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg></button>
          <span style={{ color: 'white', fontWeight: 600 }}>Detail du devoir</span>
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, border: `2px solid ${selectedDevoir.rendu ? '#bbf7d0' : selectedDevoir.urgent ? '#fecaca' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 4 }}>{selectedDevoir.titre}</div><div style={{ fontSize: 13, color: '#64748b' }}>{selectedDevoir.matiere} · {selectedDevoir.enseignant}</div></div>
              <Badge label={selectedDevoir.rendu ? 'Rendu' : selectedDevoir.urgent ? 'Urgent' : 'En attente'} color={selectedDevoir.rendu ? green : selectedDevoir.urgent ? '#dc2626' : '#d97706'} bg={selectedDevoir.rendu ? '#f0fdf4' : selectedDevoir.urgent ? '#fef2f2' : '#fefce8'} />
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}><span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>A rendre le {selectedDevoir.deadline}</span></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Instructions</div>
            <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>{selectedDevoir.description}</div>
            {selectedDevoir.note && <div style={{ marginTop: 14, background: '#f0fdf4', borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, color: green, textTransform: 'uppercase', marginBottom: 4 }}>Note obtenue</div><div style={{ fontSize: 32, fontWeight: 700, color: green }}>{selectedDevoir.note}</div></div>}
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 72 }}>
        <div style={{ background: navy, paddingTop: 52, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="Youssef Bennani" size={38} bg={gold} />
            <div><div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Youssef Bennani</div><div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>LUX-DEMO-001 · {s.classe}</div></div>
          </div>
          <button onClick={() => setScreen('home')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>← Retour</button>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#92400e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span>🎯</span> Mode demonstration — donnees fictives
          </div>

          {studentTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 16, padding: 20, color: 'white' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Annee scolaire 2025-2026</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Bonjour, Youssef</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Moyenne', value: avg + '/20', good: parseFloat(avg) >= 10 }, { label: 'Absences', value: '0h', good: true }, { label: 'Devoirs att.', value: s.devoirs.filter(d => !d.rendu).length, good: true }].map((item, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 700, color: item.good ? '#4ade80' : '#f87171' }}>{item.value}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{item.label}</div></div>)}
                </div>
              </div>
              <div style={{ background: '#eff6ff', borderRadius: 14, padding: 16, border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Orientation IA</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 6 }}>Sciences & Ingenierie</div>
                <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: '92%', background: '#2563eb', borderRadius: 4 }} /></div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Compatibilite <strong style={{ color: '#2563eb' }}>92%</strong></div>
                <button onClick={() => setStudentTab('tawjih')} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Voir les etablissements</button>
              </div>
              {unread > 0 && <button onClick={() => setStudentTab('messages')} style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e', flex: 1 }}>{unread} message(s) non lu(s)</span>
              </button>}
            </div>
          )}

          {studentTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: navy, borderRadius: 14, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Moyenne generale</div><div style={{ fontSize: 30, fontWeight: 700 }}>{avg}<span style={{ fontSize: 14, fontWeight: 400 }}>/20</span></div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.notes.length} matieres</div><div style={{ fontSize: 13, color: '#4ade80', marginTop: 2, fontWeight: 600 }}>Excellent</div></div>
              </div>
              {s.notes.map((m, i) => {
                const a = parseFloat(matiereAvg(m));
                const color = a >= 16 ? green : a >= 12 ? '#2563eb' : a >= 10 ? '#d97706' : '#dc2626';
                return <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{m.matiere}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Coef. {m.coef} · {m.evaluations.length} eval.</div></div>
                    <div style={{ fontSize: 20, fontWeight: 700, color }}>{a}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>/20</span></div>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: (a / 20 * 100) + '%', background: color, borderRadius: 4 }} /></div>
                </div>;
              })}
            </div>
          )}

          {studentTab === 'devoirs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 4 }}>
                {[{ label: 'En attente', value: s.devoirs.filter(d => !d.rendu).length, color: '#d97706', bg: '#fffbeb' }, { label: 'Rendus', value: s.devoirs.filter(d => d.rendu).length, color: green, bg: '#f0fdf4' }, { label: 'Urgents', value: s.devoirs.filter(d => !d.rendu && d.urgent).length, color: '#dc2626', bg: '#fef2f2' }].map((item, i) => <div key={i} style={{ background: item.bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{item.label}</div></div>)}
              </div>
              {s.devoirs.map((d, i) => (
                <button key={i} onClick={() => setSelectedDevoir(d)} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: `1px solid ${d.rendu ? '#dcfce7' : d.urgent ? '#fecaca' : '#f1f5f9'}`, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><div style={{ width: 7, height: 7, borderRadius: '50%', background: d.rendu ? green : d.urgent ? '#ef4444' : '#f59e0b', flexShrink: 0 }} /><span style={{ fontSize: 14, fontWeight: 600, color: navy }}>{d.titre}</span></div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{d.matiere} · {d.enseignant}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 10 }}>
                      <Badge label={d.rendu ? 'Rendu' : d.urgent ? 'Urgent' : 'En attente'} color={d.rendu ? green : d.urgent ? '#dc2626' : '#d97706'} bg={d.rendu ? '#f0fdf4' : d.urgent ? '#fef2f2' : '#fefce8'} />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {studentTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 4 }}>Messages des enseignants</div>
              {msgs.map((m, i) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={selectedMsg.expediteur} size={40} bg={navy} /><div><div style={{ fontSize: 15, fontWeight: 700, color: navy }}>{selectedMsg.expediteur}</div><div style={{ fontSize: 12, color: '#64748b' }}>{selectedMsg.matiere}</div></div></div>
                      <button onClick={() => setSelectedMsg(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                    </div>
                    <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, background: '#f8fafc', borderRadius: 12, padding: 16 }}>{selectedMsg.texte}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {studentTab === 'tawjih' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: navy, borderRadius: 14, padding: 20, color: 'white' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Portail Orientation</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Tawjih — Premiere plateforme IA Maroc</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.niveau} · {s.classe}</div>
              </div>
              <div style={{ background: '#eff6ff', borderRadius: 12, padding: 16, border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Recommandation IA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 8 }}>Sciences & Ingenierie</div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: '92%', background: '#2563eb', borderRadius: 4 }} /></div>
                <div style={{ fontSize: 13, color: '#475569' }}>Excellence en Maths et Sciences. Les grandes ecoles d'ingenieurs vous sont accessibles.</div>
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 14 }}>Analyse par matiere</div>
                {s.notes.map((m, i) => <NoteBar key={i} label={m.matiere} value={parseFloat(matiereAvg(m))} coef={m.coef} />)}
              </div>
              {[
                { nom: 'Concours CPGE', desc: 'Classes Preparatoires Grandes Ecoles', url: 'https://cpge.ma', deadline: '30 Juin 2026' },
                { nom: 'Concours ENSA', desc: 'Ecoles Nationales Sciences Appliquees', url: 'https://ensa.ac.ma', deadline: '15 Juillet 2026' },
                { nom: 'ENCG Casablanca', desc: 'Commerce et Gestion', url: 'https://encg-casa.ma', deadline: '20 Juillet 2026' },
              ].map((c, i) => <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{c.nom}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.desc}</div><div style={{ fontSize: 11, color: '#d97706', fontWeight: 600, marginTop: 4 }}>Deadline: {c.deadline}</div></div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>)}
            </div>
          )}
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', paddingTop: 8, paddingBottom: 28, zIndex: 100 }}>
          {sTabs.map(t => (
            <button key={t.id} onClick={() => { setStudentTab(t.id); setSelectedDevoir(null); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: studentTab === t.id ? navy : '#94a3b8', padding: '4px 0', position: 'relative' }}>
              {t.id === 'messages' && unread > 0 && <div style={{ position: 'absolute', top: 2, right: '18%', width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />}
              <div style={{ width: 22, height: 22, borderRadius: 6, background: studentTab === t.id ? '#eff6ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: studentTab === t.id ? navy : '#94a3b8' }} /></div>
              <span style={{ fontSize: 9, fontWeight: studentTab === t.id ? 700 : 400 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
