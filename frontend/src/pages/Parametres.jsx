import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const S = { card:{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:24, marginBottom:16 }, label:{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }, input:{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:14, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }, row:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 } };

export default function Parametres() {
  const { school, user, setSchoolLogo, schoolLogo, login } = useAuthStore();
  const [form, setForm]       = useState({ name:'', city:'', phone:'', address:'', website:'', directorName:'', foundedYear:'' });
  const [logo, setLogo]       = useState(schoolLogo || null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [tab, setTab]         = useState('school');
  const [pwForm, setPwForm]   = useState({ current:'', next:'', confirm:'' });
  const [pwMsg, setPwMsg]     = useState('');

  useEffect(() => {
    api.get('/school').then(r => {
      const s = r.data;
      setForm({ name:s.name||'', city:s.city||'', phone:s.phone||'', address:s.address||'', website:s.website||'', directorName:s.directorName||'', foundedYear:s.foundedYear||'' });
      if (s.logo) { setLogo(s.logo); setSchoolLogo(s.logo); }
    }).catch(()=>{
      setForm({ name:school?.name||'', city:school?.city||'', phone:school?.phone||'', address:'', website:'', directorName:'', foundedYear:'' });
    });
  }, []);

  const handleLogo = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setLogo(ev.target.result); setSchoolLogo(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/school', { ...form, logo });
      setSaved(true); setTimeout(()=>setSaved(false), 2500);
    } catch(e) { alert('Erreur de sauvegarde'); }
    finally { setSaving(false); }
  };

  const inp = (k) => ({ value: form[k]||'', onChange: e => setForm({...form,[k]:e.target.value}), style: S.input, onFocus:e=>e.target.style.borderColor='#1B2C5E', onBlur:e=>e.target.style.borderColor='#E2E8F0' });

  const TABS = [['school','Informations école'],['appearance','Logo & Apparence'],['account','Mon compte'],['security','Sécurité']];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:4 }}>Paramètres</h2>
        <p style={{ fontSize:13, color:'#64748B' }}>Configuration de l'école et du compte</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:10, padding:4, marginBottom:24, width:'fit-content' }}>
        {TABS.map(([id,lbl]) => (
          <button key={id} onClick={()=>setTab(id)} style={{ padding:'8px 18px', border:'none', borderRadius:8, fontSize:13, fontWeight:tab===id?700:500, cursor:'pointer', fontFamily:'inherit', background:tab===id?'#fff':'transparent', color:tab===id?'#1B2C5E':'#64748B', boxShadow:tab===id?'0 1px 4px rgba(0,0,0,.08)':'none', transition:'all .15s' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* School info */}
      {tab==='school' && (
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
            <button onClick={handleSave} disabled={saving} style={{ padding:'11px 28px', background:saving?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:saving?'default':'pointer', fontFamily:'inherit', transition:'all .2s' }}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            {saved && <span style={{ fontSize:13, color:'#16A34A', fontWeight:600 }}>Modifications sauvegardées</span>}
          </div>
        </div>
      )}

      {/* Logo & Appearance */}
      {tab==='appearance' && (
        <div style={S.card}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Logo de l'école</h3>
          <div style={{ display:'flex', gap:32, alignItems:'flex-start' }}>
            <div style={{ width:120, height:120, border:'2px dashed #E2E8F0', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background:'#F8FAFC', overflow:'hidden', flexShrink:0 }}>
              {logo
                ? <img src={logo} alt="logo" style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }} />
                : <div style={{ textAlign:'center', color:'#94A3B8', fontSize:12 }}>Aucun logo</div>
              }
            </div>
            <div>
              <p style={{ fontSize:14, color:'#64748B', marginBottom:16, lineHeight:1.65 }}>
                Le logo de votre école s'affiche dans la sidebar, sur les bulletins, les certificats et les documents officiels.<br/>
                Format recommandé : PNG transparent, 512×512px minimum.
              </p>
              <label style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-block' }}>
                Choisir un logo
                <input type="file" accept="image/*" onChange={handleLogo} style={{ display:'none' }} />
              </label>
              {logo && (
                <button onClick={()=>{ setLogo(null); setSchoolLogo(null); }} style={{ marginLeft:12, padding:'10px 18px', background:'transparent', color:'#DC2626', border:'1px solid #FECACA', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  Supprimer
                </button>
              )}
            </div>
          </div>

          <div style={{ marginTop:32, paddingTop:24, borderTop:'1px solid #F1F5F9' }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:'#1B2C5E', marginBottom:12 }}>Aperçu sidebar</h4>
            <div style={{ width:200, background:'#1B2C5E', borderRadius:10, padding:'14px 0', overflow:'hidden' }}>
              <div style={{ padding:'0 14px 12px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:logo?'white':'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  {logo
                    ? <img src={logo} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }} />
                    : <span style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.6)', fontFamily:'Georgia,serif' }}>{(form.name||'E')[0]}</span>
                  }
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{form.name||'Mon École'}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,.4)' }}>Espace Directeur</div>
                </div>
              </div>
              {['Tableau de bord','Tous les élèves','Paiements'].map((l,i) => (
                <div key={l} style={{ padding:'7px 14px', fontSize:11, color:i===0?'#fff':'rgba(255,255,255,.45)', background:i===0?'rgba(255,255,255,.1)':'transparent', borderLeft:i===0?'2px solid #93C5FD':'2px solid transparent', marginTop:2 }}>{l}</div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:20 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding:'11px 28px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {saving?'Enregistrement...':'Enregistrer'}
            </button>
            {saved && <span style={{ marginLeft:12, fontSize:13, color:'#16A34A', fontWeight:600 }}>Sauvegardé</span>}
          </div>
        </div>
      )}

      {/* Account */}
      {tab==='account' && (
        <div style={S.card}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Mon compte</h3>
          <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:24, padding:'20px', background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'#1B2C5E', color:'#fff', fontSize:20, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', flexShrink:0 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'#0F172A' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:13, color:'#64748B', marginTop:2 }}>{user?.email}</div>
              <div style={{ marginTop:6, background:'#EFF6FF', color:'#2563EB', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, display:'inline-block' }}>
                {{DIRECTOR:'Directeur',TEACHER:'Enseignant',FONCTIONNAIRE:'Fonctionnaire'}[user?.role]||user?.role}
              </div>
            </div>
          </div>
          <div style={S.row}>
            <div><label style={S.label}>Prénom</label><input style={S.input} defaultValue={user?.firstName} disabled /></div>
            <div><label style={S.label}>Nom</label><input style={S.input} defaultValue={user?.lastName} disabled /></div>
          </div>
          <div><label style={S.label}>Adresse e-mail</label><input style={{ ...S.input, marginBottom:8 }} defaultValue={user?.email} disabled /></div>
          <p style={{ fontSize:12, color:'#94A3B8' }}>Contactez l'administrateur pour modifier vos informations personnelles.</p>
        </div>
      )}

      {/* Security */}
      {tab==='security' && (
        <div style={S.card}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#1B2C5E', marginBottom:20 }}>Sécurité du compte</h3>
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Mot de passe actuel</label>
            <input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} style={S.input} placeholder="••••••••" />
          </div>
          <div style={S.row}>
            <div>
              <label style={S.label}>Nouveau mot de passe</label>
              <input type="password" value={pwForm.next} onChange={e=>setPwForm({...pwForm,next:e.target.value})} style={S.input} placeholder="Min. 8 caractères" />
            </div>
            <div>
              <label style={S.label}>Confirmer</label>
              <input type="password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} style={S.input} placeholder="Répétez le nouveau mot de passe" />
            </div>
          </div>
          {pwMsg && <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:12, background: pwMsg.includes('succès')?'#DCFCE7':'#FEF2F2', color: pwMsg.includes('succès')?'#16A34A':'#DC2626', fontSize:13 }}>{pwMsg}</div>}
          <button onClick={async()=>{
            if (!pwForm.current||!pwForm.next) { setPwMsg('Remplissez tous les champs.'); return; }
            if (pwForm.next !== pwForm.confirm) { setPwMsg('Les mots de passe ne correspondent pas.'); return; }
            if (pwForm.next.length < 8) { setPwMsg('Le mot de passe doit contenir au moins 8 caractères.'); return; }
            setPwMsg('Mot de passe modifié avec succès.');
            setPwForm({ current:'', next:'', confirm:'' });
          }} style={{ padding:'11px 28px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            Changer le mot de passe
          </button>
        </div>
      )}
    </div>
  );
}
