import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eleves from './pages/Eleves';
import Presences from './pages/Presences';
import Paiements from './pages/Paiements';
import Notes from './pages/Notes';
import Bulletins from './pages/Bulletins';
import Classes from './pages/Classes';
import Enseignants from './pages/Enseignants';
import ImportNotes from './pages/ImportNotes';
import TeacherDashboard from './pages/TeacherDashboard';
import FonctionnaireDashboard from './pages/FonctionnaireDashboard';
import Notifications from './pages/Notifications';
import Parametres from './pages/Parametres';
import Rapports from './pages/Rapports';
import Certificats from './pages/Certificats';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';
import { useState } from 'react';
import Messages from './pages/Messages';
import RendezVous from './pages/RendezVous';
import Budget from './pages/Budget';
import Documents from './pages/Documents';
import CRM from './pages/CRM';
import CahierTexte from './pages/CahierTexte';
import LandingPage from './pages/LandingPage';
import ParentPortal from './pages/ParentPortal';

function ComingSoon({ title }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
      <div style={{ fontSize:48 }}></div>
      <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)' }}>{title}</div>
      <div style={{ fontSize:13, color:'var(--g2)' }}>Cette section sera disponible prochainement</div>
    </div>
  );
}

function DirectorPages() {
  const [page, setPage] = useState('dashboard');
  if (page === 'messages')   return <Layout page={page} setPage={setPage}><Messages /></Layout>;
  if (page === 'rendezvous') return <Layout page={page} setPage={setPage}><RendezVous /></Layout>;
  if (page === 'budget')     return <Layout page={page} setPage={setPage}><Budget /></Layout>;
  if (page === 'documents')  return <Layout page={page} setPage={setPage}><Documents /></Layout>;
  if (page === 'crm')        return <Layout page={page} setPage={setPage}><CRM /></Layout>;
  if (page === 'cahier')     return <Layout page={page} setPage={setPage}><CahierTexte /></Layout>;
  const pages = {
    dashboard: <Dashboard setPage={setPage} />,
    eleves: <Eleves />,
    presences: <Presences />,
    notes: <Notes />,
    bulletins: <Bulletins />,
    paiements: <Paiements />,
    classes: <Classes />,
    enseignants: <Enseignants />,
    import: <ImportNotes />,
    notifs: <Notifications />,
    parametres: <Parametres />,
    rapports: <Rapports />,
    certificats: <Certificats />,
  };
  return (
    <Layout page={page} setPage={setPage}>
      {pages[page] || <ComingSoon title={page} />}
    </Layout>
  );
}

function RoleRoute() {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (user?.role === 'TEACHER') return <TeacherDashboard />;
  if (user?.role === 'FONCTIONNAIRE') return <FonctionnaireDashboard />;
  return <DirectorPages />;
}

function HomeRoute() {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/app" />;
  return <LandingPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/parent" element={<ParentPortal />} />
        <Route path="/app" element={<RoleRoute />} />
        <Route path="/app/*" element={<RoleRoute />} />
        <Route path="/*" element={<RoleRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
