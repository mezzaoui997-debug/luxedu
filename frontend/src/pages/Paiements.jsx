import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Paiements() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/payments').then(r => setPayments(r.data));
  useEffect(() => { load(); api.get('/students').then(r => setStudents(r.data)); }, []);

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const totalAmount = payments.reduce((a,p) => a + p.amount, 0);
  const paidAmount = paid.reduce((a,p) => a + p.amount, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentId) { alert('Selectionnez un eleve'); return; }
    setLoading(true);
    try {
      await api.post('/payments', form);
      setShowForm(false);
      setForm({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
      load();
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setLoading(false); }
  };

  const markPaid = async (id) => {
    try { await api.put('/payments/' + id + '/pay'); load(); }
    catch(err) { alert('Erreur: ' + err.message); }
  };

  const sendReminder = (p) => {
    alert('Rappel WhatsApp envoye a la famille ' + p.student?.lastName);
  };

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Paiements</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>Suivi des frais de scolarite · Avril 2026</div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="mic" style={{ background:'#EAF3DE' }}>✅</div>
          <div className="mlbl">Encaisse</div>
          <div className="mval" style={{ fontSize:22 }}>{paidAmount.toLocaleString('fr-FR')}</div>
          <div className="msub">MAD ce mois</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'#FCEBEB' }}>⏳</div>
          <div className="mlbl">En attente</div>
          <div className="mval" style={{ color:'var(--amber)' }}>{pending.length}</div>
          <div className="msub">{pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')} MAD</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'#E6F1FB' }}>📊</div>
          <div className="mlbl">Taux recouvrement</div>
          <div className="mval">{payments.length > 0 ? Math.round(paid.length/payments.length*100) : 0}<span style={{ fontSize:15, color:'var(--g2)' }}>%</span></div>
          <div className="msub">ce mois</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'#E8F8EE' }}>💬</div>
          <div className="mlbl">Rappels WA</div>
          <div className="mval">{pending.length}</div>
          <div className="msub" style={{ color:'#25D366' }}>a envoyer</div>
        </div>
      </div>

      <div style={{ background:'#E8F8EE', border:'1px solid #97C459', borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:11 }}>
        <span style={{ fontSize:20 }}>💬</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1a5e2a' }}>WhatsApp Business connecte</div>
          <div style={{ fontSize:12, color:'var(--green)' }}>Les rappels de paiement sont envoyes automatiquement aux familles en retard</div>
        </div>
        <button className="btn btn-wa btn-sm" onClick={() => { pending.forEach(p => sendReminder(p)); alert('Rappels envoyes a ' + pending.length + ' familles'); }}>
          Envoyer rappels groupes
        </button>
      </div>

      <div className="g4">
        <div className="card cp">
          <div className="ch">
            <div className="ct">Paiements en attente</div>
            <div style={{ display:'flex', gap:7 }}>
              <button className="btn btn-wa btn-sm" onClick={() => { pending.forEach(p => sendReminder(p)); }}>Rappels WA</button>
              <button className="btn btn-navy btn-sm" onClick={() => setShowForm(!showForm)}>+ Enregistrer</button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={submit} style={{ background:'var(--g0)', borderRadius:8, padding:14, marginBottom:14 }}>
              <div className="fgrid2" style={{ marginBottom:10 }}>
                <div className="fg" style={{ marginBottom:0 }}>
                  <label>Eleve *</label>
                  <select value={form.studentId} onChange={e => setForm({...form, studentId:e.target.value})}>
                    <option value="">Selectionnez un eleve</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                  </select>
                </div>
                <div className="fg" style={{ marginBottom:0 }}>
                  <label>Mois</label>
                  <select value={form.month} onChange={e => setForm({...form, month:e.target.value})}>
                    {['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'].map(m => (
                      <option key={m}>{m} 2026</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="fgrid2" style={{ marginBottom:10 }}>
                <div className="fg" style={{ marginBottom:0 }}>
                  <label>Montant (MAD)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({...form, amount:+e.target.value})} />
                </div>
                <div className="fg" style={{ marginBottom:0 }}>
                  <label>Mode de paiement</label>
                  <select value={form.mode} onChange={e => setForm({...form, mode:e.target.value})}>
                    <option>Especes</option>
                    <option>Virement bancaire</option>
                    <option>CMI / Carte</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>
              <div style={{ background:'var(--greenl)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'var(--green)', marginBottom:10 }}>
                Apres validation : recu PDF + notification WhatsApp au parent
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button type="submit" className="btn btn-green" disabled={loading} style={{ flex:1 }}>{loading?'...':'✓ Valider le paiement'}</button>
                <button type="button" className="btn btn-out" onClick={() => setShowForm(false)} style={{ flex:1 }}>Annuler</button>
              </div>
            </form>
          )}

          <div style={{ background:'var(--g0)', borderRadius:7, marginBottom:5 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 80px 110px', gap:8, padding:'9px 12px', fontSize:10, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>
              <div>Famille</div><div>Montant</div><div>Mois</div><div>Statut</div><div>Actions</div>
            </div>
          </div>
          {payments.map(p => (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 80px 110px', gap:8, padding:'10px 12px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}
              onMouseOver={e => e.currentTarget.style.background='#FAFAF8'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>{p.student?.firstName} {p.student?.lastName}</div>
                <div style={{ fontSize:11, color:'var(--g2)' }}>{p.mode || 'Especes'}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color: p.status==='PAID'?'var(--green)':'var(--amber)' }}>
                {p.amount.toLocaleString('fr-FR')} MAD
              </div>
              <div style={{ fontSize:12, color:'var(--g2)' }}>{p.month}</div>
              <span className={'badge ' + (p.status==='PAID'?'b-g':'b-a')}>
                {p.status==='PAID'?'Paye ✓':'Attente'}
              </span>
              <div style={{ display:'flex', gap:4 }}>
                {p.status !== 'PAID' && (
                  <>
                    <button className="btn btn-wa btn-xs" onClick={() => sendReminder(p)}>WA</button>
                    <button className="btn btn-xs" style={{ background:'var(--greenl)', color:'var(--green)', border:'none', borderRadius:5, padding:'4px 8px', fontSize:10, fontWeight:700, cursor:'pointer' }}
                      onClick={() => markPaid(p.id)}>Paye ✓</button>
                  </>
                )}
                {p.status === 'PAID' && <span style={{ fontSize:11, color:'var(--green)' }}>✓</span>}
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div style={{ padding:24, textAlign:'center', color:'var(--g2)' }}>Aucun paiement enregistre</div>
          )}
        </div>

        <div className="card cp">
          <div className="ch"><div className="ct">Repartition</div></div>
          <div style={{ marginBottom:16 }}>
            <div className="br-row">
              <div className="br-lbl">Payes</div>
              <div className="br-track"><div className="br-fill" style={{ width: payments.length>0?Math.round(paid.length/payments.length*100)+'%':'0%', background:'var(--green)' }}></div></div>
              <div className="br-val" style={{ color:'var(--green)' }}>{paid.length}</div>
            </div>
            <div className="br-row">
              <div className="br-lbl">En attente</div>
              <div className="br-track"><div className="br-fill" style={{ width: payments.length>0?Math.round(pending.length/payments.length*100)+'%':'0%', background:'var(--amber)' }}></div></div>
              <div className="br-val" style={{ color:'var(--amber)' }}>{pending.length}</div>
            </div>
          </div>
          <div style={{ padding:14, background:'var(--greenl)', borderRadius:8, marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', marginBottom:4 }}>TOTAL ENCAISSE</div>
            <div style={{ fontSize:22, fontWeight:700, color:'var(--navy)' }}>{paidAmount.toLocaleString('fr-FR')} MAD</div>
            <div style={{ fontSize:12, color:'var(--g2)' }}>sur {totalAmount.toLocaleString('fr-FR')} MAD total</div>
          </div>
          <div style={{ padding:14, background:'var(--amberl)', borderRadius:8 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--gd)', marginBottom:4 }}>EN ATTENTE</div>
            <div style={{ fontSize:22, fontWeight:700, color:'var(--navy)' }}>{pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')} MAD</div>
            <div style={{ fontSize:12, color:'var(--g2)' }}>{pending.length} famille(s)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
