import useAuthStore from '../store/authStore';

const NAV = [
  { sec:'Vue generale' },
  { id:'dashboard', lbl:'Tableau de bord', ic:'⊞' },
  { id:'notifs', lbl:'Notifications', ic:'🔔', badge:'7' },
  { sec:'Eleves & Notes' },
  { id:'eleves', lbl:'Tous les eleves', ic:'👥' },
  { id:'notes', lbl:'Notes & resultats', ic:'📊' },
  { id:'bulletins', lbl:'Bulletins PDF', ic:'📄' },
  { id:'presences', lbl:'Presences', ic:'✓' },
  { sec:'Finances' },
  { id:'paiements', lbl:'Paiements', ic:'💰', badge:'!' },
  { sec:'Ecole' },
  { id:'classes', lbl:'Classes', ic:'🏫' },
  { id:'enseignants', lbl:'Equipe & Acces', ic:'👩‍🏫' },
  { id:'import', lbl:'Import / Export', ic:'📥' },
  { sec:'Parametres' },
  { id:'parametres', lbl:'Parametres', ic:'⚙' },
];

export default function Layout({ children, page, setPage }) {
  const { user, school, logout } = useAuthStore();

  const pageTitles = {
    dashboard: ['Tableau de bord', 'Vue generale de votre ecole'],
    notifs: ['Notifications', '7 nouvelles alertes'],
    eleves: ['Tous les eleves', 'Dossiers et suivi'],
    notes: ['Notes & resultats', 'Consultation par classe et matiere'],
    bulletins: ['Bulletins PDF', 'Generation bulletins conformes MEN'],
    presences: ['Presences', 'Suivi des absences'],
    paiements: ['Paiements', 'Suivi des frais de scolarite'],
    classes: ['Classes & matieres', 'Organisation pedagogique'],
    enseignants: ['Equipe & Acces', 'Personnel et comptes utilisateurs'],
    import: ['Import / Export', 'Donnees Excel'],
    arabic: ['Support Arabe RTL', 'Interface bilingue FR/AR'],
    parametres: ['Parametres', "Configuration de l'ecole"],
  };

  const t = pageTitles[page] || ['LuxEdu', ''];

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <div style={{ width:234, background:'var(--navy)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:16, fontWeight:700, color:'white' }}>Lux</span>
              <span style={{ fontSize:16, fontWeight:200, color:'var(--gold)' }}>Edu</span>
              <span style={{ background:'var(--gold)', color:'var(--gd)', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:8 }}>PRO</span>
            </div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{school?.name}</div>
          </div>
        </div>

        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {NAV.map((item, i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,0.2)', padding:'12px 10px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2, fontSize:12,
                background: page===item.id ? 'rgba(255,255,255,0.13)' : 'transparent',
                color: page===item.id ? 'white' : 'rgba(255,255,255,0.45)',
                transition:'all .15s' }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{item.ic}</span>
              <span style={{ flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.lbl}</span>
              {item.badge && <span style={{ background:item.badge==='7'?'#E24B4A':'var(--gold)', color:item.badge==='7'?'white':'var(--gd)', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:9 }}>{item.badge}</span>}
            </div>
          ))}
        </div>

        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
            onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--blue)', color:'white', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div style={{ overflow:'hidden', minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Directeur · Deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ background:'white', borderBottom:'1px solid var(--g1)', height:62, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>{t[0]}</div>
            <div style={{ fontSize:11, color:'var(--g2)' }}>{t[1]}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => setPage('notifs')} style={{ background:'var(--g0)', border:'1px solid var(--g1)', borderRadius:8, padding:'7px 12px', cursor:'pointer', position:'relative', fontSize:14 }}>
              🔔
              <span style={{ position:'absolute', top:-4, right:-4, background:'#E24B4A', color:'white', fontSize:9, fontWeight:700, padding:'1px 4px', borderRadius:8 }}>7</span>
            </button>
            <span style={{ background:'var(--bl)', color:'var(--blue)', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>Directeur</span>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
