import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const { user, school, logout } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
    api.get('/classes').then(r => setClasses(r.data)).catch(() => {});
    api.get('/payments').then(r => setPayments(r.data)).catch(() => {});
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');

  return (
    <div style={{ display:'flex', height:'100vh', background:'#EEF2F7' }}>
      <div style={{ width:234, background:'#042C53', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'white' }}>{school?.name || 'LuxEdu'}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Casablanca · Maroc</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {[['🏠','Tableau de bord'],['👥','Élèves'],['✅','Présences'],['📊','Notes'],['💰','Paiements'],['⚙️','Paramètres']].map(([ic, lbl]) => (
            <div key={lbl} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, color:'rgba(255,255,255,0.65)', fontSize:12, marginBottom:2, cursor:'pointer' }}
              onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <span>{ic}</span>{lbl}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12, fontWeight:700 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Directeur</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'white', borderBottom:'1px solid #E8E6E0', height:62, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>Tableau de bord</div>
            <div style={{ fontSize:11, color:'#888780' }}>{school?.name} · Année 2025–2026</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:22 }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Bonjour, {user?.firstName} 👋</div>
            <div style={{ fontSize:13, color:'#888780' }}>Bienvenue sur votre tableau de bord LuxEdu</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { lbl:'Élèves inscrits', val:students.length, color:'#E6F1FB', ic:'👥' },
              { lbl:'Classes actives', val:classes.length, color:'#EAF3DE', ic:'🏫' },
              { lbl:'Paiements en attente', val:pending.length, color:'#FCEBEB', ic:'💰' },
              { lbl:'Total paiements', val:payments.length, color:'#FAEEDA', ic:'📊' },
            ].map(m => (
              <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:17, cursor:'pointer' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:11 }}>{m.ic}</div>
                <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>{m.lbl}</div>
                <div style={{ fontSize:28, fontWeight:700, color:'#042C53' }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Élèves récents</div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#F5F5F3' }}>
                  {['Nom','Code Massar','Téléphone parent','Actions'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.slice(0,10).map(s => (
                  <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                    <td style={{ padding:'11px 12px', fontWeight:600 }}>{s.firstName} {s.lastName}</td>
                    <td style={{ padding:'11px 12px', fontFamily:'monospace', color:'#042C53' }}>{s.massar}</td>
                    <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '—'}</td>
                    <td style={{ padding:'11px 12px' }}>
                      <button style={{ background:'#E6F1FB', color:'#0C447C', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Profil</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={4} style={{ padding:20, textAlign:'center', color:'#888780' }}>Aucun élève — ajoutez votre premier élève</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
