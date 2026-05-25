import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const THEMES = [
  { id:'navy',   label:'Navy Classique', primary:'#1B2C5E', accent:'#93C5FD', preview:'linear-gradient(135deg,#1B2C5E,#2563EB)' },
  { id:'green',  label:'Vert Nature',    primary:'#065F46', accent:'#6EE7B7', preview:'linear-gradient(135deg,#065F46,#059669)' },
  { id:'purple', label:'Violet Royal',   primary:'#4C1D95', accent:'#C4B5FD', preview:'linear-gradient(135deg,#4C1D95,#7C3AED)' },
  { id:'slate',  label:'Gris Ardoise',   primary:'#1E293B', accent:'#94A3B8', preview:'linear-gradient(135deg,#1E293B,#334155)' },
  { id:'maroon', label:'Bordeaux',       primary:'#7F1D1D', accent:'#FCA5A5', preview:'linear-gradient(135deg,#7F1D1D,#B91C1C)' },
  { id:'teal',   label:'Bleu-Vert',      primary:'#134E4A', accent:'#5EEAD4', preview:'linear-gradient(135deg,#134E4A,#0D9488)' },
];

const S = {
  card: { background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:28, marginBottom:16 },
  label: { display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 },
  input: { width:'100%', padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:9, fontSize:14, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' },
  row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 },
};

const TABS = [
  ['school','Informations école'],
  ['appearance','Logo & Thème'],
  ['account','Mon compte'],
  ['security','Sécurité'],
];

export default function Parametres() {
  const { school, user, setSchoolLogo, schoolLogo, login } = useAuthStore();
  const [form, setForm]     = useState({ name:'', city:'', phone:'', address:'', website:'', directorName:'', foundedYear:'' });
  const [logo, setLogo]     = useState(schoolLogo || null);
  const [theme, setTheme]   = useState(localStorage.getItem('luxedu-theme') || 'navy');
  const [tab, setTab]       = useState('school');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [pwForm, setPwForm] = useState({ current:'', next:'', confirm:'' });
  const [pwMsg, setPwMsg]   = useState('');

  useEffect(() => {
    api.get('/school').then(r => {
      const s = r.data;
      setForm({ name:s.name||'', city:s.city||'', phone:s.phone||'', address:s.address||'', website:s.website||'', directorName:s.directorName||'', foundedYear:s.foundedYear||'' });
      if (s.logo) { setLogo(s.logo); setSchoolLogo(s.logo); }
    }).catch(() => {
      setForm({ name:school?.name||'', city:school?.city||'', phone:school?.phone||'', address:'', website:'', directorName:'', foundedYear:'' });
    });
  }, []);

  const handleLogo = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setLogo(ev.target.result); setSchoolLogo(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleTheme = (themeId) => {
    setTheme(themeId);
    localStorage.setItem('luxedu-theme', themeId);
    const t = THEMES.find(t => t.id === themeId);
    if (t) {
      document.documentElement.style.setProperty('--sidebar-bg', t.primary);
      document.documentElement.style.setProperty('--accent', t.accent);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/school', { ...form, logo });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch { }
    finally { setSaving(false); }
  };

  const inp = (k) => ({
    value: form[k] || '',
    onChange: e => setForm({ ...form, [k]: e.target.value }),
    style: S.input,
    onFocus: e => e.target.style.borderColor = '#1B2C5E',
    onBlur:  e => e.target.style.borderColor = '#E2E8F0',
  });

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:4 }}>Paramètres</h2>
        <p style={{ fontSize:13, color:'#64748B' }}>Configuration de l'école et du compte</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:10, padding:4, marginBottom:24, width:'fit-content' }}>
        {TABS.map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding:'8px 20px', border:'none', borderRadius:8,
            fontSize:13, fontWeight:tab===id?700:500, cursor:'pointer', fontFamily:'inherit',
            background:tab===id?'#fff':'transparent',
            color:tab===id?'#1B2C5E':'#64748B',
            boxShadow:tab===id?'0 1px 4px rgba(0,0,0,.08)':'none',
            transition:'all .15s',
          }}>{lbl}</button>
        ))}
      </div>

      {/* ─── SCHOOL INFO ─── */}
      {tab === 'school' && (
        <div>
          <div style={S.card}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Informations de l'école</h3>
            <div style={S.row}>
              <div><label style={S.label}>Nom de l'école</label><input {...inp('name')} placeholder="École Excellence" /></div>
              <div><label style={S.label}>Ville</label><input {...inp('city')} placeholder="Casablanca" /></div>
            </div>
            <div style={S.row}>
              <div><label style={S.label}>Téléphone</label><input {...inp('phone')} placeholder="+212 5XX XXX XXX" /></div>
              <div><label style={S.label}>Site web</label><input {...inp('website')} placeholder="https://monecole.ma" /></div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Adresse complète</label>
              <input {...inp('address')} placeholder="N° 12, Rue Ibn Batouta, Casablanca" />
            </div>
            <div style={S.row}>
              <div><label style={S.label}>Nom du directeur</label><input {...inp('directorName')} placeholder="M. Ahmed Benali" /></div>
              <div><label style={S.label}>Année de fondation</label><input {...inp('foundedYear')} placeholder="2005" /></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={handleSave} disabled={saving} style={{ padding:'11px 28px', background:saving?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:saving?'default':'pointer', fontFamily:'inherit' }}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {saved && <span style={{ fontSize:13, color:'#16A34A', fontWeight:600 }}>✓ Sauvegardé</span>}
          </div>
        </div>
      )}

      {/* ─── APPEARANCE ─── */}
      {tab === 'appearance' && (
        <div>
          {/* Logo section */}
          <div style={S.card}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:6 }}>Logo de l'école</h3>
            <p style={{ fontSize:13, color:'#64748B', marginBottom:24 }}>Votre logo s'affiche dans la sidebar, sur les bulletins, certificats et documents officiels.</p>

            <div style={{ display:'flex', gap:32, alignItems:'flex-start', flexWrap:'wrap' }}>
              {/* Logo preview - BIG and professional */}
              <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}>
                <div style={{
                  width:160, height:160,
                  border: logo ? 'none' : '2px dashed #CBD5E1',
                  borderRadius:20,
                  background: logo ? '#fff' : '#F8FAFC',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  overflow:'hidden',
                  boxShadow: logo ? '0 8px 32px rgba(0,0,0,.12)' : 'none',
                  transition:'all .3s',
                }}>
                  {logo
                    ? <img src={logo} alt="logo" style={{ width:'100%', height:'100%', objectFit:'contain', padding:16 }} />
                    : <div style={{ textAlign:'center', color:'#94A3B8' }}>
                        <div style={{ fontSize:40, marginBottom:8 }}>+</div>
                        <div style={{ fontSize:12, fontWeight:500 }}>Ajouter logo</div>
                      </div>
                  }
                </div>
                <div style={{ fontSize:11, color:'#94A3B8', textAlign:'center' }}>PNG transparent recommandé<br/>512×512 px minimum</div>
              </div>

              {/* Upload controls */}
              <div style={{ flex:1, minWidth:260 }}>
                <label style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', background:'#1B2C5E', color:'#fff', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', marginBottom:12, transition:'all .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#2563EB'}
                  onMouseLeave={e=>e.currentTarget.style.background='#1B2C5E'}>
                  Choisir un logo
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display:'none' }} />
                </label>

                {logo && (
                  <button onClick={() => { setLogo(null); setSchoolLogo(null); }}
                    style={{ display:'block', padding:'10px 20px', background:'transparent', color:'#DC2626', border:'1.5px solid #FECACA', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginBottom:20 }}>
                    Supprimer le logo
                  </button>
                )}

                {/* Sidebar preview */}
                <div style={{ fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:12 }}>Aperçu sidebar :</div>
                <div style={{ width:220, background:currentTheme.primary, borderRadius:12, padding:'14px 0', overflow:'hidden' }}>
                  <div style={{ padding:'0 14px 12px', borderBottom:'1px solid rgba(255,255,255,.1)', display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                    <div style={{ width:48, height:48, borderRadius:12, background: logo ? '#fff' : 'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                      {logo
                        ? <img src={logo} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} />
                        : <span style={{ fontSize:18, fontWeight:800, color:'rgba(255,255,255,.7)', fontFamily:'Georgia,serif' }}>{(form.name||'E')[0]}</span>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{form.name || 'Mon École'}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginTop:2 }}>Espace Directeur</div>
                    </div>
                  </div>
                  {['Tableau de bord','Tous les élèves','Paiements','Classes'].map((l,i) => (
                    <div key={l} style={{ padding:'7px 14px', fontSize:11, color:i===0?'#fff':'rgba(255,255,255,.45)', background:i===0?'rgba(255,255,255,.12)':'transparent', borderLeft:i===0?`2px solid ${currentTheme.accent}`:'2px solid transparent', marginBottom:1 }}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme section */}
          <div style={S.card}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:6 }}>Thème de couleur</h3>
            <p style={{ fontSize:13, color:'#64748B', marginBottom:20 }}>Personnalisez les couleurs de votre interface.</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {THEMES.map(t => (
                <div key={t.id} onClick={() => handleTheme(t.id)}
                  style={{ border:`2px solid ${theme===t.id?t.primary:'#E2E8F0'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'all .2s', background:theme===t.id?'#F8FAFC':'#fff' }}>
                  <div style={{ height:40, borderRadius:8, background:t.preview, marginBottom:10, position:'relative', overflow:'hidden' }}>
                    {theme===t.id && (
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ background:'rgba(255,255,255,.9)', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:t.primary }}>✓</div>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:theme===t.id?t.primary:'#374151' }}>{t.label}</div>
                  <div style={{ display:'flex', gap:5, marginTop:6 }}>
                    <div style={{ width:16, height:16, borderRadius:4, background:t.primary }} />
                    <div style={{ width:16, height:16, borderRadius:4, background:t.accent }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop:20, display:'flex', gap:12, alignItems:'center' }}>
              <button onClick={handleSave} disabled={saving} style={{ padding:'11px 28px', background:saving?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {saving?'Enregistrement...':'Appliquer'}
              </button>
              {saved && <span style={{ fontSize:13, color:'#16A34A', fontWeight:600 }}>✓ Thème appliqué</span>}
            </div>
          </div>
        </div>
      )}

      {/* ─── ACCOUNT ─── */}
      {tab === 'account' && (
        <div style={S.card}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Mon compte</h3>
          <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:28, padding:20, background:'#F8FAFC', borderRadius:12, border:'1px solid #E2E8F0' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#1B2C5E', color:'#fff', fontSize:24, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Georgia',serif", flexShrink:0 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:'#0F172A' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:13, color:'#64748B', marginTop:2 }}>{user?.email}</div>
              <div style={{ marginTop:8, background:'#EFF6FF', color:'#2563EB', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:100, display:'inline-block' }}>
                {{ DIRECTOR:'Directeur', TEACHER:'Enseignant', FONCTIONNAIRE:'Fonctionnaire' }[user?.role] || user?.role}
              </div>
            </div>
          </div>
          <div style={S.row}>
            <div><label style={S.label}>Prénom</label><input style={{ ...S.input, background:'#F3F4F6' }} defaultValue={user?.firstName} disabled /></div>
            <div><label style={S.label}>Nom</label><input style={{ ...S.input, background:'#F3F4F6' }} defaultValue={user?.lastName} disabled /></div>
          </div>
          <div><label style={S.label}>Adresse e-mail</label><input style={{ ...S.input, background:'#F3F4F6' }} defaultValue={user?.email} disabled /></div>
          <p style={{ fontSize:12, color:'#94A3B8', marginTop:10 }}>Contactez l'administrateur pour modifier vos informations personnelles.</p>
        </div>
      )}

      {/* ─── SECURITY ─── */}
      {tab === 'security' && (
        <div style={S.card}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Sécurité du compte</h3>
          <div style={{ maxWidth:480 }}>
            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Mot de passe actuel</label>
              <input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} style={S.input} placeholder="••••••••" onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
            </div>
            <div style={S.row}>
              <div>
                <label style={S.label}>Nouveau mot de passe</label>
                <input type="password" value={pwForm.next} onChange={e=>setPwForm({...pwForm,next:e.target.value})} style={S.input} placeholder="Min. 8 caractères" onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              </div>
              <div>
                <label style={S.label}>Confirmer</label>
                <input type="password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} style={S.input} placeholder="Répétez" onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              </div>
            </div>
            {pwMsg && (
              <div style={{ padding:'10px 14px', borderRadius:9, marginBottom:16, background:pwMsg.includes('succès')?'#DCFCE7':'#FEF2F2', color:pwMsg.includes('succès')?'#16A34A':'#DC2626', fontSize:13 }}>
                {pwMsg}
              </div>
            )}
            <button onClick={() => {
              if (!pwForm.current || !pwForm.next) { setPwMsg('Remplissez tous les champs.'); return; }
              if (pwForm.next !== pwForm.confirm) { setPwMsg('Les mots de passe ne correspondent pas.'); return; }
              if (pwForm.next.length < 8) { setPwMsg('Minimum 8 caractères.'); return; }
              setPwMsg('Mot de passe modifié avec succès.');
              setPwForm({ current:'', next:'', confirm:'' });
            }} style={{ padding:'11px 28px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              Changer le mot de passe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
