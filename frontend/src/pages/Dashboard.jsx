import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const CALENDRIER = [
  { ic:'🏫', lbl:'Rentree scolaire', date:'08 Sep 2025', color:'#3B6D11', bg:'#EAF3DE' },
  { ic:'🌙', lbl:'1ere pause', date:'19-26 Oct 2025', color:'#185FA5', bg:'#E6F1FB' },
  { ic:'🇲🇦', lbl:'Marche Verte', date:'06 Nov 2025', color:'#854F0B', bg:'#FAEEDA' },
  { ic:'🇲🇦', lbl:'Fete Independance', date:'18 Nov 2025', color:'#854F0B', bg:'#FAEEDA' },
  { ic:'❄️', lbl:'2eme pause', date:'07-14 Dec 2025', color:'#185FA5', bg:'#E6F1FB' },
  { ic:'🇲🇦', lbl:'Manifeste Independance', date:'11 Jan 2026', color:'#854F0B', bg:'#FAEEDA' },
  { ic:'📚', lbl:'Vacances mi-annee S1', date:'25 Jan-01 Fev 2026', color:'#534AB7', bg:'#EEEDFE' },
  { ic:'🌸', lbl:'3eme pause', date:'15-22 Mars 2026', color:'#185FA5', bg:'#E6F1FB' },
  { ic:'🇲🇦', lbl:'Fete du Travail', date:'01 Mai 2026', color:'#854F0B', bg:'#FAEEDA' },
  { ic:'☀️', lbl:'4eme pause', date:'03-10 Mai 2026', color:'#185FA5', bg:'#E6F1FB' },
  { ic:'🌙', lbl:'Aid Al-Adha', date:'27-29 Mai 2026', color:'#854F0B', bg:'#FAEEDA' },
  { ic:'📝', lbl:'Examens BAC', date:'Juin 2026', color:'#A32D2D', bg:'#FCEBEB' },
];

export default function Dashboard({ setPage }) {
  const { user, school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title:'', date:'' });

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
    api.get('/payments').then(r => setPayments(r.data)).catch(() => {});
    api.get('/attendance').then(r => setAttendance(r.data)).catch(() => {});
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAbsents = attendance.filter(a => a.date && a.date.startsWith(todayStr) && a.status === 'ABSENT');

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>
          Bonjour, {user?.firstName} 👋
        </div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>
          Bienvenue sur votre tableau de bord · {school?.name}
        </div>
      </div>

      <div className="metrics">
        <div className="metric" onClick={() => setPage('eleves')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#E6F1FB' }}>👥</div>
          <div className="mlbl">Eleves inscrits</div>
          <div className="mval">{students.length}</div>
        </div>
        <div className="metric" onClick={() => setPage('paiements')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#FCEBEB' }}>💰</div>
          <div className="mlbl">Paiements en attente</div>
          <div className="mval" style={{ color:'#A32D2D' }}>{pending.length}</div>
        </div>
        <div className="metric" onClick={() => setPage('paiements')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#EAF3DE' }}>✅</div>
          <div className="mlbl">Paiements regles</div>
          <div className="mval" style={{ color:'#3B6D11' }}>{paid.length}</div>
        </div>
        <div className="metric" onClick={() => setPage('presences')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#FAEEDA' }}>📋</div>
          <div className="mlbl">Absents aujourd hui</div>
          <div className="mval" style={{ color:'#854F0B' }}>{todayAbsents.length}</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div style={{ background:'linear-gradient(135deg, #042C53 0%, #185FA5 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:28 }}>🤖</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>
              Alerte IA — {pending.length} paiement(s) en retard
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
              Total non recouvre : {pending.reduce((a,p) => a + p.amount, 0).toLocaleString('fr-FR')} MAD
            </div>
          </div>
          <button onClick={() => setPage('paiements')}
            style={{ background:'#EF9F27', color:'#633806', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Voir paiements →
          </button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
        <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)' }}>Derniers eleves inscrits</div>
            <button onClick={() => setPage('eleves')}
              style={{ background:'var(--bl)', border:'none', borderRadius:7, padding:'5px 12px', fontSize:11, fontWeight:700, color:'var(--blue)', cursor:'pointer' }}>
              Voir tous
            </button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F5F5F3' }}>
                {['Eleve','Code Massar','Date','Statut'].map(h => (
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map(s => (
                <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--bl)', color:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
                    </div>
                  </td>
                  <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:11, color:'var(--g2)' }}>{s.massar}</td>
                  <td style={{ padding:'10px 12px', fontSize:12, color:'var(--g2)' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ background:'var(--greenl)', color:'var(--green)', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Inscrit</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', marginBottom:12 }}>Actions rapides</div>
            {[
              { ic:'📝', lbl:'Inscrire un eleve', p:'eleves', color:'#042C53', bg:'#E6F1FB' },
              { ic:'💰', lbl:'Enregistrer paiement', p:'paiements', color:'#3B6D11', bg:'#EAF3DE' },
              { ic:'📊', lbl:'Saisir notes', p:'notes', color:'#534AB7', bg:'#EEEDFE' },
              { ic:'📄', lbl:'Generer bulletin', p:'bulletins', color:'#854F0B', bg:'#FAEEDA' },
            ].map(a => (
              <button key={a.p} onClick={() => setPage(a.p)}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:7 }}>
                <span style={{ fontSize:15 }}>{a.ic}</span>
                <span style={{ fontSize:12, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                <span style={{ color:a.color }}>→</span>
              </button>
            ))}
          </div>
          <div style={{ background:'var(--navy)', borderRadius:10, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:10 }}>Taux recouvrement</div>
            <div style={{ fontSize:28, fontWeight:700, color:'white', marginBottom:8 }}>
              {payments.length > 0 ? Math.round(paid.length / payments.length * 100) : 0}%
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:6, height:8, overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', borderRadius:6, background:'#EF9F27', width:(payments.length>0?Math.round(paid.length/payments.length*100):0)+'%' }}></div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{paid.length} payes sur {payments.length}</div>
          </div>
        </div>
      </div>

      <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)' }}>📅 Calendrier scolaire 2025-2026 · MEN Maroc</div>
          <span style={{ background:'var(--greenl)', color:'var(--green)', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>Officiel</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
          {CALENDRIER.map((ev, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', borderRadius:9, background:ev.bg, border:'1px solid '+ev.color+'33' }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{ev.ic}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, color:ev.color, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.lbl}</div>
                <div style={{ fontSize:10, color:'#888780', marginTop:1 }}>{ev.date}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--g1)', paddingTop:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:8 }}>📌 Evenements de l ecole</div>
          {customEvents.length === 0 ? (
            <div style={{ fontSize:12, color:'var(--g2)', marginBottom:10 }}>Aucun evenement · Ajoutez vos evenements ci-dessous</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:10 }}>
              {customEvents.map((ev, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, background:'var(--gl)', border:'1px solid var(--g1)' }}>
                  <span style={{ fontSize:14 }}>📌</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)' }}>{ev.title}</div>
                    <div style={{ fontSize:11, color:'var(--g2)' }}>{new Date(ev.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <button onClick={() => setCustomEvents(customEvents.filter((_,j) => j!==i))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--g2)', fontSize:14 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:8 }}>
            <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title:e.target.value})}
              placeholder="Nom de l evenement (ex: Reunion parents)"
              style={{ flex:1, padding:'8px 11px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:12, outline:'none' }} />
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date:e.target.value})}
              style={{ padding:'8px 11px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:12, outline:'none' }} />
            <button onClick={() => {
              if (!newEvent.title || !newEvent.date) return;
              setCustomEvents([...customEvents, newEvent]);
              setNewEvent({ title:'', date:'' });
            }} style={{ background:'var(--navy)', color:'white', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              + Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
