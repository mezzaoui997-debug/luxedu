import { useEffect, useState } from 'react';
import api from '../api/axios';

const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20, marginBottom:14 };

function LoginParent({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [massar, setMassar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!phone || !massar) return setError('Remplissez tous les champs');
    setLoading(true); setError('');
    try {
      const r = await api.post('/parent/login', { phone, massar });
      localStorage.setItem('parentToken', r.data.token);
      localStorage.setItem('parentStudent', JSON.stringify(r.data.student));
      onLogin(r.data.student, r.data.token);
    } catch { setError('Numero de telephone ou code Massar incorrect'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f1f4f9', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'white', borderRadius:16, padding:32, width:'100%', maxWidth:400, boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, background:'#1e2d4f', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24 }}>🎓</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:6 }}>Portail Parents</h1>
          <p style={{ fontSize:13, color:'#6b7280' }}>Suivez la scolarite de votre enfant</p>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Votre numero de telephone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212662345678"
            style={{ width:'100%', padding:'10px 14px', border:'1px solid #e5e9f2', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Code Massar de l enfant</label>
          <input value={massar} onChange={e => setMassar(e.target.value.toUpperCase())} placeholder="B903751842"
            style={{ width:'100%', padding:'10px 14px', border:'1px solid #e5e9f2', borderRadius:8, fontSize:14, outline:'none', fontFamily:'monospace', boxSizing:'border-box' }} />
        </div>
        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#dc2626', marginBottom:14 }}>{error}</div>}
        <button onClick={login} disabled={loading}
          style={{ width:'100%', padding:'12px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>
          {loading ? 'Connexion...' : 'Acceder au portail'}
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'#9ca3af', marginTop:16 }}>Contactez l ecole si vous avez oublie votre code Massar</p>
      </div>
    </div>
  );
}

export default function ParentPortal() {
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('parentStudent')); } catch { return null; }
  });
  const [token] = useState(() => localStorage.getItem('parentToken'));
  const [tab, setTab] = useState('accueil');
  const [data, setData] = useState(student);

  useEffect(() => {
    if (student && token) {
      api.get('/parent/student/'+student.id, { headers: { Authorization: 'Bearer '+token } })
        .then(r => setData(r.data)).catch(() => {});
    }
  }, [student]);

  const logout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentStudent');
    setStudent(null);
  };

  if (!student) return <LoginParent onLogin={(s, t) => setStudent(s)} />;

  const absents = data?.attendances?.filter(a => a.status === 'ABSENT') || [];
  const presents = data?.attendances?.filter(a => a.status === 'PRESENT') || [];
  const tauxPresence = data?.attendances?.length > 0 ? Math.round(presents.length / data.attendances.length * 100) : 100;
  const pendingPay = data?.payments?.filter(p => p.status === 'PENDING') || [];
  const paidPay = data?.payments?.filter(p => p.status === 'PAID') || [];

  const TABS = [
    { id:'accueil', lbl:'Accueil', icon:'🏠' },
    { id:'notes', lbl:'Notes', icon:'📊' },
    { id:'presences', lbl:'Presences', icon:'✅' },
    { id:'paiements', lbl:'Paiements', icon:'💰' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f1f4f9', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:'#1e2d4f', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:'white' }}>🎓 LuxEdu — Portail Parents</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{data?.school?.name || 'Ecole Excellence'}</div>
        </div>
        <button onClick={logout} style={{ background:'rgba(255,255,255,0.1)', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, cursor:'pointer' }}>Deconnexion</button>
      </div>

      <div style={{ background:'white', borderBottom:'1px solid #e5e9f2', padding:'0 20px', display:'flex', gap:4, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'12px 16px', border:'none', borderBottom: tab===t.id ? '2px solid #1e2d4f' : '2px solid transparent', background:'none', fontSize:13, fontWeight:tab===t.id?600:400, color:tab===t.id?'#1e2d4f':'#6b7280', cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>{t.lbl}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:16 }}>
        {tab === 'accueil' && (
          <div>
            <div style={{ ...C, background:'linear-gradient(135deg,#1e2d4f,#2d4a7a)', border:'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'white' }}>
                  {data?.firstName?.[0]}{data?.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:'white' }}>{data?.firstName} {data?.lastName}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{data?.class?.name || 'Classe'} · {data?.massar}</div>
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              {[
                { lbl:'Taux presence', val:tauxPresence+'%', color:'#16a34a', bg:'#f0fdf4', icon:'✅' },
                { lbl:'Absences', val:absents.length, color:'#dc2626', bg:'#fef2f2', icon:'⚠️' },
                { lbl:'Paiements dus', val:pendingPay.length, color:'#d97706', bg:'#fffbeb', icon:'💰' },
                { lbl:'Paiements OK', val:paidPay.length, color:'#2563eb', bg:'#eff6ff', icon:'✓' },
              ].map((s,i) => (
                <div key={i} style={{ background:s.bg, borderRadius:12, padding:'14px 16px', border:'1px solid #e5e9f2' }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:3 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            {pendingPay.length > 0 && (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#dc2626', marginBottom:4 }}>⚠️ Paiement en attente</div>
                {pendingPay.map(p => (
                  <div key={p.id} style={{ fontSize:12, color:'#374151' }}>{p.amount?.toLocaleString('fr-FR')} MAD — {p.month}</div>
                ))}
                <div style={{ fontSize:11, color:'#6b7280', marginTop:6 }}>Contactez l ecole pour regulariser</div>
              </div>
            )}
            {absents.length > 0 && (
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Dernieres absences</div>
                {absents.slice(0,5).map((a,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f3f4f6', fontSize:12 }}>
                    <span>{new Date(a.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}</span>
                    <span style={{ color:'#dc2626', fontWeight:600 }}>Absent(e)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'notes' && (
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:16 }}>Notes & evaluations</div>
            {data?.grades?.length === 0 ? (
              <div style={{ ...C, textAlign:'center', padding:40, color:'#6b7280' }}>Aucune note disponible</div>
            ) : (
              [1, 2].map(sem => {
                const semGrades = data?.grades?.filter(g => g.semester === sem) || [];
                if (!semGrades.length) return null;
                return (
                  <div key={sem} style={C}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:14, color:'#1e2d4f' }}>Semestre {sem}</div>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead><tr>
                        {['Matiere','Devoir 1','Devoir 2','Exam','Moyenne'].map(h => (
                          <th key={h} style={{ textAlign:'left', fontSize:10, fontWeight:600, color:'#6b7280', padding:'8px 10px', borderBottom:'1px solid #f3f4f6', textTransform:'uppercase', letterSpacing:'.05em' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {semGrades.map((g,i) => (
                          <tr key={i}>
                            <td style={{ padding:'10px', borderBottom:'1px solid #f9fafb', fontWeight:500, fontSize:13 }}>{g.subject}</td>
                            <td style={{ padding:'10px', borderBottom:'1px solid #f9fafb', fontSize:13, color:'#374151' }}>{g.devoir1 ?? '—'}</td>
                            <td style={{ padding:'10px', borderBottom:'1px solid #f9fafb', fontSize:13, color:'#374151' }}>{g.devoir2 ?? '—'}</td>
                            <td style={{ padding:'10px', borderBottom:'1px solid #f9fafb', fontSize:13, color:'#374151' }}>{g.exam ?? '—'}</td>
                            <td style={{ padding:'10px', borderBottom:'1px solid #f9fafb' }}>
                              <span style={{ fontWeight:700, fontSize:14, color: g.average >= 14 ? '#16a34a' : g.average >= 10 ? '#2563eb' : '#dc2626' }}>
                                {g.average ?? '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'presences' && (
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:16 }}>Historique des presences</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
              {[
                { lbl:'Presents', val:presents.length, color:'#16a34a', bg:'#f0fdf4' },
                { lbl:'Absents', val:absents.length, color:'#dc2626', bg:'#fef2f2' },
                { lbl:'Taux', val:tauxPresence+'%', color:'#2563eb', bg:'#eff6ff' },
              ].map((s,i) => (
                <div key={i} style={{ background:s.bg, borderRadius:10, padding:'12px', textAlign:'center', border:'1px solid #e5e9f2' }}>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <div style={C}>
              {data?.attendances?.length === 0 ? (
                <div style={{ textAlign:'center', padding:30, color:'#6b7280' }}>Aucune donnee de presence</div>
              ) : (
                data?.attendances?.slice(0,30).map((a,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #f3f4f6' }}>
                    <div style={{ fontSize:13, color:'#374151' }}>
                      {new Date(a.date).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })}
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, padding:'3px 10px', borderRadius:20,
                      background: a.status==='PRESENT'?'#dcfce7':a.status==='ABSENT'?'#fee2e2':'#fef3c7',
                      color: a.status==='PRESENT'?'#16a34a':a.status==='ABSENT'?'#dc2626':'#d97706' }}>
                      {a.status==='PRESENT'?'Present':a.status==='ABSENT'?'Absent':'Retard'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'paiements' && (
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:16 }}>Situation financiere</div>
            {pendingPay.length > 0 && (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'14px 16px', marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#dc2626' }}>⚠️ {pendingPay.length} paiement(s) en attente</div>
                <div style={{ fontSize:12, color:'#dc2626', marginTop:4 }}>{pendingPay.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')} MAD a regulariser</div>
              </div>
            )}
            <div style={C}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Historique des paiements</div>
              {data?.payments?.length === 0 ? (
                <div style={{ textAlign:'center', padding:30, color:'#6b7280' }}>Aucun paiement enregistre</div>
              ) : (
                data?.payments?.map((p,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500 }}>{p.month}</div>
                      <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('fr-FR') : 'Non regle'}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{(p.amount||0).toLocaleString('fr-FR')} MAD</div>
                      <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:p.status==='PAID'?'#dcfce7':'#fee2e2', color:p.status==='PAID'?'#16a34a':'#dc2626' }}>
                        {p.status==='PAID'?'Paye':'En attente'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
