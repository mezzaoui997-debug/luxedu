import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eleves from './pages/Eleves';
import Presences from './pages/Presences';
import Paiements from './pages/Paiements';
import Notes from './pages/Notes';
import Bulletins from './pages/Bulletins';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';
import { useState } from 'react';

function ComingSoon({ title }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)' }}>{title}</div>
      <div style={{ fontSize:13, color:'var(--g2)' }}>Cette section sera disponible prochainement</div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token);
  return token ? children : <Navigate to="/login" />;
}

function AppPages() {
  const [page, setPage] = useState('dashboard');

  const pages = {
    dashboard: <Dashboard setPage={setPage} />,
    eleves: <Eleves />,
    presences: <Presences />,
    notes: <Notes />,
    bulletins: <Bulletins />,
    paiements: <Paiements />,
    parents: <ComingSoon title="Parents & WhatsApp" />,
    planning: <ComingSoon title="Emploi du temps" />,
    classes: <ComingSoon title="Classes & matières" />,
    calendrier: <ComingSoon title="Calendrier scolaire" />,
    certificats: <ComingSoon title="Certificats de scolarité" />,
    messages: <ComingSoon title="Messages" />,
    notifs: <ComingSoon title="Notifications" />,
    parametres: <ComingSoon title="Paramètres" />,
  };

  return (
    <Layout page={page} setPage={setPage}>
      {pages[page] || <ComingSoon title={page} />}
    </Layout>
  );
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
