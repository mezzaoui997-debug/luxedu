import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eleves from './pages/Eleves';
import Presences from './pages/Presences';
import Paiements from './pages/Paiements';
import useAuthStore from './store/authStore';
import { useState } from 'react';

function Layout({ children, page, setPage }) {
  const { user, school, logout } = useAuthStore();
  const nav = [['dashboard','🏠','Tableau de bord'],['eleves','👥','Eleves'],['presences','✅','Presences'],['notes','📊','Notes'],['paiements','💰','Paiements'],['parametres','⚙️','Parametres']];
  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:234, background:'#042C53', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'white' }}>{school?.name || 'LuxEdu'}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Casablanca · Maroc</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {nav.map(([id, ic, lbl]) => (
            <div key={id} onClick={() => setPage(id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, color: page===id ? 'white' : 'rgba(255,255,255,0.55)', fontSize:12, marginBottom:2, cursor:'pointer', background: page===id ? 'rgba(255,255,255,0.14)' : 'transparent' }}
              onMouseOver={e => { if(page!==id) e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
              onMouseOut={e => { if(page!==id) e.currentTarget.style.background='transparent'; }}>
              <span>{ic}</span>{lbl}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Directeur · Se déconnecter</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ background:'white', borderBottom:'1px solid #E8E6E0', height:62, padding:'0 22px', display:'flex', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{nav.find(n=>n[0]===page)?.[2] || 'LuxEdu'}</div>
            <div style={{ fontSize:11, color:'#888780' }}>{school?.name} · 2025–2026</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>{children}</div>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token);
  return token ? children : <Navigate to="/login" />;
}

function AppPages() {
  const [page, setPage] = useState('dashboard');
  const pages = { dashboard: <Dashboard setPage={setPage} />, eleves: <Eleves />, presences: <Presences />, paiements: <Paiements />, notes: <div style={{padding:22}}><h2 style={{color:'#042C53'}}>Notes — bientôt disponible</h2></div>, parametres: <div style={{padding:22}}><h2 style={{color:'#042C53'}}>Paramètres — bientôt disponible</h2></div> };
  return <Layout page={page} setPage={setPage}>{pages[page]}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute><AppPages /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
