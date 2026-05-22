import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const ROLES = [
  { id: 'DIRECTOR',      label: 'Directeur',     email: 'director@school.ma'      },
  { id: 'TEACHER',       label: 'Enseignant',    email: 'teacher@school.ma'       },
  { id: 'FONCTIONNAIRE', label: 'Fonctionnaire', email: 'fonctionnaire@school.ma' },
];

const FEATS = [
  ['WhatsApp',   'Communication automatisée avec les parents'],
  ['Massar MEN', 'Export format Ministère Éducation Nationale'],
  ['Analytics',  'Tableaux de bord en temps réel'],
  ['Android',    'Application mobile sur Play Store'],
];

export default function Login() {
  const [role,     setRole]     = useState('DIRECTOR');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate                = useNavigate();
  const { login }               = useAuthStore(); // ← correct method name

  // Hardcoded demo accounts - work WITHOUT backend
  const DEMO = {
    'director@school.ma':     { id:'d1', firstName:'Ahmed',  lastName:'Benali', role:'DIRECTOR',      schoolId:'demo' },
    'teacher@school.ma':      { id:'d2', firstName:'Sara',   lastName:'Alami',  role:'TEACHER',       schoolId:'demo' },
    'fonctionnaire@school.ma':{ id:'d3', firstName:'Fatima', lastName:'Benali', role:'FONCTIONNAIRE', schoolId:'demo' },
  };
  const DEMO_SCHOOL = { id:'demo', name:'École Excellence Arrow', city:'Casablanca' };

  const doAuth = async (em, pw) => {
    // Try demo accounts first - instant, no backend needed
    if (DEMO[em] && pw === 'password123') {
      const u = DEMO[em];
      login('demo-token-' + u.role, { ...u, email: em }, DEMO_SCHOOL);
      navigate('/app');
      return;
    }
    // Try real backend
    const r = await api.post('/auth/login', { email: em, password: pw });
    login(r.data.token, r.data.user, r.data.school);
    navigate('/app');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    try { await doAuth(email, password); }
    catch (err) { setError(err?.response?.data?.error || 'Email ou mot de passe incorrect.'); }
    finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/demo-seed').catch(() => {});
      const sel = ROLES.find(r => r.id === role);
      await doAuth(sel.email, 'password123');
    } catch (err) {
      setError('Démo indisponible. Réessayez dans quelques instants.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ══════════ LEFT ══════════ */}
      <div style={{
        width: '46%', minHeight: '100vh',
        background: 'linear-gradient(160deg, #1B2C5E 0%, #0F1D42 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '60px 64px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* bg shapes */}
        <div style={{ position:'absolute', top:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-150, left:-80, width:380, height:380, borderRadius:'50%', background:'rgba(255,255,255,0.02)', pointerEvents:'none' }} />

        {/* LOGO — white transparent version, large */}
        <div style={{ marginBottom: 56 }}>
          <img
            src="/luxedu-logo-white.png"
            alt="LuxEdu"
            style={{
              width: 110, height: 110,
              objectFit: 'contain',
              display: 'block',
              marginBottom: 16,
              opacity: 0.95,
            }}
            onError={e => {
              // fallback: show text only
              e.target.style.display = 'none';
            }}
          />
          <div style={{
            fontFamily: "'Georgia', serif",
            fontSize: 28, fontWeight: 700,
            color: '#FFFFFF', letterSpacing: '-0.4px', lineHeight: 1,
          }}>LuxEdu</div>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.38)', marginTop: 6, textTransform: 'uppercase',
          }}>Plateforme de Gestion Scolaire</div>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: 38, fontWeight: 700,
            color: '#FFFFFF', lineHeight: 1.22,
            letterSpacing: '-0.8px',
            margin: '0 0 20px 0',
          }}>
            Le logiciel de gestion<br />
            scolaire conçu pour<br />
            <span style={{ color: '#93C5FD' }}>les écoles du Maroc.</span>
          </h2>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.75, margin: '0 0 48px 0',
            maxWidth: 360, fontWeight: 400,
          }}>
            Présences, paiements, notes et communication parents
            centralisés dans une seule plateforme professionnelle.
          </p>

          {/* Feature badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATS.map(([tag, text]) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  color: '#1B2C5E', background: '#93C5FD',
                  padding: '4px 10px', borderRadius: 5,
                  flexShrink: 0, minWidth: 82, textAlign: 'center',
                }}>{tag}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: 32, marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em' }}>
            © 2026 LuxEdu · luxeduschool.com · Maroc
          </span>
        </div>
      </div>

      {/* ══════════ RIGHT ══════════ */}
      <div style={{
        flex: 1, background: '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{
            background: '#FFFFFF', borderRadius: 20,
            padding: '44px 40px',
            boxShadow: '0 4px 24px rgba(15,23,42,0.09), 0 0 0 1px rgba(15,23,42,0.04)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 30 }}>
              <h1 style={{
                fontFamily: "'Georgia', serif",
                fontSize: 26, fontWeight: 700, color: '#0F172A',
                letterSpacing: '-0.5px', margin: '0 0 6px 0',
              }}>Connexion</h1>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
                Sélectionnez votre espace et connectez-vous
              </p>
            </div>

            {/* Role tabs */}
            <div style={{
              background: '#F1F5F9', borderRadius: 12, padding: 5,
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 28,
            }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => { setRole(r.id); setError(''); }} style={{
                  padding: '10px 6px', border: 'none', borderRadius: 9,
                  fontSize: 13, fontWeight: role === r.id ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                  background: role === r.id ? '#1B2C5E' : 'transparent',
                  color: role === r.id ? '#FFFFFF' : '#64748B',
                  boxShadow: role === r.id ? '0 2px 8px rgba(27,44,94,0.28)' : 'none',
                }}>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  color: '#374151', letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>Adresse e-mail</label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.ma"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '1.5px solid #E2E8F0', borderRadius: 10,
                    fontSize: 14, color: '#0F172A', background: '#F8FAFC',
                    outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1B2C5E'}
                  onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 700,
                  color: '#374151', letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>Mot de passe</label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '1.5px solid #E2E8F0', borderRadius: 10,
                    fontSize: 14, color: '#0F172A', background: '#F8FAFC',
                    outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1B2C5E'}
                  onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              {error && (
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 10, padding: '11px 16px',
                  fontSize: 13, color: '#DC2626',
                  lineHeight: 1.5, marginBottom: 18,
                }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading ? '#94A3B8' : '#1B2C5E',
                color: '#FFFFFF', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'all .2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(27,44,94,0.3)',
              }}>
                {loading ? 'Connexion...' : 'Accéder à mon espace'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: 12, color: '#CBD5E1' }}>ou</span>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            </div>

            {/* Demo */}
            <button onClick={handleDemo} disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'transparent', color: '#475569',
              border: '1.5px solid #E2E8F0', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'all .18s',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#1B2C5E'; e.currentTarget.style.color = '#1B2C5E'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}>
              Accès démonstration
            </button>

            <p style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#94A3B8', margin: '12px 0 0' }}>
              Connexion automatique · Aucune saisie requise
            </p>
          </div>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
            Une question ?{' '}
            <a href="mailto:contact@luxeduschool.com" style={{ color: '#1B2C5E', textDecoration: 'none', fontWeight: 600 }}>
              contact@luxeduschool.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
