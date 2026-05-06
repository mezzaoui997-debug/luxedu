import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const ROLES = [
  { id: 'DIRECTOR',      label: 'Directeur',    demo: 'director@school.ma'      },
  { id: 'TEACHER',       label: 'Enseignant',   demo: 'teacher@school.ma'       },
  { id: 'FONCTIONNAIRE', label: 'Fonctionnaire',demo: 'fonctionnaire@school.ma' },
];

const FEATURES = [
  { tag: 'WhatsApp',  text: 'Communication automatisée avec les parents' },
  { tag: 'Massar',    text: 'Export direct format Ministère Education' },
  { tag: 'Analytics', text: 'Tableaux de bord en temps réel' },
  { tag: 'Mobile',    text: 'Application Android disponible' },
];

export default function Login() {
  const [role, setRole]         = useState('DIRECTOR');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const { setAuth }             = useAuthStore();

  const doLogin = async (em, pw, ro) => {
    setLoading(true); setError('');
    try {
      const r = await api.post('/auth/login', { email: em, password: pw, role: ro });
      setAuth(r.data.token, r.data.user, r.data.school);
      navigate('/app');
    } catch {
      setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    } finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    doLogin(email, password, role);
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try {
      // Ensure demo accounts exist
      await api.post('/auth/demo-seed').catch(() => {});
      const selected = ROLES.find(r => r.id === role);
      setEmail(selected.demo);
      setPassword('password123');
      const r = await api.post('/auth/login', { email: selected.demo, password: 'password123', role });
      setAuth(r.data.token, r.data.user, r.data.school);
      navigate('/app');
    } catch {
      setError('Compte de démonstration indisponible. Contactez le support.');
    } finally { setLoading(false); }
  };

  const inputFocus = (e) => { e.target.style.borderColor = '#1B2C5E'; };
  const inputBlur  = (e) => { e.target.style.borderColor = '#E5E9F2'; };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width:'44%', background:'#1B2C5E', display:'flex', flexDirection:'column', padding:'52px 60px', position:'relative', overflow:'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-120, right:-120, width:360, height:360, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:240, height:240, borderRadius:'50%', background:'rgba(201,168,76,0.06)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:72 }}>
          <img src="/luxedu-logo.png" alt="LuxEdu" style={{ width:48, height:48, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.9 }} />
          <div>
            <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.3px', lineHeight:1 }}>LuxEdu</div>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.14em', color:'rgba(255,255,255,0.4)', marginTop:4 }}>PLATEFORME DE GESTION SCOLAIRE</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:34, fontWeight:700, color:'#fff', lineHeight:1.2, letterSpacing:'-0.8px', marginBottom:20 }}>
            Le logiciel de gestion<br />
            scolaire conçu pour<br />
            <span style={{ color:'#C9A84C' }}>les écoles du Maroc.</span>
          </div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.75, fontWeight:400, marginBottom:44, maxWidth:340 }}>
            Présences, paiements, notes et communication parents — centralisés dans une seule plateforme professionnelle.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {FEATURES.map(f => (
              <div key={f.tag} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'#1B2C5E', background:'#C9A84C', padding:'3px 10px', borderRadius:4, flexShrink:0, minWidth:70, textAlign:'center' }}>{f.tag}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.65)', fontWeight:400 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:32 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.28)', letterSpacing:'0.03em' }}>LuxEdu · Plateforme SaaS · Maroc · 2026</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, background:'#F7F9FC', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 40px' }}>
        <div style={{ width:'100%', maxWidth:400 }}>

          {/* Card */}
          <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', boxShadow:'0 4px 32px rgba(0,0,0,0.08)', border:'1px solid #E5E9F2' }}>

            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:24, fontWeight:700, color:'#111827', letterSpacing:'-0.5px', marginBottom:6 }}>Connexion</div>
              <div style={{ fontSize:14, color:'#6B7280', fontWeight:400 }}>Sélectionnez votre espace de travail</div>
            </div>

            {/* Role tabs */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:24, background:'#F3F4F6', borderRadius:10, padding:4 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  padding:'9px 4px', border:'none', borderRadius:8, fontSize:13, fontWeight:role===r.id?700:500,
                  cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
                  background: role===r.id ? '#fff' : 'transparent',
                  color: role===r.id ? '#1B2C5E' : '#6B7280',
                  boxShadow: role===r.id ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                }}>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>Adresse e-mail</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  onFocus={inputFocus} onBlur={inputBlur}
                  placeholder="votre@email.ma"
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E5E9F2', borderRadius:8, fontSize:14, color:'#111827', background:'#FAFBFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' }}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>Mot de passe</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  onFocus={inputFocus} onBlur={inputBlur}
                  placeholder="••••••••"
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E5E9F2', borderRadius:8, fontSize:14, color:'#111827', background:'#FAFBFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' }}
                />
              </div>

              {error && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#DC2626', lineHeight:1.5 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', background: loading ? '#6B7280' : '#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor: loading ? 'default' : 'pointer', letterSpacing:'0.02em', fontFamily:'inherit', marginTop:4, transition:'background .2s' }}>
                {loading ? 'Connexion en cours...' : 'Accéder à mon espace'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
              <div style={{ flex:1, height:1, background:'#E5E9F2' }} />
              <span style={{ fontSize:12, color:'#9CA3AF' }}>ou</span>
              <div style={{ flex:1, height:1, background:'#E5E9F2' }} />
            </div>

            <button onClick={handleDemo} disabled={loading} style={{ width:'100%', padding:'12px', background:'transparent', color:'#6B7280', border:'1.5px solid #E5E9F2', borderRadius:8, fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
              onMouseEnter={e=>{ e.target.style.borderColor='#1B2C5E'; e.target.style.color='#1B2C5E'; }}
              onMouseLeave={e=>{ e.target.style.borderColor='#E5E9F2'; e.target.style.color='#6B7280'; }}>
              Accès démonstration
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop:20, textAlign:'center', fontSize:12, color:'#9CA3AF', lineHeight:1.6 }}>
            Une question ?{' '}
            <a href="mailto:contact@luxedu.ma" style={{ color:'#1B2C5E', textDecoration:'none', fontWeight:600 }}>contact@luxedu.ma</a>
          </div>
        </div>
      </div>
    </div>
  );
}
