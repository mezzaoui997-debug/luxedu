import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const NAV = [
  { sec: 'Vue générale' },
  { id: 'dashboard',   lbl: 'Tableau de bord'   },
  { id: 'notifs',      lbl: 'Notifications',      badge: '7' },
  { sec: 'Élèves & Notes' },
  { id: 'eleves',      lbl: 'Tous les élèves'    },
  { id: 'notes',       lbl: 'Notes & résultats'  },
  { id: 'bulletins',   lbl: 'Bulletins PDF'      },
  { id: 'certificats', lbl: 'Certificats'        },
  { id: 'presences',   lbl: 'Présences'          },
  { id: 'cahier',      lbl: 'Cahier de texte'    },
  { sec: 'Finances' },
  { id: 'paiements',   lbl: 'Paiements',          badge: '!' },
  { sec: 'École' },
  { id: 'classes',     lbl: 'Classes'            },
  { id: 'enseignants', lbl: 'Équipe & Accès'     },
  { id: 'crm',         lbl: 'CRM Prospects'      },
  { id: 'messages',    lbl: 'Messagerie',         badge:'2' },
  { id: 'rendezvous',  lbl: 'Rendez-vous'         },
  { id: 'budget',      lbl: 'Budget & Dépenses'   },
  { id: 'documents',   lbl: 'Documents'           },
  { sec: 'Paramètres' },
  { id: 'parametres',  lbl: 'Paramètres'         },
];

const PAGE_TITLES = {
  dashboard:   ['Tableau de bord',    'Vue générale de votre école'],
  notifs:      ['Notifications',      '7 nouvelles alertes'],
  eleves:      ['Tous les élèves',    'Dossiers et suivi'],
  notes:       ['Notes & résultats',  'Par classe et matière'],
  bulletins:   ['Bulletins PDF',      'Génération conforme MEN'],
  presences:   ['Présences',          'Suivi des absences'],
  paiements:   ['Paiements',          'Frais de scolarité'],
  classes:     ['Classes',            'Organisation pédagogique'],
  enseignants: ['Équipe & Accès',     'Personnel et comptes'],
  crm:         ['CRM Prospects',        'Pipeline d\'inscriptions'],
  parametres:  ['Paramètres',         "Configuration de l'école"],
  messages:    ['Messagerie interne',  'Communication entre équipes'],
  cahier:      ['Cahier de texte',     'Devoirs et leçons'],
  rendezvous:  ['Rendez-vous parents',  'Entretiens parents-professeurs'],
  budget:      ['Budget & Dépenses',   'Suivi financier de l\'établissement'],
  documents:   ['Espace documentaire', 'Partage et archivage des documents'],
  rapports:    ['Rapports',           'Analyses et exports'],
  certificats: ['Certificats',        'Documents officiels'],
};

export default function Layout({ children, page, setPage }) {
  const { user, school, schoolLogo, logout } = useAuthStore();

  // Apply saved theme on mount
  useEffect(() => {
    const THEMES = {
      navy:   { primary:'#1B2C5E', accent:'#93C5FD' },
      green:  { primary:'#065F46', accent:'#6EE7B7' },
      purple: { primary:'#4C1D95', accent:'#C4B5FD' },
      slate:  { primary:'#1E293B', accent:'#94A3B8' },
      maroon: { primary:'#7F1D1D', accent:'#FCA5A5' },
      teal:   { primary:'#134E4A', accent:'#5EEAD4' },
    };
    const saved = localStorage.getItem('luxedu-theme') || 'navy';
    const t = THEMES[saved] || THEMES.navy;
    document.documentElement.style.setProperty('--sidebar-bg', t.primary);
    document.documentElement.style.setProperty('--accent', t.accent);
    setSidebarBg(t.primary);
    setSidebarAccent(t.accent);
  }, []);
  const [title, subtitle] = PAGE_TITLES[page] || ['LuxEdu', ''];
  const [sidebarBg, setSidebarBg] = useState(localStorage.getItem('luxedu-theme') === 'green' ? '#065F46' : localStorage.getItem('luxedu-theme') === 'purple' ? '#4C1D95' : localStorage.getItem('luxedu-theme') === 'slate' ? '#1E293B' : localStorage.getItem('luxedu-theme') === 'maroon' ? '#7F1D1D' : localStorage.getItem('luxedu-theme') === 'teal' ? '#134E4A' : '#1B2C5E');
  const [sidebarAccent, setSidebarAccent] = useState(localStorage.getItem('luxedu-theme') === 'green' ? '#6EE7B7' : localStorage.getItem('luxedu-theme') === 'purple' ? '#C4B5FD' : localStorage.getItem('luxedu-theme') === 'slate' ? '#94A3B8' : localStorage.getItem('luxedu-theme') === 'maroon' ? '#FCA5A5' : localStorage.getItem('luxedu-theme') === 'teal' ? '#5EEAD4' : '#93C5FD');
  const roleLabel = { DIRECTOR:'Directeur', TEACHER:'Enseignant', FONCTIONNAIRE:'Fonctionnaire' }[user?.role] || 'Utilisateur';

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:240, background:sidebarBg, display:'flex', flexDirection:'column', flexShrink:0, boxShadow:'2px 0 16px rgba(0,0,0,0.18)' }}>

        {/* School identity header */}
        <div style={{ padding:'0 16px', height:74, display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          <div style={{ width:44, height:44, borderRadius:11, background: schoolLogo ? 'white' : 'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            {schoolLogo
              ? <img src={schoolLogo} alt={school?.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} />
              : <span style={{ fontSize:18, fontWeight:800, color:'rgba(255,255,255,0.75)', fontFamily:"'Georgia',serif" }}>{(school?.name||'E')[0]}</span>
            }
          </div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.3 }}>{school?.name || 'Mon École'}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.38)', marginTop:2 }}>Espace {roleLabel}</div>
          </div>
        </div>

        {/* Powered by LuxEdu */}
        <div style={{ padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:7 }}>
          <img src="/luxedu-logo-white.png" alt="LuxEdu" style={{ width:18, height:18, objectFit:'contain', opacity:0.6 }} onError={e=>e.target.style.display='none'} />
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.04em' }}>
            Lux<span style={{ color:'#93C5FD' }}>Edu</span>
            <span style={{ marginLeft:5, background:'#93C5FD', color:'#1B2C5E', fontSize:8, fontWeight:800, padding:'1px 5px', borderRadius:3 }}>PRO</span>
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex:1, padding:'8px 8px', overflowY:'auto' }}>
          {NAV.map((item,i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,0.22)', padding:'14px 12px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={()=>setPage(item.id)}
              style={{ display:'flex', alignItems:'center', padding:'9px 12px', borderRadius:8, cursor:'pointer', marginBottom:1, fontSize:13, transition:'all .15s',
                background: page===item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: page===item.id ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                borderLeft: page===item.id ? `2.5px solid ${sidebarAccent}` : '2.5px solid transparent',
                fontWeight: page===item.id ? 600 : 400,
              }}
              onMouseEnter={e=>{ if(page!==item.id){ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.75)'; }}}
              onMouseLeave={e=>{ if(page!==item.id){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}}>
              <span style={{ flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.lbl}</span>
              {item.badge && <span style={{ background:item.badge==='7'?'#EF4444':'#F59E0B', color:'white', fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:8, flexShrink:0 }}>{item.badge}</span>}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          <div onClick={logout} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, cursor:'pointer', transition:'background .15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'#2563EB', color:'white', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div style={{ overflow:'hidden', minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.8)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.32)' }}>{roleLabel} · Déconnecter</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, background:'#F8FAFC' }}>
        {/* Topbar */}
        <div style={{ background:'#FFFFFF', borderBottom:'1px solid #E2E8F0', height:62, padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0F172A', letterSpacing:'-0.3px' }}>{title}</div>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{subtitle}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={()=>setPage('notifs')} style={{ background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 16px', cursor:'pointer', fontSize:12, fontWeight:600, color:'#475569', position:'relative', fontFamily:'inherit', transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#E2E8F0'}
              onMouseLeave={e=>e.currentTarget.style.background='#F1F5F9'}>
              Alertes
              <span style={{ position:'absolute', top:-5, right:-5, background:'#EF4444', color:'white', fontSize:9, fontWeight:700, padding:'1px 4px', borderRadius:8 }}>7</span>
            </button>
            <div style={{ background:'#EFF6FF', color:'#1B2C5E', fontSize:11, fontWeight:700, padding:'6px 14px', borderRadius:20, border:'1px solid #BFDBFE' }}>{roleLabel}</div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
