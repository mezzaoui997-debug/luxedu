import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://luxedu-backend.railway.app';

const MOROCCAN_UNIS = [
  { name: "Université Mohammed V - Rabat", url: "https://www.um5.ac.ma", field: "Pluridisciplinaire", city: "Rabat" },
  { name: "Université Hassan II - Casablanca", url: "https://www.univh2c.ma", field: "Pluridisciplinaire", city: "Casablanca" },
  { name: "ENCG Casablanca", url: "https://www.encg-casa.ma", field: "Commerce & Gestion", city: "Casablanca" },
  { name: "ENSA Marrakech", url: "https://www.ensa.uca.ma", field: "Ingénierie", city: "Marrakech" },
  { name: "INPT Rabat", url: "https://www.inpt.ac.ma", field: "Télécommunications", city: "Rabat" },
  { name: "École Polytechnique de Thiès", url: "https://www.ept.sn", field: "Ingénierie", city: "Rabat" },
  { name: "ISCAE Casablanca", url: "https://www.iscae.ac.ma", field: "Management", city: "Casablanca" },
  { name: "Université Cadi Ayyad", url: "https://www.uca.ma", field: "Pluridisciplinaire", city: "Marrakech" },
];

const FOREIGN_UNIS = [
  { name: "Sorbonne Université", url: "https://www.sorbonne-universite.fr", country: "🇫🇷 France", field: "Lettres & Sciences" },
  { name: "Sciences Po Paris", url: "https://www.sciencespo.fr", country: "🇫🇷 France", field: "Sciences Politiques" },
  { name: "HEC Paris", url: "https://www.hec.edu", country: "🇫🇷 France", field: "Management" },
  { name: "McGill University", url: "https://www.mcgill.ca", country: "🇨🇦 Canada", field: "Pluridisciplinaire" },
  { name: "Université de Montréal", url: "https://www.umontreal.ca", country: "🇨🇦 Canada", field: "Pluridisciplinaire" },
  { name: "Al-Azhar University", url: "https://www.azhar.edu.eg", country: "🇪🇬 Égypte", field: "Sciences Islamiques" },
  { name: "King Abdulaziz University", url: "https://www.kau.edu.sa", country: "🇸🇦 Arabie Saoudite", field: "Ingénierie & Sciences" },
  { name: "University of Toronto", url: "https://www.utoronto.ca", country: "🇨🇦 Canada", field: "Pluridisciplinaire" },
];

function getAIOrientation(notes, niveau) {
  if (!notes || notes.length === 0) return null;
  const avg = notes.reduce((a, b) => a + (b.valeur || 0), 0) / notes.length;
  const mathNotes = notes.filter(n => n.matiere?.toLowerCase().includes('math'));
  const mathAvg = mathNotes.length > 0 ? mathNotes.reduce((a, b) => a + (b.valeur || 0), 0) / mathNotes.length : 0;
  const scienceNotes = notes.filter(n => ['physique','chimie','svt','science'].some(s => n.matiere?.toLowerCase().includes(s)));
  const scienceAvg = scienceNotes.length > 0 ? scienceNotes.reduce((a, b) => a + (b.valeur || 0), 0) / scienceNotes.length : 0;
  const langNotes = notes.filter(n => ['français','anglais','arabe'].some(s => n.matiere?.toLowerCase().includes(s)));
  const langAvg = langNotes.length > 0 ? langNotes.reduce((a, b) => a + (b.valeur || 0), 0) / langNotes.length : 0;

  if (mathAvg >= 14 && scienceAvg >= 14) return { filiere: "Sciences & Ingénierie", icon: "🔬", desc: "Vos notes en Maths et Sciences sont excellentes. Vous êtes fait pour les filières scientifiques et d'ingénierie.", color: "#2563eb" };
  if (mathAvg >= 14 && avg >= 13) return { filiere: "Économie & Gestion", icon: "📊", desc: "Votre niveau en Maths combiné à une bonne moyenne générale vous oriente vers les filières économiques.", color: "#16a34a" };
  if (langAvg >= 14 && avg >= 12) return { filiere: "Lettres & Sciences Humaines", icon: "📚", desc: "Votre maîtrise des langues est remarquable. Les filières littéraires et sciences humaines vous correspondent.", color: "#9333ea" };
  if (avg >= 14) return { filiere: "Classe Préparatoire", icon: "🏆", desc: "Votre excellence générale vous permet de viser les classes préparatoires aux grandes écoles.", color: "#d97706" };
  if (avg >= 10) return { filiere: "Formation Professionnelle", icon: "🛠️", desc: "Une formation professionnelle ou BTS vous permettra de vous spécialiser rapidement.", color: "#0891b2" };
  return { filiere: "Soutien & Remédiation", icon: "💪", desc: "Un accompagnement personnalisé vous aidera à renforcer vos bases et progresser.", color: "#dc2626" };
}

export default function StudentPortal() {
  const [step, setStep] = useState('login'); // login | setup | dashboard
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const navy = '#1e2d4f';
  const gold = '#C9963F';

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/api/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Code ou mot de passe incorrect');
      if (data.mustSetPassword) { setStudent(data.student); setStep('setup'); }
      else { setStudent(data.student); setStep('dashboard'); }
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function handleSetupPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    if (newPassword.length < 6) { setError('Minimum 6 caractères'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/student/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStudent(data.student); setStep('dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const TAWJIH_LEVELS = ['9ème', '5ème', '6ème', 'Bac', 'Tronc Commun', '1ère Bac', '2ème Bac'];
  const isTawjihLevel = student && TAWJIH_LEVELS.some(l => student.niveau?.includes(l.replace('ème','').replace('Bac','Bac')));
  const orientation = student ? getAIOrientation(student.notes || [], student.niveau) : null;

  const inputStyle = { width:'100%', padding:'12px 16px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, outline:'none', boxSizing:'border-box' };
  const btnStyle = { width:'100%', padding:'13px', borderRadius:10, background:navy, color:'white', border:'none', fontSize:15, fontWeight:600, cursor:'pointer' };

  if (step === 'login') return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${navy} 0%, #2d4a7a 100%)`, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:20, padding:40, width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🎓</div>
          <h1 style={{ fontSize:24, fontWeight:700, color:navy, margin:0 }}>Espace Étudiant</h1>
          <p style={{ color:'#6b7280', fontSize:13, marginTop:6 }}>Connectez-vous avec votre code unique</p>
        </div>
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>CODE ÉTUDIANT</label>
            <input style={inputStyle} placeholder="Ex: LUX-2025-001" value={code} onChange={e => setCode(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>MOT DE PASSE</label>
            <input style={inputStyle} type="password" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#dc2626' }}>{error}</div>}
          <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Connexion...' : 'Accéder à mon espace →'}</button>
        </form>
        <p style={{ textAlign:'center', fontSize:12, color:'#9ca3af', marginTop:20 }}>Votre code vous a été remis par votre école</p>
      </div>
    </div>
  );

  if (step === 'setup') return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${navy} 0%, #2d4a7a 100%)`, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:20, padding:40, width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🔐</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:navy }}>Créez votre mot de passe</h1>
          <p style={{ color:'#6b7280', fontSize:13 }}>Bienvenue {student?.prenom} ! Première connexion détectée.</p>
        </div>
        <form onSubmit={handleSetupPassword} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>NOUVEAU MOT DE PASSE</label>
            <input style={inputStyle} type="password" placeholder="Minimum 6 caractères" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>CONFIRMER</label>
            <input style={inputStyle} type="password" placeholder="Répétez le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#dc2626' }}>{error}</div>}
          <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Enregistrement...' : 'Confirmer mon mot de passe'}</button>
        </form>
      </div>
    </div>
  );

  const tabs = [
    { id:'home', label:'Accueil', icon:'🏠' },
    { id:'notes', label:'Notes', icon:'📊' },
    { id:'presences', label:'Absences', icon:'📋' },
    { id:'devoirs', label:'Devoirs', icon:'📝' },
    ...(isTawjihLevel ? [{ id:'tawjih', label:'Tawjih', icon:'🎯' }] : []),
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background:navy, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'white' }}>
            {student?.prenom?.[0]}{student?.nom?.[0]}
          </div>
          <div>
            <div style={{ color:'white', fontWeight:600, fontSize:15 }}>{student?.prenom} {student?.nom}</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{student?.niveau} · {student?.classe}</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.1)', padding:'6px 14px', borderRadius:20, color:'rgba(255,255,255,0.8)', fontSize:12 }}>
          {student?.code}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'white', borderBottom:'1px solid #e5e7eb', display:'flex', overflowX:'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding:'14px 20px', border:'none', background:'none', cursor:'pointer', fontSize:13, fontWeight:activeTab===t.id?700:400, color:activeTab===t.id?navy:'#6b7280', borderBottom:activeTab===t.id?`3px solid ${navy}`:'3px solid transparent', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:20 }}>

        {/* HOME */}
        {activeTab === 'home' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:navy, borderRadius:16, padding:24, color:'white' }}>
              <div style={{ fontSize:22, fontWeight:700 }}>Bonjour, {student?.prenom} ! 👋</div>
              <div style={{ fontSize:13, opacity:0.7, marginTop:4 }}>Année scolaire 2025-2026</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:20 }}>
                {[
                  { label:'Moyenne générale', value: student?.notes?.length > 0 ? (student.notes.reduce((a,b)=>a+(b.valeur||0),0)/student.notes.length).toFixed(2)+'/20' : '--', icon:'📊' },
                  { label:'Absences ce mois', value: (student?.absences?.length || 0)+'h', icon:'📋' },
                  { label:'Devoirs en attente', value: (student?.devoirs?.filter(d=>!d.rendu)?.length || 0), icon:'📝' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:16, textAlign:'center' }}>
                    <div style={{ fontSize:24 }}>{s.icon}</div>
                    <div style={{ fontSize:20, fontWeight:700, marginTop:4 }}>{s.value}</div>
                    <div style={{ fontSize:11, opacity:0.7 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {orientation && (
              <div style={{ background:'white', borderRadius:16, padding:20, border:`2px solid ${orientation.color}20` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:28 }}>{orientation.icon}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:orientation.color, textTransform:'uppercase', letterSpacing:'.05em' }}>Orientation IA recommandée</div>
                    <div style={{ fontSize:18, fontWeight:700, color:navy }}>{orientation.filiere}</div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:'#4b5563', lineHeight:1.6, margin:0 }}>{orientation.desc}</p>
                <button onClick={() => setActiveTab('tawjih')} style={{ marginTop:14, background:orientation.color, color:'white', border:'none', borderRadius:8, padding:'8px 18px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Voir les établissements recommandés →
                </button>
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div style={{ background:'white', borderRadius:16, padding:20 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:navy, marginBottom:16 }}>📊 Mes Notes</h2>
            {student?.notes?.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {student.notes.map((n, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#f8fafc', borderRadius:10 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:navy }}>{n.matiere}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{n.type} · {n.date}</div>
                    </div>
                    <div style={{ fontSize:22, fontWeight:700, color: n.valeur >= 10 ? '#16a34a' : '#dc2626' }}>{n.valeur}<span style={{ fontSize:13, color:'#9ca3af' }}>/20</span></div>
                  </div>
                ))}
              </div>
            ) : <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Aucune note disponible pour le moment</div>}
          </div>
        )}

        {/* PRESENCES */}
        {activeTab === 'presences' && (
          <div style={{ background:'white', borderRadius:16, padding:20 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:navy, marginBottom:16 }}>📋 Mes Absences</h2>
            {student?.absences?.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {student.absences.map((a, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#fef2f2', borderRadius:10, border:'1px solid #fecaca' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:navy }}>{a.matiere}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{a.date} · {a.heure}</div>
                    </div>
                    <span style={{ background: a.justifiee ? '#dcfce7' : '#fef2f2', color: a.justifiee ? '#16a34a' : '#dc2626', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>
                      {a.justifiee ? 'Justifiée' : 'Non justifiée'}
                    </span>
                  </div>
                ))}
              </div>
            ) : <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Aucune absence enregistrée 🎉</div>}
          </div>
        )}

        {/* DEVOIRS */}
        {activeTab === 'devoirs' && (
          <div style={{ background:'white', borderRadius:16, padding:20 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:navy, marginBottom:16 }}>📝 Mes Devoirs</h2>
            {student?.devoirs?.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {student.devoirs.map((d, i) => (
                  <div key={i} style={{ padding:'14px 16px', background:'#f8fafc', borderRadius:10, border:'1px solid #e5e7eb' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:navy }}>{d.titre}</div>
                        <div style={{ fontSize:12, color:'#6b7280', marginTop:3 }}>{d.matiere} · Pour le {d.dateLimite}</div>
                        {d.description && <div style={{ fontSize:13, color:'#4b5563', marginTop:6 }}>{d.description}</div>}
                      </div>
                      <span style={{ background: d.rendu ? '#dcfce7' : '#fef9c3', color: d.rendu ? '#16a34a' : '#d97706', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>
                        {d.rendu ? '✓ Rendu' : '⏳ En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Aucun devoir pour le moment</div>}
          </div>
        )}

        {/* TAWJIH */}
        {activeTab === 'tawjih' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:`linear-gradient(135deg, ${navy}, #2d4a7a)`, borderRadius:16, padding:24, color:'white', textAlign:'center' }}>
              <div style={{ fontSize:40 }}>🎯</div>
              <h2 style={{ fontSize:22, fontWeight:700, margin:'8px 0 4px' }}>Tawjih — Orientation Scolaire</h2>
              <p style={{ opacity:0.7, fontSize:13, margin:0 }}>Première plateforme d'orientation IA au Maroc pour lycéens</p>
            </div>

            {orientation && (
              <div style={{ background:'white', borderRadius:16, padding:20, border:`2px solid ${orientation.color}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:orientation.color, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8 }}>🤖 Recommandation IA basée sur vos résultats</div>
                <div style={{ fontSize:20, fontWeight:700, color:navy }}>{orientation.icon} {orientation.filiere}</div>
                <p style={{ fontSize:13, color:'#4b5563', marginTop:8, lineHeight:1.6 }}>{orientation.desc}</p>
              </div>
            )}

            <div style={{ background:'white', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:navy, marginBottom:16 }}>🇲🇦 Établissements Marocains</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:12 }}>
                {MOROCCAN_UNIS.map((u, i) => (
                  <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', background:'#f8fafc', borderRadius:12, padding:16, border:'1px solid #e5e7eb', display:'block', transition:'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor=navy}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e5e7eb'}>
                    <div style={{ fontWeight:600, fontSize:14, color:navy }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'#6b7280', marginTop:4 }}>{u.field} · {u.city}</div>
                    <div style={{ fontSize:12, color:gold, marginTop:6, fontWeight:500 }}>Visiter le site →</div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background:'white', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:navy, marginBottom:16 }}>🌍 Universités Étrangères</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:12 }}>
                {FOREIGN_UNIS.map((u, i) => (
                  <a key={i} href={u.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', background:'#f8fafc', borderRadius:12, padding:16, border:'1px solid #e5e7eb', display:'block' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor=navy}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e5e7eb'}>
                    <div style={{ fontWeight:600, fontSize:14, color:navy }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'#6b7280', marginTop:4 }}>{u.country} · {u.field}</div>
                    <div style={{ fontSize:12, color:gold, marginTop:6, fontWeight:500 }}>Visiter le site →</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
