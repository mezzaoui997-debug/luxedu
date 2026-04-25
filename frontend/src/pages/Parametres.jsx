import { useState } from 'react';
import useAuthStore from '../store/authStore';

const THEMES = [
  { id:'navy', name:'Navy Classique', primary:'#1e2d4f', accent:'#3b82f6', label:'Professionnel' },
  { id:'green', name:'Vert Academie', primary:'#14532d', accent:'#22c55e', label:'Nature' },
  { id:'purple', name:'Violet Royal', primary:'#4c1d95', accent:'#8b5cf6', label:'Premium' },
  { id:'slate', name:'Gris Moderne', primary:'#1e293b', accent:'#64748b', label:'Minimaliste' },
  { id:'red', name:'Rouge Excellence', primary:'#7f1d1d', accent:'#ef4444', label:'Dynamique' },
  { id:'teal', name:'Bleu-Vert', primary:'#134e4a', accent:'#14b8a6', label:'Frais' },
];

export default function Parametres() {
  const { school, user } = useAuthStore();
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('ecole');
  const [selectedTheme, setSelectedTheme] = useState('navy');
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    name: school?.name || 'Ecole Excellence Casablanca',
    city: 'Casablanca',
    address: '45 Rue Hassan II, Maarif, Casablanca',
    phone: '+212 5 22 12 34 56',
    email: 'contact@excellence-casa.ma',
    website: 'www.excellence-casa.ma',
    academie: 'Academie Casablanca-Settat',
    type: 'Ecole primaire privee',
    frais: '2800',
    cantine: '180',
    transport: '250',
    directeur: user?.firstName + ' ' + user?.lastName,
    waPhone: '+212 5 22 12 34 56',
    waToken: '',
    notifAbsence: true,
    notifNote: true,
    notifPaiement: true,
    notifBulletin: false,
    s1Start: '2025-09-08',
    s1End: '2026-01-31',
    s2Start: '2026-02-01',
    s2End: '2026-06-30',
  });

  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const F = { marginBottom:14 };
  const LBL = { display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' };
  const INP = { width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', fontFamily:'inherit', color:'#111827' };
  const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:22, marginBottom:14 };
  const TABS = [
    { id:'ecole', label:"Informations ecole" },
    { id:'apparence', label:'Apparence & logo' },
    { id:'frais', label:'Frais de scolarite' },
    { id:'whatsapp', label:'WhatsApp Business' },
    { id:'calendrier', label:'Calendrier scolaire' },
    { id:'acces', label:'Utilisateurs & acces' },
  ];

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1e2d4f', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999 }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Parametres</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>Configuration de votre etablissement · {school?.name}</p>
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:20, borderBottom:'1px solid #e5e9f2', paddingBottom:0, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding:'10px 16px', borderRadius:'8px 8px 0 0', fontSize:13, fontWeight:500, cursor:'pointer', border:'1px solid', borderBottom: activeTab===t.id?'1px solid white':'1px solid #e5e9f2', borderColor: activeTab===t.id?'#e5e9f2':'transparent', background: activeTab===t.id?'white':'transparent', color: activeTab===t.id?'#111827':'#6b7280', marginBottom:-1, transition:'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'ecole' && (
        <div>
          <div style={C}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Informations de l etablissement</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={F}>
                <label style={LBL}>Nom de l ecole</label>
                <input style={INP} value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Ville</label>
                <input style={INP} value={form.city} onChange={e => setForm({...form, city:e.target.value})} />
              </div>
              <div style={{ ...F, gridColumn:'1/-1' }}>
                <label style={LBL}>Adresse complete</label>
                <input style={INP} value={form.address} onChange={e => setForm({...form, address:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Telephone</label>
                <input style={INP} value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Email</label>
                <input style={INP} value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Site web</label>
                <input style={INP} value={form.website} onChange={e => setForm({...form, website:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Nom du directeur</label>
                <input style={INP} value={form.directeur} onChange={e => setForm({...form, directeur:e.target.value})} />
              </div>
              <div style={F}>
                <label style={LBL}>Academie</label>
                <select style={INP} value={form.academie} onChange={e => setForm({...form, academie:e.target.value})}>
                  <option>Academie Casablanca-Settat</option>
                  <option>Academie Rabat-Sale-Kenitra</option>
                  <option>Academie Marrakech-Safi</option>
                  <option>Academie Fes-Meknes</option>
                  <option>Academie Tanger-Tetouan-Al Hoceima</option>
                </select>
              </div>
              <div style={F}>
                <label style={LBL}>Type d etablissement</label>
                <select style={INP} value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                  <option>Ecole primaire privee</option>
                  <option>College prive</option>
                  <option>Lycee prive</option>
                  <option>Ecole primaire et college</option>
                  <option>Complexe scolaire</option>
                </select>
              </div>
            </div>
            <button onClick={() => showT('Informations sauvegardees')}
              style={{ marginTop:8, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {activeTab === 'apparence' && (
        <div>
          <div style={C}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Logo de l ecole</h3>
            <div style={{ display:'flex', alignItems:'flex-start', gap:24, marginBottom:20 }}>
              <div style={{ width:120, height:120, border:'2px dashed #e5e9f2', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#fafbfd', flexShrink:0, cursor:'pointer', position:'relative' }}
                onClick={() => document.getElementById('logo-input').click()}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                ) : (
                  <div style={{ textAlign:'center', color:'#9ca3af' }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>+</div>
                    <div style={{ fontSize:11 }}>Ajouter logo</div>
                    <div style={{ fontSize:10 }}>PNG / JPG / SVG</div>
                  </div>
                )}
                <input id="logo-input" type="file" accept="image/*" style={{ display:'none' }} onChange={handleLogo} />
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:6 }}>Logo de l etablissement</div>
                <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.6, marginBottom:12 }}>
                  Ce logo apparaitra sur les bulletins PDF, certificats et l en-tete du systeme.<br/>
                  Format recommande: PNG transparent, 200x200px minimum.
                </div>
                <button onClick={() => document.getElementById('logo-input').click()}
                  style={{ padding:'8px 16px', background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Choisir un fichier
                </button>
                {logoPreview && (
                  <button onClick={() => setLogoPreview(null)}
                    style={{ marginLeft:8, padding:'8px 16px', background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={C}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>Couleurs et theme</h3>
            <p style={{ fontSize:12, color:'#6b7280', marginBottom:18 }}>Choisissez l apparence de votre espace LuxEdu</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {THEMES.map(t => (
                <div key={t.id} onClick={() => { setSelectedTheme(t.id); showT('Theme '+t.name+' applique'); }}
                  style={{ border:'2px solid '+(selectedTheme===t.id?t.primary:'#e5e9f2'), borderRadius:10, padding:14, cursor:'pointer', transition:'all .15s', background:selectedTheme===t.id?'#fafbfd':'white' }}>
                  <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                    <div style={{ width:32, height:32, borderRadius:7, background:t.primary }}></div>
                    <div style={{ width:32, height:32, borderRadius:7, background:t.accent }}></div>
                    <div style={{ width:32, height:32, borderRadius:7, background:'#f1f4f9' }}></div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:2 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>{t.label}</div>
                  {selectedTheme === t.id && (
                    <div style={{ marginTop:6, fontSize:11, fontWeight:600, color:t.primary }}>Actif ✓</div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => showT('Theme sauvegarde')}
              style={{ marginTop:16, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Appliquer le theme
            </button>
          </div>
        </div>
      )}

      {activeTab === 'frais' && (
        <div style={C}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Frais de scolarite</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <div style={F}>
              <label style={LBL}>Frais mensuels de base (MAD)</label>
              <input type="number" style={INP} value={form.frais} onChange={e => setForm({...form, frais:e.target.value})} />
            </div>
            <div style={F}>
              <label style={LBL}>Cantine (MAD/mois)</label>
              <input type="number" style={INP} value={form.cantine} onChange={e => setForm({...form, cantine:e.target.value})} />
            </div>
            <div style={F}>
              <label style={LBL}>Transport (MAD/mois)</label>
              <input type="number" style={INP} value={form.transport} onChange={e => setForm({...form, transport:e.target.value})} />
            </div>
          </div>
          <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:9, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#1e40af', marginBottom:4 }}>Total mensuel par eleve</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#1e40af' }}>{(+form.frais + +form.cantine + +form.transport).toLocaleString('fr-FR')} MAD</div>
          </div>
          <button onClick={() => showT('Frais mis a jour')}
            style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Mettre a jour
          </button>
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div>
          <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:12, padding:'14px 18px', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e' }}></div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#16a34a' }}>WhatsApp connecte</div>
              <div style={{ fontSize:12, color:'#16a34a' }}>+212 5 22 12 34 56</div>
            </div>
          </div>
          <div style={C}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Configuration WhatsApp Business</h3>
            <div style={F}>
              <label style={LBL}>Numero WhatsApp Business</label>
              <input style={INP} value={form.waPhone} onChange={e => setForm({...form, waPhone:e.target.value})} placeholder="+212 5 22 12 34 56" />
            </div>
            <div style={F}>
              <label style={LBL}>Token API WhatsApp (Meta Business)</label>
              <input type="password" style={INP} value={form.waToken} onChange={e => setForm({...form, waToken:e.target.value})} placeholder="Votre token Meta Business API" />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={LBL}>Notifications automatiques</label>
              {[
                { key:'notifAbsence', label:'Absence detectee → notifier parent immediatement' },
                { key:'notifNote', label:'Note inferieure a 10 → notifier parent' },
                { key:'notifPaiement', label:'Paiement en retard → rappel automatique' },
                { key:'notifBulletin', label:'Bulletin disponible → notifier parent' },
              ].map(n => (
                <label key={n.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', fontSize:13, cursor:'pointer', borderBottom:'1px solid #f3f4f6' }}>
                  <input type="checkbox" checked={form[n.key]} onChange={e => setForm({...form, [n.key]:e.target.checked})} style={{ width:15, height:15, accentColor:'#1e2d4f', cursor:'pointer' }} />
                  {n.label}
                </label>
              ))}
            </div>
            <button onClick={() => showT('Configuration WhatsApp sauvegardee')}
              style={{ background:'#22c55e', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {activeTab === 'calendrier' && (
        <div style={C}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Annee scolaire 2025-2026</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#1e2d4f', marginBottom:12, padding:'8px 12px', background:'#eff6ff', borderRadius:8 }}>Semestre 1</div>
              <div style={F}><label style={LBL}>Debut</label><input type="date" style={INP} value={form.s1Start} onChange={e => setForm({...form, s1Start:e.target.value})} /></div>
              <div style={F}><label style={LBL}>Fin</label><input type="date" style={INP} value={form.s1End} onChange={e => setForm({...form, s1End:e.target.value})} /></div>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#1e2d4f', marginBottom:12, padding:'8px 12px', background:'#eff6ff', borderRadius:8 }}>Semestre 2</div>
              <div style={F}><label style={LBL}>Debut</label><input type="date" style={INP} value={form.s2Start} onChange={e => setForm({...form, s2Start:e.target.value})} /></div>
              <div style={F}><label style={LBL}>Fin</label><input type="date" style={INP} value={form.s2End} onChange={e => setForm({...form, s2End:e.target.value})} /></div>
            </div>
          </div>
          <button onClick={() => showT('Calendrier sauvegarde')}
            style={{ marginTop:8, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Sauvegarder
          </button>
        </div>
      )}

      {activeTab === 'acces' && (
        <div>
          <div style={C}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:600 }}>Utilisateurs & acces</h3>
              <button onClick={() => showT('Formulaire creation compte ouvert')}
                style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                + Ajouter utilisateur
              </button>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Utilisateur','Role','Email','Statut','Actions'].map(h => (
                    <th key={h} style={{ textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 14px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name:'Dir. Ahmed Benali', role:'Directeur', email:'directeur@excellence-casa.ma', active:true },
                  { name:'Mme. Fatima Alami', role:'Enseignant', email:'prof.maths@excellence-casa.ma', active:true },
                  { name:'M. Karim Bennani', role:'Fonctionnaire', email:'fonctionnaire@excellence-casa.ma', active:true },
                ].map((u, i) => (
                  <tr key={i}>
                    <td style={{ padding:'13px 14px', borderBottom:'1px solid #e5e9f2' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>
                          {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontWeight:500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'13px 14px', borderBottom:'1px solid #e5e9f2' }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500, background: u.role==='Directeur'?'#eff6ff': u.role==='Enseignant'?'#f0fdf4':'#fdf4ff', color: u.role==='Directeur'?'#2563eb': u.role==='Enseignant'?'#16a34a':'#7c3aed' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding:'13px 14px', borderBottom:'1px solid #e5e9f2', fontSize:12, color:'#6b7280' }}>{u.email}</td>
                    <td style={{ padding:'13px 14px', borderBottom:'1px solid #e5e9f2' }}>
                      <span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#dcfce7', color:'#16a34a' }}>Actif</span>
                    </td>
                    <td style={{ padding:'13px 14px', borderBottom:'1px solid #e5e9f2' }}>
                      <button onClick={() => showT('Mot de passe reinitialise pour '+u.name)}
                        style={{ padding:'5px 10px', background:'white', border:'1px solid #e5e9f2', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer' }}>
                        Reinitialiser mdp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={C}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Securite</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={F}><label style={LBL}>Nouveau mot de passe</label><input type="password" style={INP} placeholder="Minimum 8 caracteres" /></div>
              <div style={F}><label style={LBL}>Confirmer</label><input type="password" style={INP} placeholder="Confirmer le mot de passe" /></div>
            </div>
            <button onClick={() => showT('Mot de passe modifie')}
              style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Modifier le mot de passe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
