import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const MENUS = [
  { sec: 'Principal' },
  { id:'dashboard', ic:'🏠', lbl:'Tableau de bord' },
  { id:'inscription', ic:'📝', lbl:'Inscrire un eleve' },
  { id:'liste', ic:'👥', lbl:'Liste des eleves' },
  { sec: 'Communication' },
  { id:'absences', ic:'✅', lbl:'Alertes absences' },
  { id:'messages', ic:'💬', lbl:'Messages parents' },
  { sec: 'Finance' },
  { id:'paiement', ic:'💰', lbl:'Paiements', dot:true },
  { sec: 'Documents' },
  { id:'certificat', ic:'🎓', lbl:'Certificats' },
];

export default function FonctionnaireDashboard() {
  const { user, school, logout } = useAuthStore();
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState({});
  const [payForm, setPayForm] = useState({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [form, setForm] = useState({
    firstName:'', lastName:'', massar:'', dateOfBirth:'',
    sex:'', city:'Casablanca', parentPhone:'', parentName:'',
    prevSchool:'', bloodGroup:'', allergies:'', medicalConditions:''
  });
  const [massarStatus, setMassarStatus] = useState('');

  const SERVICES_LIST = [
    { id:'cantine', ic:'🍽️', lbl:'Cantine', price:180 },
    { id:'transport', ic:'🚌', lbl:'Transport', price:250 },
    { id:'garde', ic:'👧', lbl:'Garde', price:120 },
    { id:'sport', ic:'⚽', lbl:'Sport', price:80 },
  ];

  const BASE_PRICE = 2800;
  const totalPrice = BASE_PRICE + Object.entries(services).filter(([,v])=>v).reduce((sum,[id]) => {
    return sum + (SERVICES_LIST.find(s=>s.id===id)?.price || 0);
  }, 0);

  const load = async () => {
    const [s, p] = await Promise.all([api.get('/students'), api.get('/payments')]);
    setStudents(s.data);
    setPayments(p.data);
  };

  useEffect(() => { load(); }, []);

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const validateMassar = (val) => {
    const v = val.toUpperCase();
    if (!v) { setMassarStatus(''); return; }
    setMassarStatus(/^[A-Z][0-9]{9}$/.test(v) ? 'ok' : 'err');
  };

  const resetForm = () => {
    setForm({ firstName:'', lastName:'', massar:'', dateOfBirth:'', sex:'', city:'Casablanca', parentPhone:'', parentName:'', prevSchool:'', bloodGroup:'', allergies:'', medicalConditions:'' });
    setServices({});
    setStep(1);
    setMassarStatus('');
  };

  const submitInscription = async () => {
    if (!form.firstName || !form.lastName || !form.massar) { alert('Remplissez les champs obligatoires'); return; }
    if (massarStatus !== 'ok') { alert('Code Massar invalide'); return; }
    setSaving(true);
    try {
      await api.post('/students', {
        firstName: form.firstName, lastName: form.lastName,
        massar: form.massar.toUpperCase(), dateOfBirth: form.dateOfBirth || null,
        parentPhone: form.parentPhone || null,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); resetForm(); setPage('liste'); }, 2000);
      load();
    } catch(err) { alert('Erreur: ' + (err.response?.data?.error || err.message)); }
    finally { setSaving(false); }
  };

  const submitPayment = async () => {
    if (!payForm.studentId) { alert('Selectionnez un eleve'); return; }
    setSaving(true);
    try {
      await api.post('/payments', payForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setPayForm({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
      load();
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const markPaid = async (id) => {
    try { await api.put('/payments/' + id + '/pay'); load(); }
    catch(err) { alert('Erreur: ' + err.message); }
  };

  const openCertificat = async (studentId) => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://luxedu-production.up.railway.app/api/certificat/certificat/' + studentId, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const html = await res.text();
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const sendWA = (phone, msg) => {
    const p = phone.replace(/[^0-9]/g, '');
    window.open('https://wa.me/' + p + '?text=' + encodeURIComponent(msg), '_blank');
  };

  const filtered = students.filter(s =>
    (s.firstName + ' ' + s.lastName + s.massar).toLowerCase().includes(search.toLowerCase())
  );

  const pageTitles = {
    dashboard:'Tableau de bord', inscription:'Inscrire un eleve',
    liste:'Liste des eleves', absences:'Alertes absences',
    messages:'Messages parents', paiement:'Paiements', certificat:'Certificats'
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:234, background:'linear-gradient(160deg, #1E1B4B 0%, #312E81 100%)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div style={{ overflow:'hidden', minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{school?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Espace Fonctionnaire</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {MENUS.map((item, i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 10px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2, fontSize:12,
                background: page===item.id ? 'rgba(165,180,252,0.2)' : 'transparent',
                color: page===item.id ? '#A5B4FC' : 'rgba(255,255,255,0.5)' }}>
              <span style={{ fontSize:14 }}>{item.ic}</span>
              <span style={{ flex:1 }}>{item.lbl}</span>
              {item.dot && pending.length > 0 && <div style={{ width:7, height:7, borderRadius:'50%', background:'#E24B4A' }}></div>}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Fonctionnaire · Deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ background:'white', borderBottom:'1px solid #E8E6E0', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{pageTitles[page]}</div>
            <div style={{ fontSize:11, color:'#888780' }}>{today} · {school?.name}</div>
          </div>
          <div style={{ background:'#EEF2FF', color:'#4F46E5', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>
            Fonctionnaire
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>

          {page === 'dashboard' && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Bonjour, {user?.firstName} 👋</div>
                <div style={{ fontSize:13, color:'#888780' }}>Bienvenue sur votre espace fonctionnaire · {school?.name}</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
                {[
                  { ic:'👥', lbl:'Eleves inscrits', val:students.length, color:'#4F46E5', bg:'#EEF2FF', sub:'Total annee', page:'liste' },
                  { ic:'💰', lbl:'Paiements en attente', val:pending.length, color:'#A32D2D', bg:'#FCEBEB', sub:pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')+' MAD', page:'paiement' },
                  { ic:'✅', lbl:'Paiements regles', val:paid.length, color:'#3B6D11', bg:'#EAF3DE', sub:paid.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')+' MAD', page:'paiement' },
                  { ic:'📊', lbl:'Taux recouvrement', val:(payments.length>0?Math.round(paid.length/payments.length*100):0)+'%', color:'#7C3AED', bg:'#EDE9FE', sub:'ce mois', page:'paiement' },
                ].map(m => (
                  <div key={m.lbl} className="metric" onClick={() => setPage(m.page)}
                    style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:17, cursor:'pointer' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:11 }}>{m.ic}</div>
                    <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>{m.lbl}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:'#042C53' }}>{m.val}</div>
                    <div style={{ fontSize:11, color:'#888780', marginTop:4 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {pending.length > 0 && (
                <div style={{ background:'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:28 }}>🤖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>Alerte IA — {pending.length} paiement(s) en retard</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>
                      {pending.filter(p=>p.student?.parentPhone).length} parent(s) contactables via WhatsApp
                    </div>
                  </div>
                  <button onClick={() => {
                    pending.filter(p=>p.student?.parentPhone).forEach((p, i) => {
                      setTimeout(() => {
                        sendWA(p.student.parentPhone, 'Bonjour, les frais de scolarite de ' + p.student.firstName + ' pour ' + p.month + ' (' + p.amount + ' MAD) sont en attente. Merci de regulariser. ' + school?.name);
                      }, i * 1000);
                    });
                  }} style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}> Rappels WA groupes
                  </button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#042C53' }}>Paiements en attente</div>
                    <button onClick={() => setPage('paiement')} style={{ background:'#EEF2FF', border:'none', borderRadius:7, padding:'5px 12px', fontSize:11, fontWeight:700, color:'#4F46E5', cursor:'pointer' }}>
                      + Enregistrer
                    </button>
                  </div>
                  {pending.length === 0 ? (
                    <div style={{ padding:20, textAlign:'center', color:'#888780', fontSize:13 }}>Tous les paiements sont regles ✅</div>
                  ) : pending.map(p => (
                    <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #F5F5F3' }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'#FAEEDA', color:'#854F0B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                        {p.student?.firstName?.[0]}{p.student?.lastName?.[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{p.student?.firstName} {p.student?.lastName}</div>
                        <div style={{ fontSize:11, color:'#888780' }}>{p.month} · <span style={{ fontWeight:700, color:'#854F0B' }}>{p.amount.toLocaleString('fr-FR')} MAD</span></div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        {p.student?.parentPhone && (
                          <button onClick={() => sendWA(p.student.parentPhone, 'Bonjour, les frais de ' + p.student.firstName + ' pour ' + p.month + ' (' + p.amount + ' MAD) sont en attente. Merci. ' + school?.name)}
                            style={{ background:'#25D366', color:'white', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}> WA
                          </button>
                        )}
                        <button onClick={() => markPaid(p.id)}
                          style={{ background:'#EAF3DE', color:'#3B6D11', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          Paye ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:12 }}>Actions rapides</div>
                    {[
                      { ic:'📝', lbl:'Inscrire un eleve', p:'inscription', color:'#4F46E5', bg:'#EEF2FF' },
                      { ic:'💰', lbl:'Enregistrer paiement', p:'paiement', color:'#3B6D11', bg:'#EAF3DE' },
                      { ic:'🎓', lbl:'Certificat PDF', p:'certificat', color:'#534AB7', bg:'#EEEDFE' },
                      { ic:'💬', lbl:'Messages parents', p:'messages', color:'#854F0B', bg:'#FAEEDA' },
                    ].map(a => (
                      <button key={a.p} onClick={() => setPage(a.p)}
                        style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:7 }}>
                        <span style={{ fontSize:16 }}>{a.ic}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                        <span style={{ color:a.color }}>→</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ background:'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)', borderRadius:10, padding:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:10 }}>Taux recouvrement</div>
                    <div style={{ fontSize:28, fontWeight:700, color:'white', marginBottom:8 }}>
                      {payments.length > 0 ? Math.round(paid.length/payments.length*100) : 0}%
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:6, height:8, marginBottom:8, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:6, background:'#EF9F27', width:(payments.length>0?Math.round(paid.length/payments.length*100):0)+'%' }}></div>
                    </div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{paid.length} payes sur {payments.length}</div>
                  </div>
                </div>
              </div>

              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#042C53' }}>Eleves recents</div>
                  <button onClick={() => setPage('liste')} style={{ background:'#EEF2FF', border:'none', borderRadius:7, padding:'5px 12px', fontSize:11, fontWeight:700, color:'#4F46E5', cursor:'pointer' }}>Voir tous</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#F5F5F3' }}>
                      {['Eleve','Code Massar','Tel. Parent','Date inscription','Actions'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0,5).map(s => (
                      <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          </div>
                        </td>
                        <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                        <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '-'}</td>
                        <td style={{ padding:'11px 12px', fontSize:12, color:'#888780' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', gap:6 }}>
                            {s.parentPhone && (
                              <button onClick={() => sendWA(s.parentPhone, 'Bonjour, message de ' + school?.name + ' concernant ' + s.firstName + '.')}
                                style={{ background:'#25D366', color:'white', border:'none', borderRadius:6, padding:'4px 9px', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                                💬
                              </button>
                            )}
                            <button onClick={() => openCertificat(s.id)}
                              style={{ background:'#E6F1FB', color:'#0C447C', border:'none', borderRadius:6, padding:'4px 9px', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                              Cert.
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'liste' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:7, background:'white', border:'1px solid #E8E6E0', borderRadius:8, padding:'0 11px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                    style={{ flex:1, border:'none', outline:'none', padding:'9px 0', fontSize:13 }} />
                </div>
                <button onClick={() => setPage('inscription')} style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  + Inscrire
                </button>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#F5F5F3' }}>
                      {['Eleve','Code Massar','Tel. Parent','Date','Actions'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                              <div style={{ fontSize:11, color:'#888780' }}>Inscrit</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                        <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '-'}</td>
                        <td style={{ padding:'11px 12px', fontSize:12, color:'#888780' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            {s.parentPhone && (
                              <button onClick={() => sendWA(s.parentPhone, 'Bonjour parent de ' + s.firstName + ', message de ' + school?.name + '.')}
                                style={{ background:'#25D366', color:'white', border:'none', borderRadius:6, padding:'5px 9px', fontSize:11, fontWeight:700, cursor:'pointer' }}> WA
                              </button>
                            )}
                            <button onClick={() => openCertificat(s.id)}
                              style={{ background:'#E6F1FB', color:'#0C447C', border:'none', borderRadius:6, padding:'5px 9px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                              Certificat
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'absences' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:4 }}>Alertes absences</div>
                <div style={{ fontSize:13, color:'#888780' }}>Contactez les parents des eleves absents via WhatsApp</div>
              </div>
              <div style={{ background:'#FCEBEB', border:'1px solid #F09595', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#A32D2D', marginBottom:4 }}>Fonctionnement</div>
                <div style={{ fontSize:12, color:'#888780' }}>Cliquez sur le bouton WA pour envoyer un message automatique au parent de l eleve absent.</div>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18 }}>
                {students.map(s => (
                  <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid #F5F5F3' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:11, color:'#888780' }}>{s.massar} · {s.parentPhone || 'Pas de telephone'}</div>
                    </div>
                    {s.parentPhone ? (
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => sendWA(s.parentPhone, 'Bonjour, votre enfant ' + s.firstName + ' etait absent(e) aujourd hui. Merci de nous contacter. ' + school?.name)}
                          style={{ background:'#25D366', color:'white', border:'none', borderRadius:7, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}> Absent WA
                        </button>
                        <button onClick={() => sendWA(s.parentPhone, 'Bonjour, votre enfant ' + s.firstName + ' est arrive(e) en retard aujourd hui. ' + school?.name)}
                          style={{ background:'#FAEEDA', color:'#854F0B', border:'1px solid #FAC775', borderRadius:7, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}> Retard WA
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize:11, color:'#888780' }}>Pas de telephone</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'messages' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:4 }}>Messages parents</div>
                <div style={{ fontSize:13, color:'#888780' }}>Cliquez sur un eleve pour lui envoyer un message WhatsApp</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:14 }}>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#042C53', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.05em' }}>Eleves</div>
                  {students.map(s => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #F5F5F3', cursor:'pointer' }}
                      onClick={() => setSelectedMsg(s.id === selectedMsg ? null : s.id)}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background: s.id===selectedMsg?'#4F46E5':'#EEF2FF', color:s.id===selectedMsg?'white':'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color: s.parentPhone?'#25D366':'#888780' }}>
                          {s.parentPhone ? '✓ ' + s.parentPhone : 'Pas de telephone'}
                        </div>
                      </div>
                      {s.id === selectedMsg && <span style={{ color:'#4F46E5', fontSize:18 }}>→</span>}
                    </div>
                  ))}
                </div>

                <div>
                  {!selectedMsg ? (
                    <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:32, textAlign:'center' }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>💬</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:6 }}>Selectionnez un eleve</div>
                      <div style={{ fontSize:13, color:'#888780' }}>Cliquez sur un eleve a gauche pour voir les actions disponibles</div>
                    </div>
                  ) : (() => {
                    const s = students.find(x => x.id === selectedMsg);
                    if (!s) return null;
                    const pendingPay = payments.filter(p => p.studentId === s.id && p.status === 'PENDING');
                    return (
                      <div>
                        <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16, marginBottom:12, display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:46, height:46, borderRadius:12, background:'#EEF2FF', color:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div>
                            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{s.firstName} {s.lastName}</div>
                            <div style={{ fontSize:12, color:'#888780' }}>{s.massar} · {s.parentPhone || 'Pas de telephone'}</div>
                          </div>
                        </div>

                        {!s.parentPhone ? (
                          <div style={{ background:'#FCEBEB', borderRadius:10, padding:16, textAlign:'center', color:'#A32D2D', fontSize:13, fontWeight:700 }}>
                            Aucun telephone pour cet eleve
                          </div>
                        ) : (
                          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                            {pendingPay.length > 0 && (
                              <div style={{ background:'#FAEEDA', border:'1px solid #FAC775', borderRadius:10, padding:14, display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:24 }}>💰</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:13, fontWeight:700, color:'#854F0B' }}>Paiement en retard</div>
                                  <div style={{ fontSize:12, color:'#888780' }}>{pendingPay[0].amount} MAD · {pendingPay[0].month}</div>
                                </div>
                                <button onClick={() => sendWA(s.parentPhone, 'Bonjour, les frais de scolarite de ' + s.firstName + ' pour ' + pendingPay[0].month + ' (' + pendingPay[0].amount + ' MAD) sont en attente. Merci de regulariser. ' + school?.name)}
                                  style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}> Rappel WA
                                </button>
                              </div>
                            )}
                            {[
                              { ic:'✅', title:'Absence aujourd hui', msg:'Bonjour, votre enfant ' + s.firstName + ' etait absent(e) aujourd hui. Merci de nous contacter. ' + school?.name, color:'#A32D2D', bg:'#FCEBEB', border:'#F09595' },
                              { ic:'⏰', title:'Retard', msg:'Bonjour, votre enfant ' + s.firstName + ' est arrive(e) en retard aujourd hui. ' + school?.name, color:'#854F0B', bg:'#FAEEDA', border:'#FAC775' },
                              { ic:'📊', title:'Note insuffisante', msg:'Bonjour, votre enfant ' + s.firstName + ' a obtenu une note insuffisante. Un soutien scolaire est recommande. ' + school?.name, color:'#A32D2D', bg:'#FCEBEB', border:'#F09595' },
                              { ic:'📅', title:'Convocation', msg:'Bonjour, vous etes convoques a l ecole pour un entretien concernant ' + s.firstName + '. Merci de nous contacter. ' + school?.name, color:'#185FA5', bg:'#E6F1FB', border:'#B5D4F4' },
                              { ic:'🎉', title:'Felicitations', msg:'Bonjour, nous sommes heureux de vous informer que ' + s.firstName + ' a obtenu d excellents resultats. Bravo ! ' + school?.name, color:'#3B6D11', bg:'#EAF3DE', border:'#97C459' },
                            ].map(t => (
                              <div key={t.title} style={{ background:t.bg, border:'1px solid '+t.border, borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                                <span style={{ fontSize:22 }}>{t.ic}</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:13, fontWeight:700, color:t.color }}>{t.title}</div>
                                  <div style={{ fontSize:11, color:'#888780', marginTop:2 }}>{t.msg.slice(0,60)}...</div>
                                </div>
                                <button onClick={() => sendWA(s.parentPhone, t.msg)}
                                  style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}> Envoyer
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {page === 'paiement' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[
                  { lbl:'Total paiements', val:payments.length, color:'#0C447C', bg:'#E6F1FB' },
                  { lbl:'En attente', val:pending.length, color:'#A32D2D', bg:'#FCEBEB' },
                  { lbl:'Payes', val:paid.length, color:'#3B6D11', bg:'#EAF3DE' },
                ].map(m => (
                  <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:5 }}>{m.lbl}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:18, marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:14 }}>Enregistrer un paiement</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Eleve *</label>
                    <select value={payForm.studentId} onChange={e => setPayForm({...payForm, studentId:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      <option value="">Selectionner un eleve</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Mois</label>
                    <select value={payForm.month} onChange={e => setPayForm({...payForm, month:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      {['Janvier','Fevrier','Mars','Avril','Mai','Juin','Septembre','Octobre','Novembre','Decembre'].map(m => (
                        <option key={m}>{m} 2026</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Montant (MAD)</label>
                    <input type="number" value={payForm.amount} onChange={e => setPayForm({...payForm, amount:+e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Mode</label>
                    <select value={payForm.mode} onChange={e => setPayForm({...payForm, mode:e.target.value})}
                      style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                      {['Especes','Virement','CMI / Carte','Cheque'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                {saved && <div style={{ background:'#EAF3DE', borderRadius:8, padding:10, fontSize:13, fontWeight:700, color:'#3B6D11', marginBottom:10, textAlign:'center' }}>Paiement enregistre !</div>}
                <button onClick={submitPayment} disabled={saving}
                  style={{ background:'#4F46E5', color:'white', border:'none', borderRadius:8, padding:'11px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  {saving ? '...' : 'Valider le paiement'}
                </button>
              </div>

              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid #E8E6E0', fontSize:13, fontWeight:700, color:'#042C53' }}>Historique des paiements</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#F5F5F3' }}>
                      {['Eleve','Montant','Mois','Statut','Actions'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'11px 12px', fontWeight:700 }}>{p.student?.firstName} {p.student?.lastName}</td>
                        <td style={{ padding:'11px 12px', fontWeight:700, color:'#042C53' }}>{p.amount.toLocaleString('fr-FR')} MAD</td>
                        <td style={{ padding:'11px 12px', color:'#888780' }}>{p.month}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <span style={{ background:p.status==='PAID'?'#EAF3DE':'#FAEEDA', color:p.status==='PAID'?'#3B6D11':'#854F0B', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>
                            {p.status==='PAID' ? 'Paye' : 'En attente'}
                          </span>
                        </td>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            {p.status !== 'PAID' && (
                              <button onClick={() => markPaid(p.id)}
                                style={{ background:'#EAF3DE', color:'#3B6D11', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                                Marquer paye
                              </button>
                            )}
                            {p.student?.parentPhone && (
                              <button onClick={() => sendWA(p.student.parentPhone, 'Recu de paiement: ' + p.amount + ' MAD pour ' + p.month + '. Merci. ' + school?.name)}
                                style={{ background:'#25D366', color:'white', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}> Recu WA
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'certificat' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'#042C53', marginBottom:4 }}>Certificats de scolarite</div>
                <div style={{ fontSize:13, color:'#888780' }}>Generez les certificats officiels pour chaque eleve</div>
              </div>
              <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#F5F5F3' }}>
                      {['Eleve','Code Massar','Tel. Parent','Actions'].map(h => (
                        <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          </div>
                        </td>
                        <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                        <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '-'}</td>
                        <td style={{ padding:'11px 12px' }}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => openCertificat(s.id)}
                              style={{ background:'#042C53', color:'white', border:'none', borderRadius:6, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                              Certificat PDF
                            </button>
                            {s.parentPhone && (
                              <button onClick={() => sendWA(s.parentPhone, 'Bonjour, le certificat de scolarite de ' + s.firstName + ' est disponible. Contactez l ecole pour le recuperer. ' + school?.name)}
                                style={{ background:'#25D366', color:'white', border:'none', borderRadius:6, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer' }}> Notifier WA
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'inscription' && (
            <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:22, boxShadow:'0 4px 20px rgba(4,44,83,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#042C53' }}>Inscrire un eleve</div>
                  <div style={{ fontSize:12, color:'#888780', marginTop:2 }}>Dossier complet · Etape {step} sur 5</div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={resetForm} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, color:'#888780', cursor:'pointer' }}>Reinitialiser</button>
                  <button onClick={() => setPage('liste')} style={{ background:'white', border:'1px solid #E8E6E0', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Annuler</button>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:22, overflowX:'auto' }}>
                {['Identite','Scolarite','Medical','Services','Recap'].map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700,
                        background: step>i+1?'#3B6D11':step===i+1?'#042C53':'#E8E6E0',
                        color: step>=i+1?'white':'#888780', cursor:i+1<step?'pointer':'default' }}
                        onClick={() => i+1 < step && setStep(i+1)}>
                        {step > i+1 ? '✓' : i+1}
                      </div>
                      <div style={{ fontSize:9, fontWeight:700, color:step===i+1?'#042C53':step>i+1?'#3B6D11':'#888780', whiteSpace:'nowrap', textTransform:'uppercase' }}>{s}</div>
                    </div>
                    {i < 4 && <div style={{ width:30, height:2, background:step>i+1?'#3B6D11':'#E8E6E0', margin:'0 4px', marginBottom:18 }}></div>}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Prenom *</label>
                      <input value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} placeholder="ex: Omar"
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Nom *</label>
                      <input value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} placeholder="ex: Moussa"
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Code Massar *</label>
                      <input value={form.massar} maxLength={10} onChange={e => { const v=e.target.value.toUpperCase(); setForm({...form, massar:v}); validateMassar(v); }}
                        placeholder="ex: G412252321"
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid '+(massarStatus==='ok'?'#3B6D11':massarStatus==='err'?'#A32D2D':'#E8E6E0'), borderRadius:8, fontSize:13, outline:'none', fontFamily:'monospace' }} />
                      <div style={{ fontSize:11, marginTop:4, color:massarStatus==='ok'?'#3B6D11':massarStatus==='err'?'#A32D2D':'#888780' }}>
                        {massarStatus==='ok'?'Valide':massarStatus==='err'?'Format incorrect':'1 lettre + 9 chiffres'}
                      </div>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Date de naissance</label>
                      <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Sexe</label>
                      <select value={form.sex} onChange={e => setForm({...form, sex:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                        <option value="">Selectionner</option>
                        <option>Masculin</option>
                        <option>Feminin</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Ville</label>
                      <input value={form.city} onChange={e => setForm({...form, city:e.target.value})}
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:14, borderTop:'1px solid #E8E6E0' }}>
                    <button onClick={() => setStep(2)} style={{ background:'#4F46E5', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Nom du parent *</label>
                      <input value={form.parentName} onChange={e => setForm({...form, parentName:e.target.value})} placeholder="ex: M. Rachidi Karim"
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Telephone parent *</label>
                      <input value={form.parentPhone} onChange={e => setForm({...form, parentPhone:e.target.value})} placeholder="+212 6XX XXX XXX"
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Ecole precedente</label>
                    <input value={form.prevSchool} onChange={e => setForm({...form, prevSchool:e.target.value})} placeholder="ex: Ecole Al Amal"
                      style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', marginBottom:14 }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #E8E6E0' }}>
                    <button onClick={() => setStep(1)} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}> Precedent</button>
                    <button onClick={() => setStep(3)} style={{ background:'#4F46E5', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:8, textTransform:'uppercase' }}>Groupe sanguin</label>
                    <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <button key={bg} onClick={() => setForm({...form, bloodGroup:bg})}
                          style={{ padding:'7px 14px', borderRadius:8, border:'1.5px solid '+(form.bloodGroup===bg?'#A32D2D':'#E8E6E0'), cursor:'pointer', fontWeight:700, fontSize:13,
                            background:form.bloodGroup===bg?'#FCEBEB':'white', color:form.bloodGroup===bg?'#A32D2D':'#888780' }}>
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Allergies</label>
                      <input value={form.allergies} onChange={e => setForm({...form, allergies:e.target.value})} placeholder="ex: Arachides..."
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Conditions medicales</label>
                      <input value={form.medicalConditions} onChange={e => setForm({...form, medicalConditions:e.target.value})} placeholder="ex: Asthme..."
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #E8E6E0' }}>
                    <button onClick={() => setStep(2)} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}> Precedent</button>
                    <button onClick={() => setStep(4)} style={{ background:'#4F46E5', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div style={{ fontSize:12, color:'#888780', marginBottom:14 }}>Services supplementaires · frais de base 2 800 MAD/mois</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                    {SERVICES_LIST.map(svc => (
                      <div key={svc.id} onClick={() => setServices({...services,[svc.id]:!services[svc.id]})}
                        style={{ border:'1.5px solid '+(services[svc.id]?'#3B6D11':'#E8E6E0'), borderRadius:10, padding:14, textAlign:'center', cursor:'pointer',
                          background:services[svc.id]?'#EAF3DE':'white' }}>
                        <div style={{ fontSize:24, marginBottom:6 }}>{svc.ic}</div>
                        <div style={{ fontSize:12, fontWeight:700 }}>{svc.lbl}</div>
                        <div style={{ fontSize:11, color:'#888780', marginTop:3 }}>+{svc.price} MAD</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'#1E1B4B', borderRadius:10, padding:'14px 18px', color:'white', display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Total mensuel</div>
                    <div style={{ fontSize:22, fontWeight:700 }}>{totalPrice.toLocaleString('fr-FR')} MAD</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #E8E6E0' }}>
                    <button onClick={() => setStep(3)} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}> Precedent</button>
                    <button onClick={() => setStep(5)} style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Recapitulatif →</button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div style={{ background:'#F5F5F3', borderRadius:10, padding:18, marginBottom:16 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:12 }}>Recapitulatif du dossier</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      {[
                        ['Nom complet', form.firstName + ' ' + form.lastName],
                        ['Code Massar', form.massar],
                        ['Telephone parent', form.parentPhone || '-'],
                        ['Total mensuel', totalPrice.toLocaleString('fr-FR') + ' MAD'],
                      ].map(([l,v]) => (
                        <div key={l} style={{ background:'white', padding:12, borderRadius:8, border:'1px solid #E8E6E0' }}>
                          <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#042C53' }}>{v || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {saved && <div style={{ background:'#EAF3DE', borderRadius:8, padding:12, marginBottom:12, fontSize:13, fontWeight:700, color:'#3B6D11', textAlign:'center' }}>Eleve inscrit avec succes !</div>}
                  <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #E8E6E0' }}>
                    <button onClick={() => setStep(4)} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}> Precedent</button>
                    <button onClick={submitInscription} disabled={saving}
                      style={{ background:'#3B6D11', color:'white', border:'none', borderRadius:8, padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                      {saving ? 'Enregistrement...' : 'Confirmer inscription'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
