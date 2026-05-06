import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const ROLES = [
  { id: 'DIRECTOR',      label: 'Directeur',     email: 'director@school.ma'      },
  { id: 'TEACHER',       label: 'Enseignant',    email: 'teacher@school.ma'       },
  { id: 'FONCTIONNAIRE', label: 'Fonctionnaire', email: 'fonctionnaire@school.ma' },
];

export default function Login() {
  const [role,     setRole]     = useState('DIRECTOR');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate                = useNavigate();
  const { setAuth }             = useAuthStore();

  const login = async (em, pw) => {
    setLoading(true); setError('');
    try {
      const r = await api.post('/auth/login', { email: em, password: pw });
      setAuth(r.data.token, r.data.user, r.data.school);
      navigate('/app');
    } catch (err) {
      setError(err?.response?.data?.error || 'Identifiants incorrects.');
    } finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    login(email, password);
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/demo-seed').catch(() => {});
      const r = ROLES.find(r => r.id === role);
      await login(r.email, 'password123');
    } catch (err) {
      setError('Démo indisponible. Réessayez dans quelques instants.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#F7F9FC',
    }}>

      {/* ── LEFT ── */}
      <div style={{
        width: '42%', minHeight: '100vh',
        background: 'linear-gradient(160deg, #1B2C5E 0%, #0F1D42 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '52px 60px', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-140, right:-140, width:380, height:380, borderRadius:'50%', background:'rgba(201,168,76,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, left:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(201,168,76,0.04)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:72 }}>
          <div style={{
            width:52, height:52, borderRadius:14,
            background:'rgba(201,168,76,0.15)',
            border:'1.5px solid rgba(201,168,76,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            overflow:'hidden',
          }}>
            <img src="/luxedu-logo.png" alt="LuxEdu"
              style={{ width:36, height:36, objectFit:'contain', filter:'brightness(0) saturate(100%) invert(75%) sepia(45%) saturate(500%) hue-rotate(5deg)' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#C9A84C">L</span>';
              }}
            />
          </div>
          <div>
            <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:700, color:'#FFFFFF', letterSpacing:'-0.3px' }}>LuxEdu</div>
            <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.16em', color:'rgba(255,255,255,0.4)', marginTop:3, textTransform:'uppercase' }}>Plateforme de Gestion Scolaire</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:36, fontWeight:700, color:'#FFFFFF', lineHeight:1.22, letterSpacing:'-0.8px', marginBottom:22 }}>
            Le logiciel conçu<br />
            pour les écoles<br />
            <span style={{ color:'#C9A84C' }}>privées du Maroc.</span>
          </div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.75, marginBottom:48, maxWidth:340, fontWeight:400 }}>
            Présences, paiements, notes et communication parents centralisés dans une seule plateforme professionnelle.
          </p>

          {/* Feature pills */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              ['WhatsApp',  'Communication automatisée avec les parents'],
              ['Massar',    'Export format Ministère Éducation Nationale'],
              ['Analytics', 'Tableaux de bord et rapports en temps réel'],
              ['Android',   'Application mobile disponible sur Play Store'],
            ].map(([tag, text]) => (
              <div key={tag} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{
                  fontSize:10, fontWeight:700, letterSpacing:'0.06em',
                  color:'#1B2C5E', background:'#C9A84C',
                  padding:'4px 12px', borderRadius:5,
                  flexShrink:0, minWidth:74, textAlign:'center',
                }}>{tag}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:400 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop:36, borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:40 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', letterSpacing:'0.04em' }}>
            © 2026 LuxEdu · Plateforme SaaS · Maroc
          </span>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'40px',
      }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Card */}
          <div style={{
            background:'#FFFFFF', borderRadius:20,
            padding:'44px 40px',
            boxShadow:'0 8px 40px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
          }}>
            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <h1 style={{ fontSize:26, fontWeight:700, color:'#111827', letterSpacing:'-0.6px', marginBottom:6, fontFamily:"'Georgia',serif" }}>
                Connexion
              </h1>
              <p style={{ fontSize:14, color:'#6B7280', fontWeight:400 }}>
                Sélectionnez votre espace et connectez-vous
              </p>
            </div>

            {/* Role selector */}
            <div style={{ background:'#F3F4F6', borderRadius:12, padding:5, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, marginBottom:28 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => { setRole(r.id); setError(''); }}
                  style={{
                    padding:'10px 6px', border:'none', borderRadius:9, fontSize:13,
                    fontWeight: role === r.id ? 700 : 500,
                    cursor:'pointer', fontFamily:'inherit', transition:'all .18s',
                    background: role === r.id ? '#1B2C5E' : 'transparent',
                    color: role === r.id ? '#FFFFFF' : '#6B7280',
                    boxShadow: role === r.id ? '0 2px 8px rgba(27,44,94,0.3)' : 'none',
                  }}>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>
                  Adresse e-mail
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.ma"
                  style={{
                    width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB',
                    borderRadius:10, fontSize:14, color:'#111827', background:'#FAFBFC',
                    outline:'none', fontFamily:'inherit', transition:'border-color .15s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1B2C5E'}
                  onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div style={{ marginBottom:22 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>
                  Mot de passe
                </label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB',
                    borderRadius:10, fontSize:14, color:'#111827', background:'#FAFBFC',
                    outline:'none', fontFamily:'inherit', transition:'border-color .15s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1B2C5E'}
                  onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {error && (
                <div style={{
                  background:'#FEF2F2', border:'1px solid #FECACA',
                  borderRadius:10, padding:'11px 16px',
                  fontSize:13, color:'#DC2626', lineHeight:1.5, marginBottom:18,
                }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'14px', background: loading ? '#9CA3AF' : '#1B2C5E',
                color:'#FFFFFF', border:'none', borderRadius:10,
                fontSize:15, fontWeight:700, cursor: loading ? 'default' : 'pointer',
                letterSpacing:'0.01em', fontFamily:'inherit', transition:'all .2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(27,44,94,0.3)',
              }}>
                {loading ? 'Connexion...' : 'Accéder à mon espace'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:14, margin:'22px 0' }}>
              <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
              <span style={{ fontSize:12, color:'#D1D5DB', fontWeight:500 }}>ou</span>
              <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
            </div>

            {/* Demo button */}
            <button onClick={handleDemo} disabled={loading} style={{
              width:'100%', padding:'13px', background:'transparent',
              color:'#6B7280', border:'1.5px solid #E5E7EB',
              borderRadius:10, fontSize:14, fontWeight:600,
              cursor: loading ? 'default' : 'pointer', fontFamily:'inherit', transition:'all .18s',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor='#C9A84C'; e.currentTarget.style.color='#92700A'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#6B7280'; }}>
              Accès démonstration
            </button>

            {/* Info */}
            <p style={{ marginTop:16, textAlign:'center', fontSize:12, color:'#9CA3AF' }}>
              Démo : connexion automatique sans saisie
            </p>
          </div>

          {/* Footer link */}
          <p style={{ marginTop:24, textAlign:'center', fontSize:12, color:'#9CA3AF', lineHeight:1.6 }}>
            Une question ?{' '}
            <a href="mailto:contact@luxedu.ma" style={{ color:'#1B2C5E', textDecoration:'none', fontWeight:600 }}>
              contact@luxedu.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
