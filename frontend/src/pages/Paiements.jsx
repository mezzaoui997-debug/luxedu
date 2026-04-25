import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

function DonutPay({ recouvrement }) {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chart.current) chart.current.destroy();
    const pending = 100 - recouvrement;
    chart.current = new window.Chart(ref.current.getContext('2d'), {
      type:'doughnut',
      data:{ datasets:[{ data:[recouvrement, Math.max(pending-3,0), 3], backgroundColor:['#22c55e','#f59e0b','#ef4444'], borderWidth:0 }] },
      options:{ cutout:'70%', responsive:false, plugins:{ legend:{ display:false }, tooltip:{ enabled:false } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, [recouvrement]);
  return <canvas ref={ref} width={160} height={160} />;
}

export default function Paiements() {
  const { school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loaded, setLoaded] = useState(!!window.Chart);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(()=>{});
    api.get('/payments').then(r => setPayments(r.data)).catch(()=>{});
    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
      s.onload = () => setLoaded(true);
      document.head.appendChild(s);
    }
  }, []);

  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const recouvrement = payments.length > 0 ? Math.round(paid.length/payments.length*100) : 0;
  const totalPaid = paid.reduce((a,p) => a+p.amount, 0);
  const totalPending = pending.reduce((a,p) => a+p.amount, 0);

  const markPaid = async (id) => {
    try {
      await api.put('/payments/'+id+'/pay');
      const r = await api.get('/payments');
      setPayments(r.data);
      showT('Paiement marque comme regle');
    } catch {}
  };

  const sendWA = (phone, name, amount, month) => {
    if (!phone) { showT('Aucun telephone pour ce parent'); return; }
    window.open('https://wa.me/'+phone.replace(/[^0-9]/g,'')+'?text='+encodeURIComponent('Bonjour, les frais de scolarite de '+name+' pour '+month+' ('+amount+' MAD) sont en attente. Merci de regulariser. '+school?.name), '_blank');
  };

  const submitPayment = async () => {
    if (!form.studentId) { showT('Selectionnez un eleve'); return; }
    try {
      await api.post('/payments', form);
      const r = await api.get('/payments');
      setPayments(r.data);
      setForm({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
      showT('Paiement enregistre');
    } catch(e) { showT('Erreur: '+e.message); }
  };

  const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };
  const TH = { textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 14px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' };
  const TD = { padding:'13px 14px', borderBottom:'1px solid #e5e9f2', fontSize:13, verticalAlign:'middle' };

  return (
    <div>
      {toast && <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1e2d4f', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999 }}>✓ {toast}</div>}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Paiements</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>Gestion des frais de scolarite · {new Date().toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Encaisse ce mois', value:totalPaid.toLocaleString('fr-FR'), sub:'MAD', color:'#16a34a' },
          { label:'En attente', value:totalPending.toLocaleString('fr-FR'), sub:pending.length+' familles', color:'#dc2626', red:true },
          { label:'Taux recouvrement', value:recouvrement+'%', sub:paid.length+' regles / '+payments.length, color:'#2563eb' },
          { label:'Total eleves', value:students.length, sub:'Annee 2025-2026', color:'#6b7280' },
        ].map((s,i) => (
          <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-1px', color:s.red?'#ef4444':'#111827' }}>{s.value}</div>
            <div style={{ fontSize:11, color:s.color, marginTop:8, fontWeight:500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Paiements en attente</span>
            <button onClick={() => { pending.forEach(p => { if(p.student?.parentPhone) sendWA(p.student.parentPhone, p.student.firstName+' '+p.student.lastName, p.amount, p.month); }); showT('Rappels WA envoyes'); }}
              style={{ background:'#22c55e', color:'white', border:'none', borderRadius:7, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              Envoyer rappels WA
            </button>
          </div>
          {pending.length === 0 ? (
            <div style={{ padding:32, textAlign:'center', color:'#6b7280' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
              <div style={{ fontWeight:600 }}>Tous les paiements sont regles</div>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Famille','Montant','Mois','Statut','Actions'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {pending.map(p => (
                  <tr key={p.id}>
                    <td style={TD}>
                      <div style={{ fontWeight:500 }}>{p.student?.firstName} {p.student?.lastName}</div>
                      <div style={{ fontSize:11, color:'#6b7280' }}>{p.student?.massar}</div>
                    </td>
                    <td style={{ ...TD, fontWeight:600, color:'#dc2626' }}>{p.amount.toLocaleString('fr-FR')} MAD</td>
                    <td style={{ ...TD, color:'#6b7280' }}>{p.month}</td>
                    <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#fee2e2', color:'#dc2626' }}>En retard</span></td>
                    <td style={TD}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => sendWA(p.student?.parentPhone, p.student?.firstName+' '+p.student?.lastName, p.amount, p.month)}
                          style={{ padding:'5px 10px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer' }}>
                          Rappel WA
                        </button>
                        <button onClick={() => markPaid(p.id)}
                          style={{ padding:'5px 10px', background:'#dcfce7', color:'#16a34a', border:'1px solid #86efac', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                          Paye ✓
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={C}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Repartition</div>
            <div style={{ position:'relative', width:160, height:160, margin:'0 auto 16px' }}>
              {loaded && <DonutPay recouvrement={recouvrement} />}
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', pointerEvents:'none' }}>
                <div style={{ fontSize:18, fontWeight:700 }}>{recouvrement}%</div>
                <div style={{ fontSize:10, color:'#6b7280' }}>paye</div>
              </div>
            </div>
            {[['#22c55e','Paye'],['#f59e0b','En attente'],['#ef4444','En retard']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, marginBottom:5 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:c }}></div>{l}
              </div>
            ))}
          </div>
          <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:12, padding:14 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#16a34a', marginBottom:4 }}>Total encaisse</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#15803d' }}>{totalPaid.toLocaleString('fr-FR')} MAD</div>
            <div style={{ fontSize:11, color:'#16a34a', marginTop:2 }}>sur {(totalPaid+totalPending).toLocaleString('fr-FR')} MAD attendus · {recouvrement}%</div>
          </div>
        </div>
      </div>

      <div style={{ ...C, marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Historique des paiements</div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Eleve','Montant','Mois','Mode','Statut'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={TD}><span style={{ fontWeight:500 }}>{p.student?.firstName} {p.student?.lastName}</span></td>
                <td style={{ ...TD, fontWeight:600 }}>{p.amount.toLocaleString('fr-FR')} MAD</td>
                <td style={{ ...TD, color:'#6b7280' }}>{p.month}</td>
                <td style={{ ...TD, color:'#6b7280' }}>{p.mode || 'Especes'}</td>
                <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:p.status==='PAID'?'#dcfce7':'#fee2e2', color:p.status==='PAID'?'#16a34a':'#dc2626' }}>{p.status==='PAID'?'Regle':'En attente'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={C}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Enregistrer un paiement</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' }}>Eleve</label>
            <select value={form.studentId} onChange={e => setForm({...form, studentId:e.target.value})}
              style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }}>
              <option value="">Selectionner</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' }}>Montant (MAD)</label>
            <input type="number" value={form.amount} onChange={e => setForm({...form, amount:+e.target.value})}
              style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' }}>Mois</label>
            <select value={form.month} onChange={e => setForm({...form, month:e.target.value})}
              style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }}>
              {['Janvier 2026','Fevrier 2026','Mars 2026','Avril 2026','Mai 2026','Juin 2026','Septembre 2025','Octobre 2025','Novembre 2025','Decembre 2025'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' }}>Mode</label>
            <select value={form.mode} onChange={e => setForm({...form, mode:e.target.value})}
              style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }}>
              {['Especes','Virement','Cheque','CMI Carte'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <button onClick={submitPayment}
          style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Enregistrer le paiement
        </button>
      </div>
    </div>
  );
}
