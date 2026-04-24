import { useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const ROLES = [
  { id:'DIRECTOR', ic:'🏫', lbl:'Directeur', demo:'directeur@excellence-casa.ma', pass:'luxedu2026' },
  { id:'TEACHER', ic:'👨‍🏫', lbl:'Enseignant', demo:'prof.maths@excellence-casa.ma', pass:'prof2026' },
  { id:'FONCTIONNAIRE', ic:'📋', lbl:'Fonctionnaire', demo:'fonctionnaire@excellence-casa.ma', pass:'fonct2026' },
];

const FEATURES = [
  { tag:'WhatsApp', txt:'Seul logiciel avec WhatsApp natif integre' },
  { tag:'PDF MEN', txt:'Bulletins conformes au Ministere Education' },
  { tag:'IA', txt:'Alertes automatiques eleves a risque' },
  { tag:'Massar', txt:'Export direct format Massar MEN' },
];

export default function Login() {
  const [role, setRole] = useState('DIRECTOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      window.location.href = '/';
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  const handleDemo = async () => {
    const r = ROLES.find(r => r.id === role);
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email: r.demo, password: r.pass });
      login(res.data.token, res.data.user, res.data.school);
      window.location.href = '/';
    } catch {
      setEmail(r.demo);
      setPassword(r.pass);
      setError('Utilisez : ' + r.demo + ' / ' + r.pass);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
      <div style={{ flex:1, background:'#042C53', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ maxWidth:360, width:'100%' }}>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:42, fontWeight:700, color:'white', letterSpacing:'-1px', lineHeight:1 }}>
              Lux<span style={{ fontWeight:200, color:'#EF9F27' }}>Edu</span>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em', marginTop:8, textTransform:'uppercase' }}>
              Plateforme de gestion scolaire — Maroc
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:48, height:26, borderRadius:5, background:'rgba(239,159,39,0.15)', border:'1px solid rgba(239,159,39,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'#EF9F27', letterSpacing:'0.05em' }}>{f.tag}</span>
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.4 }}>{f.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width:460, background:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 44px', overflowY:'auto' }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:20, fontWeight:700, color:'#042C53', marginBottom:4 }}>Bienvenue sur LuxEdu</div>
          <div style={{ fontSize:13, color:'#888780' }}>Choisissez votre espace et connectez-vous</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:24 }}>
          {ROLES.map(r => (
            <div key={r.id} onClick={() => { setRole(r.id); setEmail(''); setPassword(''); setError(''); }}
              style={{ border:'2px solid '+(role===r.id?'#042C53':'#E8E6E0'), borderRadius:10, padding:'12px 8px', textAlign:'center', cursor:'pointer',
                background:role===r.id?'#F0F4F9':'white', transition:'all .15s' }}>
              <div style={{ fontSize:22, marginBottom:5 }}>{r.ic}</div>
              <div style={{ fontSize:12, fontWeight:700, color:role===r.id?'#042C53':'#888780' }}>{r.lbl}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:13 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder={ROLES.find(r => r.id===role)?.demo}
              style={{ width:'100%', padding:'11px 13px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#042C53'}
              onBlur={e => e.target.style.borderColor='#E8E6E0'} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width:'100%', padding:'11px 13px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#042C53'}
              onBlur={e => e.target.style.borderColor='#E8E6E0'} />
          </div>
          {error && (
            <div style={{ background:'#FEF2F2', color:'#A32D2D', padding:'9px 13px', borderRadius:8, fontSize:12, marginBottom:14, border:'1px solid #FECACA' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'#042C53', color:'white', border:'none', borderRadius:8, padding:13, fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:10 }}>
            {loading ? 'Connexion...' : 'Acceder a mon espace'}
          </button>
          <button type="button" onClick={handleDemo} disabled={loading}
            style={{ width:'100%', background:'#F5F5F3', color:'#888780', border:'1px solid #E8E6E0', borderRadius:8, padding:11, fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Acces demonstration
          </button>
        </form>

        <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #E8E6E0', textAlign:'center' }}>
          <div style={{ fontSize:11, color:'#C8C5BE' }}>LuxEdu · Plateforme SaaS · Maroc</div>
        </div>
      </div>
    </div>
  );
}
