import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const CALENDRIER = [
  { ic:'🏫', lbl:'Rentree scolaire', date:'08 Sep 2025', color:'#3B6D11', bg:'#EAF3DE', past:true },
  { ic:'🌙', lbl:'1ere pause', date:'19-26 Oct 2025', color:'#185FA5', bg:'#E6F1FB', past:true },
  { ic:'🇲🇦', lbl:'Marche Verte', date:'06 Nov 2025', color:'#854F0B', bg:'#FAEEDA', past:true },
  { ic:'🇲🇦', lbl:'Fete Independance', date:'18 Nov 2025', color:'#854F0B', bg:'#FAEEDA', past:true },
  { ic:'❄️', lbl:'2eme pause', date:'07-14 Dec 2025', color:'#185FA5', bg:'#E6F1FB', past:true },
  { ic:'🇲🇦', lbl:'Manifeste Independance', date:'11 Jan 2026', color:'#854F0B', bg:'#FAEEDA', past:true },
  { ic:'📚', lbl:'Vacances mi-annee S1', date:'25 Jan-01 Fev 2026', color:'#534AB7', bg:'#EEEDFE', past:true },
  { ic:'🌸', lbl:'3eme pause', date:'15-22 Mars 2026', color:'#185FA5', bg:'#E6F1FB', past:true },
  { ic:'🇲🇦', lbl:'Fete du Travail', date:'01 Mai 2026', color:'#854F0B', bg:'#FAEEDA', past:false },
  { ic:'☀️', lbl:'4eme pause', date:'03-10 Mai 2026', color:'#185FA5', bg:'#E6F1FB', past:false },
  { ic:'🌙', lbl:'Aid Al-Adha', date:'27-29 Mai 2026', color:'#854F0B', bg:'#FAEEDA', past:false },
  { ic:'📝', lbl:'Examens BAC', date:'Juin 2026', color:'#A32D2D', bg:'#FCEBEB', past:false },
];

export default function Dashboard({ setPage }) {
  const { user, school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title:'', date:'' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(()=>{});
    api.get('/payments').then(r => setPayments(r.data)).catch(()=>{});
    api.get('/attendance').then(r => setAttendance(r.data)).catch(()=>{});
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const recouvrement = payments.length > 0 ? Math.round(paid.length/payments.length*100) : 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAbsents = attendance.filter(a => a.date?.startsWith(todayStr) && a.status === 'ABSENT');
  const filtered = students.filter(s => (s.firstName+' '+s.lastName+s.massar).toLowerCase().includes(search.toLowerCase()));

  const nextEvents = CALENDRIER.filter(e => !e.past).slice(0,3);

  return (
    <div className="page-enter">
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:22, fontWeight:700, color:'var(--navy)', marginBottom:3 }}>Bonjour, {user?.firstName} 👋</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>{new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} · {school?.name}</div>
      </div>

      <div className="metrics">
        <div className="metric" onClick={() => setPage('eleves')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#E6F1FB' }}></div>
          <div className="mlbl">Eleves inscrits</div>
          <div className="mval">{students.length}</div>
          <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>Annee 2025-2026</div>
        </div>
        <div className="metric" onClick={() => setPage('paiements')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#FCEBEB' }}></div>
          <div className="mlbl">Paiements en attente</div>
          <div className="mval" style={{ color:'var(--red)' }}>{pending.length}</div>
          <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>{pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')} MAD</div>
        </div>
        <div className="metric" onClick={() => setPage('paiements')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#EAF3DE' }}></div>
          <div className="mlbl">Taux recouvrement</div>
          <div className="mval" style={{ color:'var(--green)' }}>{recouvrement}%</div>
          <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>{paid.length} payes / {payments.length}</div>
        </div>
        <div className="metric" onClick={() => setPage('presences')} style={{ cursor:'pointer' }}>
          <div className="mic" style={{ background:'#FAEEDA' }}></div>
          <div className="mlbl">Absents aujourd hui</div>
          <div className="mval" style={{ color:'var(--amber)' }}>{todayAbsents.length}</div>
          <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>Sur {students.length} eleves</div>
        </div>
      </div>

      {(pending.length > 0 || todayAbsents.length > 0) && (
        <div style={{ background:'linear-gradient(135deg,var(--navy) 0%,var(--blue2) 100%)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:26 }}>🤖</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:3 }}>Alertes IA — Actions recommandees</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
              {pending.length > 0 && `${pending.length} paiement(s) en retard · ${pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')} MAD non recouvert`}
              {pending.length > 0 && todayAbsents.length > 0 && ' · '}
              {todayAbsents.length > 0 && `${todayAbsents.length} absence(s) aujourd hui non notifiees`}
            </div>
          </div>
          <button className="btn btn-gold btn-sm" onClick={() => setPage('notifs')}>Voir alertes</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
        <div className="card cp">
          <div className="ch">
            <div className="ct">Eleves inscrits</div>
            <div style={{ display:'flex', gap:8 }}>
              <div className="sbox">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className="sinp" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." />
              </div>
              <button className="btn btn-navy btn-sm" onClick={() => setPage('eleves')}>Voir tous</button>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Eleve</th><th>Code Massar</th><th>Date inscription</th><th>Statut paiement</th></tr></thead>
            <tbody>
              {filtered.slice(0,6).map(s => {
                const sp = payments.filter(p => p.studentId === s.id);
                const hasPending = sp.some(p => p.status === 'PENDING');
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="tav">
                        <div className="av" style={{ width:30, height:30, fontSize:10, background:'var(--bl)', color:'var(--blue)' }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <div><div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div><div style={{ fontSize:11, color:'var(--g2)' }}>{s.parentPhone||'—'}</div></div>
                      </div>
                    </td>
                    <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--navy)', fontWeight:700 }}>{s.massar}</td>
                    <td style={{ fontSize:12, color:'var(--g2)' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td><span className={'badge '+(hasPending?'b-r':'b-g')}>{hasPending?'En retard':'A jour'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="card cp">
            <div className="ct" style={{ marginBottom:12 }}>Actions rapides</div>
            {[
              { ic:'👥', lbl:'Voir les eleves', p:'eleves', color:'var(--navy)', bg:'var(--bl)' },
              { ic:'📊', lbl:'Consulter les notes', p:'notes', color:'var(--purple)', bg:'var(--purpl)' },
              { ic:'📄', lbl:'Generer bulletins', p:'bulletins', color:'var(--amber)', bg:'var(--amberl)' },
              { ic:'💰', lbl:'Suivi paiements', p:'paiements', color:'var(--green)', bg:'var(--greenl)' },
              { ic:'🔔', lbl:'Notifications', p:'notifs', color:'var(--red)', bg:'var(--redl)' },
            ].map(a => (
              <button key={a.p} onClick={() => setPage(a.p)}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', background:a.bg, width:'100%', textAlign:'left', marginBottom:7 }}>
                <span style={{ fontSize:14 }}>{a.ic}</span>
                <span style={{ fontSize:12, fontWeight:700, color:a.color, flex:1 }}>{a.lbl}</span>
                <span style={{ color:a.color }}>→</span>
              </button>
            ))}
          </div>

          <div className="card" style={{ padding:16, background:'var(--navy)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:10 }}>Taux de recouvrement</div>
            <div style={{ fontSize:28, fontWeight:700, color:'white', marginBottom:8 }}>{recouvrement}%</div>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:6, height:8, overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', borderRadius:6, background:'var(--gold)', width:recouvrement+'%', transition:'width .8s' }}></div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{paid.length} payes sur {payments.length}</div>
          </div>
        </div>
      </div>

      <div className="card cp">
        <div className="ch">
          <div className="ct"> Calendrier scolaire 2025-2026 · MEN Maroc</div>
          <div style={{ display:'flex', gap:8 }}>
            <span className="badge b-g">Officiel</span>
            <button className="btn btn-out btn-sm" onClick={() => setShowCalendar(!showCalendar)}>
              {showCalendar ? 'Reduire' : 'Tout voir'}
            </button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:10 }}>Prochaines dates importantes</div>
            {nextEvents.map((ev,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, background:ev.bg, border:'1px solid '+ev.color+'33', marginBottom:8 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{ev.ic}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:ev.color }}>{ev.lbl}</div>
                  <div style={{ fontSize:11, color:'var(--g2)', marginTop:1 }}>{ev.date}</div>
                </div>
                <span style={{ background:ev.color, color:'white', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>A venir</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)', marginBottom:10 }}> Evenements de l ecole</div>
            {customEvents.length === 0 ? (
              <div style={{ fontSize:12, color:'var(--g2)', marginBottom:10, padding:'10px 12px', background:'var(--g0)', borderRadius:9 }}>
                Aucun evenement · Ajoutez vos evenements ci-dessous
              </div>
            ) : (
              customEvents.map((ev,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, background:'var(--bl)', border:'1px solid var(--g1)', marginBottom:6 }}>
                  <span>📌</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--navy)' }}>{ev.title}</div>
                    <div style={{ fontSize:11, color:'var(--g2)' }}>{new Date(ev.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <button onClick={() => setCustomEvents(p=>p.filter((_,j)=>j!==i))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--g2)' }}>✕</button>
                </div>
              ))
            )}
            <div style={{ display:'flex', gap:7 }}>
              <input value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} placeholder="Nom evenement..."
                style={{ flex:1, padding:'8px 10px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:12, outline:'none' }} />
              <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})}
                style={{ padding:'8px 10px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:12, outline:'none' }} />
              <button onClick={() => { if(!newEvent.title||!newEvent.date) return; setCustomEvents([...customEvents,newEvent]); setNewEvent({title:'',date:''}); }}
                className="btn btn-navy btn-sm">+</button>
            </div>
          </div>
        </div>

        {showCalendar && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', marginBottom:10 }}>Calendrier complet MEN 2025-2026</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {CALENDRIER.map((ev,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', borderRadius:9, background:ev.past?'var(--g0)':ev.bg, border:'1px solid '+(ev.past?'var(--g1)':ev.color+'33'), opacity:ev.past?0.6:1 }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>{ev.ic}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:ev.past?'var(--g2)':ev.color, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.lbl}</div>
                    <div style={{ fontSize:10, color:'var(--g2)', marginTop:1 }}>{ev.date}</div>
                  </div>
                  {ev.past && <span style={{ marginLeft:'auto', fontSize:9, color:'var(--g2)', flexShrink:0 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
