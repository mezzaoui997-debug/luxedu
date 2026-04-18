import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Paiements() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId:'', amount:2800, month:'Avril 2026' });

  const load = () => api.get('/payments').then(r => setPayments(r.data));
  useEffect(() => {
    load();
    api.get('/students').then(r => setStudents(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', form);
      setShowForm(false);
      load();
    } catch(err) { alert('Erreur: ' + err.message); }
  };

  const markPaid = async (id) => {
    try {
      await api.put('/payments/' + id + '/pay');
      load();
    } catch(err) { alert('Erreur: ' + err.message); }
  };

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');

  return (
    <div style={{ padding:22 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Paiements</div>
        <div style={{ fontSize:13, color:'#888780' }}>Suivi des frais de scolarité</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
        {[{ lbl:'Total paiements', val:payments.length, bg:'#E6F1FB', c:'#0C447C' },{ lbl:'En attente', val:pending.length, bg:'#FCEBEB', c:'#A32D2D' },{ lbl:'Payés', val:paid.length, bg:'#EAF3DE', c:'#3B6D11' }].map(m => (
          <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:5 }}>{m.lbl}</div>
            <div style={{ fontSize:28, fontWeight:700, color:m.c }}>{m.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Enregistrer paiement
        </button>
      </div>
      {showForm && (
        <div style={{ background:'white', border:'1px solid #E8E6E0', borderRadius:10, padding:20, marginBottom:14 }}>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Élève</label>
                <select value={form.studentId} onChange={e => setForm({...form, studentId:e.target.value})}
                  style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }}>
                  <option value="">Sélectionner</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Montant (MAD)</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount:+e.target.value})}
                  style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Mois</label>
                <input value={form.month} onChange={e => setForm({...form, month:e.target.value})}
                  style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" style={{ background:'#3B6D11', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✓ Enregistrer</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Annuler</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#F5F5F3' }}>
              {['Élève','Montant','Mois','Statut','Actions'].map(h => (
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                <td style={{ padding:'11px 12px', fontWeight:700 }}>{p.student?.firstName} {p.student?.lastName}</td>
                <td style={{ padding:'11px 12px', fontWeight:700, color:'#042C53' }}>{p.amount} MAD</td>
                <td style={{ padding:'11px 12px', color:'#888780' }}>{p.month}</td>
                <td style={{ padding:'11px 12px' }}>
                  <span style={{ background: p.status==='PAID'?'#EAF3DE':'#FAEEDA', color: p.status==='PAID'?'#3B6D11':'#854F0B', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>
                    {p.status==='PAID' ? 'Payé ✓' : 'En attente'}
                  </span>
                </td>
                <td style={{ padding:'11px 12px' }}>
                  {p.status !== 'PAID' && (
                    <button onClick={() => markPaid(p.id)}
                      style={{ background:'#EAF3DE', color:'#3B6D11', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      Marquer payé ✓
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={5} style={{ padding:24, textAlign:'center', color:'#888780' }}>Aucun paiement enregistré</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
