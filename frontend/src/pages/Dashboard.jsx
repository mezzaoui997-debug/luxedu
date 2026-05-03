import { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };
const TH = { textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 14px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' };
const TD = { padding:'13px 14px', borderBottom:'1px solid #e5e9f2', fontSize:13, verticalAlign:'middle' };

function LineChart({ data }) {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chart.current) chart.current.destroy();
    const ctx = ref.current.getContext('2d');
    chart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Fev','Mar','Avr','Mai','Jun'],
        datasets: [
          { label:'6eme Exc.', data:[17,17.2,17.4,17.8,null,null], borderColor:'#1e2d4f', backgroundColor:'rgba(30,45,79,0.05)', tension:.4, pointRadius:4, pointBackgroundColor:'#1e2d4f', spanGaps:false },
          { label:'5eme A', data:[14,14.3,14.6,15.1,null,null], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.05)', tension:.4, pointRadius:4, pointBackgroundColor:'#f59e0b', spanGaps:false },
          { label:'4eme A', data:[13.8,13.9,14.1,14.3,null,null], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.05)', tension:.4, pointRadius:4, pointBackgroundColor:'#3b82f6', spanGaps:false }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{ size:11 }, color:'#6b7280' } }, y:{ min:10, max:20, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{ size:11 }, color:'#6b7280' } } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, []);
  return <canvas ref={ref} />;
}

function DonutChart({ id, data, colors, cutout, size }) {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chart.current) chart.current.destroy();
    const ctx = ref.current.getContext('2d');
    chart.current = new Chart(ctx, {
      type: 'doughnut',
      data: { datasets:[{ data, backgroundColor:colors, borderWidth:0 }] },
      options: { cutout: cutout||'72%', responsive:false, plugins:{ legend:{ display:false }, tooltip:{ enabled:false } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, []);
  return <canvas ref={ref} width={size||100} height={size||100} />;
}

function BarChart() {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chart.current) chart.current.destroy();
    const ctx = ref.current.getContext('2d');
    chart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['6eme Exc.','5eme A','5eme B','4eme A','3eme Bac'],
        datasets: [
          { label:'Semestre 1', data:[16.8,14.5,13.9,13.2,11.8], backgroundColor:'#3b82f6', borderRadius:4 },
          { label:'Semestre 2', data:[17.6,15.1,14.4,13.8,12.1], backgroundColor:'#f59e0b', borderRadius:4 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:11 }, color:'#6b7280' } }, y:{ min:8, max:20, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{ size:11 }, color:'#6b7280' } } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, []);
  return <canvas ref={ref} />;
}

const CALENDRIER = [
  { lbl:'Rentree scolaire', date:'08 Sep 2025', past:true },
  { lbl:'1ere pause', date:'19-26 Oct 2025', past:true },
  { lbl:'Marche Verte', date:'06 Nov 2025', past:true },
  { lbl:'Fete Independance', date:'18 Nov 2025', past:true },
  { lbl:'2eme pause', date:'07-14 Dec 2025', past:true },
  { lbl:'Manifeste Independance', date:'11 Jan 2026', past:true },
  { lbl:'Vacances mi-annee S1', date:'25 Jan - 01 Fev 2026', past:true },
  { lbl:'3eme pause', date:'15-22 Mars 2026', past:true },
  { lbl:'Fete du Travail', date:'01 Mai 2026', past:false },
  { lbl:'4eme pause', date:'03-10 Mai 2026', past:false },
  { lbl:'Aid Al-Adha', date:'27-29 Mai 2026', past:false },
  { lbl:'Examens BAC', date:'Juin 2026', past:false },
];

export default function Dashboard({ setPage }) {
  const { user, school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title:'', date:'' });
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(()=>{});
    api.get('/payments').then(r => setPayments(r.data)).catch(()=>{});
    api.get('/attendance').then(r => setAttendance(r.data)).catch(()=>{});
    setChartLoaded(true);
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const recouvrement = payments.length > 0 ? Math.round(paid.length/payments.length*100) : 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAbsents = attendance.filter(a => a.date?.startsWith(todayStr) && a.status === 'ABSENT');
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const markPaid = async (id) => {
    try { await api.put('/payments/'+id+'/pay'); const r = await api.get('/payments'); setPayments(r.data); } catch {}
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Bonjour, {user?.firstName} !</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>Resume de l ecole · {today}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Eleves inscrits', value:students.length, sub:'Annee 2025-2026' },
          { label:'Presence aujourd hui', value:students.length>0?Math.round((students.length-todayAbsents.length)/students.length*100)+'%':'—', sub:todayAbsents.length+' absent(s)' },
          { label:'Paiements en attente', value:pending.length, sub:pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')+' MAD dus', red:true },
          { label:'Taux recouvrement', value:recouvrement+'%', sub:paid.length+' payes / '+payments.length },
        ].map((s,i) => (
          <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
            <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-1px', color:s.red?'#ef4444':'#111827' }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#6b7280', marginTop:8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div style={{ background:'linear-gradient(135deg,#1e2d4f,#2d4a7a)', borderRadius:10, padding:'14px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'white', marginBottom:3 }}>{pending.length} paiement(s) en retard</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>{pending.reduce((a,p)=>a+p.amount,0).toLocaleString('fr-FR')} MAD non recouvert</div>
          </div>
          <button onClick={() => setPage('paiements')} style={{ background:'#f59e0b', color:'#78350f', border:'none', borderRadius:7, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>Voir alertes</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Evolution des moyennes — 2025/2026</span>
            <button onClick={() => setPage('rapports')} style={{ fontSize:12, color:'#3b82f6', background:'none', border:'none', cursor:'pointer' }}>Rapports →</button>
          </div>
          <div style={{ display:'flex', gap:16, marginBottom:12 }}>
            {[['#1e2d4f','6eme Exc.'],['#f59e0b','5eme A'],['#3b82f6','4eme A']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }}></div>
                <span style={{ fontSize:11, color:'#6b7280' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ height:180 }}>{chartLoaded && <LineChart />}</div>
        </div>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Presences S2</div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
            <div style={{ position:'relative', width:100, height:100, flexShrink:0 }}>
              {chartLoaded && <DonutChart data={[94,3,3]} colors={['#1e2d4f','#f59e0b','#ef4444']} />}
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', pointerEvents:'none' }}>
                <div style={{ fontSize:20, fontWeight:700 }}>94%</div>
                <div style={{ fontSize:9, color:'#6b7280' }}>presence</div>
              </div>
            </div>
            <div>
              {[['#1e2d4f','Present 94%'],['#f59e0b','Retard 3%'],['#ef4444','Absent 3%']].map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6, fontSize:12 }}>
                  <div style={{ width:9, height:9, borderRadius:'50%', background:c }}></div>{l}
                </div>
              ))}
            </div>
          </div>
          {[['6eme Exc.',98,'#22c55e'],['5eme A',95,'#3b82f6'],['4eme A',88,'#3b82f6'],['3eme Bac',81,'#f59e0b']].map(([l,v,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9, fontSize:12 }}>
              <span style={{ width:70, color:'#6b7280', fontSize:11 }}>{l}</span>
              <div style={{ flex:1, height:6, background:'#f1f4f9', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:3, background:c, width:v+'%' }}></div>
              </div>
              <span style={{ width:32, textAlign:'right', fontWeight:600 }}>{v}%</span>
            </div>
          ))}
        </div>
      </div>


      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Recouvrement paiements</div>
          <div style={{ fontSize:11, color:'#6b7280', marginBottom:12 }}>Evolution mensuelle 2025-2026</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:120 }}>
            {[{m:'Sep',p:45},{m:'Oct',p:52},{m:'Nov',p:61},{m:'Dec',p:68},{m:'Jan',p:74},{m:'Fev',p:78},{m:'Mar',p:82},{m:'Avr',p:recouvrement||85},{m:'Mai',p:null}].map(({m,p}) => {
              const val = p || 0;
              const col = val >= 80 ? '#22c55e' : val >= 60 ? '#3b82f6' : val >= 40 ? '#f59e0b' : '#e5e9f2';
              return (
                <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  {p !== null && <div style={{ fontSize:8, fontWeight:700, color:col }}>{val}%</div>}
                  <div style={{ width:'100%', background: p !== null ? col : '#e5e9f2', borderRadius:'2px 2px 0 0', height: p !== null ? val+'%' : '5%', minHeight:3 }}></div>
                  <div style={{ fontSize:8, color:'#9ca3af' }}>{m}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:10, display:'flex', gap:8 }}>
            <div style={{ flex:1, background:'#f0fdf4', borderRadius:8, padding:'7px 10px', textAlign:'center' }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#16a34a' }}>{paid.length}</div>
              <div style={{ fontSize:9, color:'#6b7280' }}>Payes</div>
            </div>
            <div style={{ flex:1, background:'#fef2f2', borderRadius:8, padding:'7px 10px', textAlign:'center' }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#dc2626' }}>{pending.length}</div>
              <div style={{ fontSize:9, color:'#6b7280' }}>En attente</div>
            </div>
            <div style={{ flex:1, background:'#eff6ff', borderRadius:8, padding:'7px 10px', textAlign:'center' }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#2563eb' }}>{recouvrement}%</div>
              <div style={{ fontSize:9, color:'#6b7280' }}>Taux</div>
            </div>
          </div>
        </div>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Repartition niveaux</div>
          <div style={{ fontSize:11, color:'#6b7280', marginBottom:10 }}>Eleves par classe</div>
          {chartLoaded && <div style={{ position:'relative', width:100, height:100, margin:'0 auto 12px' }}>
            <DonutChart data={[8,7,6,5,4]} colors={['#1e2d4f','#3b82f6','#f59e0b','#22c55e','#8b5cf6']} cutout="60%" size={100} />
          </div>}
          {[['6eme Exc.','#1e2d4f',8],['5eme A','#3b82f6',7],['4eme A','#f59e0b',6],['3eme Bac','#22c55e',5]].map(([l,c,n]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, fontSize:11 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c, flexShrink:0 }}></div>
              <span style={{ flex:1, color:'#6b7280' }}>{l}</span>
              <span style={{ fontWeight:600 }}>{students.length > 0 ? Math.round(students.length*(n/30)) : n} eleves</span>
            </div>
          ))}
        </div>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Comparaison S1 vs S2</div>
          <div style={{ fontSize:11, color:'#6b7280', marginBottom:12 }}>Moyennes par classe</div>
          <div style={{ height:160 }}>{chartLoaded && <BarChart />}</div>
          <div style={{ display:'flex', gap:12, marginTop:8, fontSize:11 }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#3b82f6', display:'inline-block' }}></span>Semestre 1</span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#f59e0b', display:'inline-block' }}></span>Semestre 2</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Eleves inscrits</span>
            <button onClick={() => setPage('eleves')} style={{ fontSize:12, color:'#3b82f6', background:'none', border:'none', cursor:'pointer' }}>Voir tous →</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Eleve','Massar','Paiement'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {students.slice(0,5).map(s => {
                const hasPending = payments.some(p => p.studentId===s.id && p.status==='PENDING');
                return (
                  <tr key={s.id}>
                    <td style={TD}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:'#dbeafe', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <span style={{ fontWeight:500 }}>{s.firstName} {s.lastName}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, fontFamily:'monospace', fontSize:11, color:'#1e2d4f' }}>{s.massar}</td>
                    <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:hasPending?'#fee2e2':'#dcfce7', color:hasPending?'#dc2626':'#16a34a' }}>{hasPending?'En retard':'A jour'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Activite recente</div>
          {[
            { dot:'#22c55e', text:'Presences enregistrees', time:'Il y a 10 min' },
            { dot:'#3b82f6', text:'Notes S2 Mathematiques sauvegardees', time:'Il y a 35 min' },
            { dot:'#f59e0b', text:'Rappel WA envoye — Famille en retard', time:'Il y a 1h' },
            { dot:'#8b5cf6', text:'Bulletin PDF genere', time:'Il y a 2h' },
          ].map((a,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:a.dot, marginTop:5, flexShrink:0 }}></div>
              <div><div style={{ fontSize:13 }}>{a.text}</div><div style={{ fontSize:11, color:'#6b7280' }}>{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Calendrier scolaire 2025-2026 · MEN Maroc</span>
            <span style={{ background:'#dcfce7', color:'#16a34a', fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20 }}>Officiel</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
            {CALENDRIER.map((ev,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, background:ev.past?'#f9fafb':'#eff6ff', border:'1px solid '+(ev.past?'#e5e9f2':'#bfdbfe'), opacity:ev.past?0.6:1 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:ev.past?'#6b7280':'#1e40af' }}>{ev.lbl}</div>
                  <div style={{ fontSize:10, color:'#9ca3af', marginTop:1 }}>{ev.date}</div>
                </div>
                {ev.past && <span style={{ fontSize:9, color:'#9ca3af' }}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid #e5e9f2', paddingTop:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#111827', marginBottom:8 }}>Evenements de l ecole</div>
            {customEvents.map((ev,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, background:'#eff6ff', border:'1px solid #bfdbfe', marginBottom:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#1e40af' }}>{ev.title}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>{new Date(ev.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <button onClick={() => setCustomEvents(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:14 }}>×</button>
              </div>
            ))}
            <div style={{ display:'flex', gap:7, marginTop:8 }}>
              <input value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} placeholder="Nom de l evenement..."
                style={{ flex:1, padding:'7px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, outline:'none' }} />
              <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})}
                style={{ padding:'7px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, outline:'none' }} />
              <button onClick={() => { if(!newEvent.title||!newEvent.date) return; setCustomEvents([...customEvents,newEvent]); setNewEvent({title:'',date:''}); }}
                style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>+</button>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ ...C, flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Actions rapides</div>
            {[
              { lbl:'Tous les eleves', p:'eleves', bg:'#eff6ff', color:'#2563eb' },
              { lbl:'Notes & bulletins', p:'notes', bg:'#fffbeb', color:'#d97706' },
              { lbl:'Presences', p:'presences', bg:'#f0fdf4', color:'#16a34a' },
              { lbl:'Paiements', p:'paiements', bg:'#fef2f2', color:'#dc2626' },
              { lbl:'Rapports', p:'rapports', bg:'#f5f3ff', color:'#7c3aed' },
              { lbl:'Parametres', p:'parametres', bg:'#f8fafc', color:'#374151' },
            ].map(a => (
              <button key={a.p} onClick={() => setPage(a.p)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer', background:a.bg, width:'100%', marginBottom:7, fontSize:12, fontWeight:600, color:a.color }}>
                {a.lbl} <span>→</span>
              </button>
            ))}
          </div>
          <div style={{ background:'#1e2d4f', borderRadius:12, padding:16 }}>
            <div style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:10 }}>Taux recouvrement</div>
            <div style={{ fontSize:28, fontWeight:700, color:'white', marginBottom:8 }}>{recouvrement}%</div>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:4, height:6, overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', borderRadius:4, background:'#f59e0b', width:recouvrement+'%' }}></div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{paid.length} payes sur {payments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
