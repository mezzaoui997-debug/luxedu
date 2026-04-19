import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function FonctionnaireDashboard() {
  const { user, school, logout } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState('inscriptions');

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
    api.get('/payments').then(r => setPayments(r.data));
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');

  const openBulletin = async (studentId) => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://luxedu-production.up.railway.app/api/bulletin/' + studentId + '/1', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const html = await res.text();
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:220, background:'var(--navy)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'white' }}>{school?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Espace Fonctionnaire</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px' }}>
          {[
            ['inscriptions','📋','Inscriptions'],
            ['paiements','💰','Paiements'],
            ['certificats','🎓','Certificats'],
          ].map(([id,ic,lbl]) => (
            <div key={id} onClick={() => setPage(id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2,
                background: page===id?'rgba(255,255,255,0.14)':'transparent',
                color: page===id?'white':'rgba(255,255,255,0.55)', fontSize:12 }}>
              <span>{ic}</span>{lbl}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', cursor:'pointer', borderRadius:8 }} onClick={logout}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Se deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'white', borderBottom:'1px solid var(--g1)', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>
              {page==='inscriptions'?'Inscriptions':page==='paiements'?'Paiements':'Certificats'}
            </div>
            <div style={{ fontSize:11, color:'var(--g2)' }}>{school?.name}</div>
          </div>
          <span style={{ background:'var(--purpl)', color:'var(--purple)', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20 }}>
            Fonctionnaire
          </span>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:22 }}>
          {page === 'inscriptions' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Liste des eleves inscrits</div>
                <div style={{ fontSize:13, color:'var(--g2)' }}>{students.length} eleves · Annee 2025-2026</div>
              </div>
              <div className="card cp">
                <table className="tbl">
                  <thead>
                    <tr><th>Eleve</th><th>Code Massar</th><th>Tel. Parent</th><th>Date inscription</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C' }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          </div>
                        </td>
                        <td style={{ fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td style={{ color:'var(--g2)' }}>{s.parentPhone || '-'}</td>
                        <td style={{ color:'var(--g2)', fontSize:12 }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td><span className="badge b-g">Inscrit</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'paiements' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Suivi des paiements</div>
                <div style={{ fontSize:13, color:'var(--g2)' }}>{pending.length} en attente</div>
              </div>
              <div className="metrics" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:16 }}>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--greenl)' }}>✅</div>
                  <div className="mlbl">Payes</div>
                  <div className="mval" style={{ color:'var(--green)' }}>{payments.filter(p=>p.status==='PAID').length}</div>
                </div>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--redl)' }}>⏳</div>
                  <div className="mlbl">En attente</div>
                  <div className="mval" style={{ color:'var(--amber)' }}>{pending.length}</div>
                </div>
                <div className="metric">
                  <div className="mic" style={{ background:'var(--bl)' }}>💰</div>
                  <div className="mlbl">Total</div>
                  <div className="mval">{payments.length}</div>
                </div>
              </div>
              <div className="card cp">
                <table className="tbl">
                  <thead>
                    <tr><th>Famille</th><th>Montant</th><th>Mois</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight:700 }}>{p.student?.firstName} {p.student?.lastName}</td>
                        <td style={{ fontWeight:700 }}>{p.amount} MAD</td>
                        <td style={{ color:'var(--g2)' }}>{p.month}</td>
                        <td>
                          <span className={'badge '+(p.status==='PAID'?'b-g':'b-a')}>
                            {p.status==='PAID'?'Paye':'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'certificats' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Certificats de scolarite</div>
                <div style={{ fontSize:13, color:'var(--g2)' }}>Generer un certificat pour chaque eleve</div>
              </div>
              <div className="card cp">
                <table className="tbl">
                  <thead>
                    <tr><th>Eleve</th><th>Code Massar</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C' }}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                          </div>
                        </td>
                        <td style={{ fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td>
                          <button className="btn btn-navy btn-sm" onClick={() => openBulletin(s.id)}>
                            Certificat PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
