import { useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('directeur@excellence-casa.ma');
  const [password, setPassword] = useState('luxedu2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user, res.data.school);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ flex:1, background:'#042C53', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div style={{ fontSize:52, fontWeight:700, color:'white' }}>Lux<span style={{ fontWeight:200, color:'#EF9F27' }}>Edu</span></div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.14em', marginTop:6 }}>PLATEFORME DE GESTION SCOLAIRE — MAROC</div>
        <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14, maxWidth:300 }}>
          {[['💬','Seul logiciel avec WhatsApp natif intégré'],['📄','Bulletins PDF conformes au MEN Maroc'],['💰','Suivi automatique des paiements']].map(([ic,t]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.65)', fontSize:13 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{ic}</div>
              {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ width:460, background:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'44px 40px' }}>
        <div style={{ fontSize:22, fontWeight:700, color:'#042C53', marginBottom:6 }}>Bienvenue sur LuxEdu</div>
        <div style={{ fontSize:13, color:'#888780', marginBottom:24 }}>Connectez-vous à votre espace</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width:'100%', padding:'12px 13px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:14, outline:'none' }} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width:'100%', padding:'12px 13px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:14, outline:'none' }} />
          </div>
          {error && <div style={{ color:'#A32D2D', fontSize:13, marginBottom:12 }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'#042C53', color:'white', border:'none', borderRadius:8, padding:13, fontSize:14, fontWeight:700, cursor:'pointer' }}>
            {loading ? 'Connexion...' : 'Accéder à mon espace →'}
          </button>
        </form>
      </div>
    </div>
  );
}
