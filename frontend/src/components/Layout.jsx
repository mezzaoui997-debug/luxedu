import useAuthStore from '../store/authStore';

const navItems = [
  { sec: 'Principal' },
  { id: 'dashboard', ic: '🏠', lbl: 'Tableau de bord' },
  { id: 'eleves', ic: '👥', lbl: 'Eleves' },
  { id: 'parents', ic: '👨‍👩‍👧', lbl: 'Parents & WhatsApp' },
  { id: 'presences', ic: '✅', lbl: 'Presences' },
  { id: 'notes', ic: '📊', lbl: 'Notes & bulletins' },
  { id: 'planning', ic: '📅', lbl: 'Emploi du temps' },
  { sec: 'Classes' },
  { id: 'classes', ic: '🏫', lbl: 'Classes & matieres' },
  { id: 'enseignants', ic: '👨‍🏫', lbl: 'Enseignants' },
  { id: 'import', ic: '📥', lbl: 'Import Excel notes' },
  { sec: 'Finance' },
  { id: 'paiements', ic: '💰', lbl: 'Paiements', dot: true },
  { id: 'calendrier', ic: '📆', lbl: 'Calendrier scolaire' },
  { sec: 'Documents' },
  { id: 'bulletins', ic: '📄', lbl: 'Bulletins PDF' },
  { id: 'certificats', ic: '🎓', lbl: 'Certificats' },
  { sec: 'Outils' },
  { id: 'messages', ic: '💬', lbl: 'Messages', dot: true },
  { id: 'notifs', ic: '🔔', lbl: 'Notifications', dot: true },
  { id: 'parametres', ic: '⚙️', lbl: 'Parametres' },
];

export default function Layout({ children, page, setPage }) {
  const { user, school, logout } = useAuthStore();
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const pageTitles = {
    dashboard:'Tableau de bord', eleves:'Gestion des eleves',
    parents:'Parents & WhatsApp', presences:'Presences',
    notes:'Notes & bulletins', planning:'Emploi du temps',
    classes:'Classes & matieres', enseignants:'Enseignants', import:'Import Excel notes',
    paiements:'Paiements', calendrier:'Calendrier scolaire',
    bulletins:'Bulletins PDF', certificats:'Certificats',
    messages:'Messages', notifs:'Notifications', parametres:'Parametres',
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <div className="sb">
        <div className="sb-top">
          <div className="sb-logo">🏫</div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div className="sb-sname">{school?.name || 'LuxEdu'}</div>
            <div className="sb-scity">Casablanca · Maroc</div>
          </div>
        </div>
        <div className="sb-nav">
          {navItems.map((item, i) => item.sec ? (
            <div key={i} className="sb-sec">{item.sec}</div>
          ) : (
            <div key={item.id} className={'sbi' + (page===item.id?' active':'')} onClick={() => setPage(item.id)}>
              <span style={{ fontSize:14 }}>{item.ic}</span>
              <span style={{ flex:1 }}>{item.lbl}</span>
              {item.dot && <div className="sbi-dot"></div>}
            </div>
          ))}
        </div>
        <div className="sb-bot">
          <div className="sb-usr" onClick={logout}>
            <div className="sb-av">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <div>
              <div className="sb-uname">{user?.firstName} {user?.lastName}</div>
              <div className="sb-urole">Directeur · Se deconnecter</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div className="topbar">
          <div>
            <div className="tb-title">{pageTitles[page] || 'LuxEdu'}</div>
            <div className="tb-sub">{today} · {school?.name}</div>
          </div>
          <div className="tb-r">
            <button className="notif-btn" onClick={() => setPage('notifs')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div className="notif-dot"></div>
            </button>
            <div className="tb-av" onClick={() => setPage('parametres')}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:22 }} className="page-enter">
          {children}
        </div>
      </div>
    </div>
  );
}
