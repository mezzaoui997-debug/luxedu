import { useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const ROLES = [
  { id:'DIRECTOR', ic:'🏫', lbl:'Directeur', demo:'directeur@excellence-casa.ma', pass:'luxedu2026' },
  { id:'TEACHER', ic:'👨‍🏫', lbl:'Enseignant', demo:'prof.maths@excellence-casa.ma', pass:'prof2026' },
  { id:'FONCTIONNAIRE', ic:'📋', lbl:'Fonctionnaire', demo:'fonctionnaire@excellence-casa.ma', pass:'fonct2026' },
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
    setLoading(true);
    setError('');
    const r = ROLES.find(r => r.id === role);
    try {
      const res = await api.post('/auth/login', { email: r.demo, password: r.pass });
      login(res.data.token, res.data.user, res.data.school);
      window.location.href = '/';
    } catch {
      setError('Compte demo non disponible. Creez-le d abord.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7', fontFamily:'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
      
      <div style={{ flex:1, background:'var(--navy)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ maxWidth:340, width:'100%' }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:48, fontWeight:700, color:'white', letterSpacing:'-1px', lineHeight:1 }}>
              Lux<span style={{ fontWeight:200, color:'var(--gold)' }}>Edu</span>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.16em', marginTop:6, textTransform:'uppercase' }}>
              Plateforme de gestion scolaire — Maroc
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { ic:'💬', txt:'Seul logiciel avec WhatsApp natif integre' },
              { ic:'📄', txt:'Bulletins PDF conformes au MEN Maroc' },
              { ic:'🤖', txt:'Alertes automatiques eleves a risque (IA)' },
              { ic:'💰', txt:'Suivi automatique des paiements et rappels' },
            ].map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                  {f.ic}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>{f.txt}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:48, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.1em' }}>Ils nous font confiance</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['Excellence Casablanca','Al Amal Rabat','Avenir Marrakech'].map(s => (
                <div key={s} style={{ background:'rgba(255,255,255,0.08)', padding:'4px 10px', borderRadius:20, fontSize:10, color:'rgba(255,255,255,0.5)' }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ width:480, background:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 44px', overflowY:'auto' }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Bienvenue sur LuxEdu</div>
          <div style={{ fontSize:13, color:'var(--g2)' }}>Choisissez votre espace et connectez-vous</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:24 }}>
          {ROLES.map(r => (
            <div key={r.id} onClick={() => { setRole(r.id); setEmail(''); setPassword(''); setError(''); }}
              style={{ border:'2px solid '+(role===r.id?'var(--navy)':'var(--g1)'), borderRadius:10, padding:'12px 8px', textAlign:'center', cursor:'pointer', background:role===r.id?'var(--bl)':'white', transition:'all .15s' }}>
              <div style={{ fontSize:24, marginBottom:5 }}>{r.ic}</div>
              <div style={{ fontSize:12, fontWeight:700, color:role===r.id?'var(--navy)':'var(--g2)' }}>{r.lbl}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:13 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--g2)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder={ROLES.find(r=>r.id===role)?.demo}
              style={{ width:'100%', padding:'11px 13px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:14, outline:'none', transition:'border .15s' }}
              onFocus={e => e.target.style.borderColor='var(--navy)'}
              onBlur={e => e.target.style.borderColor='var(--g1)'} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--g2)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width:'100%', padding:'11px 13px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:14, outline:'none', transition:'border .15s' }}
              onFocus={e => e.target.style.borderColor='var(--navy)'}
              onBlur={e => e.target.style.borderColor='var(--g1)'} />
          </div>
          {error && (
            <div style={{ background:'var(--redl)', color:'var(--red)', padding:'9px 13px', borderRadius:8, fontSize:13, marginBottom:14 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'var(--navy)', color:'white', border:'none', borderRadius:8, padding:13, fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:10, transition:'opacity .15s' }}>
            {loading ? 'Connexion...' : 'Acceder a mon espace →'}
          </button>
          <button type="button" onClick={handleDemo} disabled={loading}
            style={{ width:'100%', background:'var(--gl)', color:'var(--gd)', border:'none', borderRadius:8, padding:11, fontSize:13, fontWeight:700, cursor:'pointer', transition:'opacity .15s' }}>
            Demo : acces direct sans mot de passe →
          </button>
        </form>

        <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--g1)', textAlign:'center' }}>
          <div style={{ fontSize:11, color:'var(--g2)' }}>LuxEdu · Plateforme SaaS · Maroc 🇲🇦</div>
        </div>
      </div>
    </div>
  );
}
