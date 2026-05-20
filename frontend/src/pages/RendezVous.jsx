import { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const HOURS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

const STATUS = {
  PENDING:  { label:'En attente',  bg:'#FFFBEB', color:'#D97706', border:'#FDE68A' },
  CONFIRMED:{ label:'Confirmé',    bg:'#DCFCE7', color:'#16A34A', border:'#BBF7D0' },
  CANCELLED:{ label:'Annulé',      bg:'#FEF2F2', color:'#DC2626', border:'#FECACA' },
  DONE:     { label:'Effectué',    bg:'#F3F4F6', color:'#6B7280', border:'#E5E7EB' },
};

const DEMO_RDV = [
  { id:'1', parentName:'M. & Mme Benjelloun', studentName:'Youssef Benjelloun', teacherName:'Sara Alami', subject:'Mathématiques', date:'2026-05-22', time:'09:00', status:'CONFIRMED', notes:'Discussion sur les résultats du S2', motif:'Résultats scolaires' },
  { id:'2', parentName:'Mme Tazi',             studentName:'Mehdi Tazi',         teacherName:'Mohamed Alami', subject:'Français',       date:'2026-05-22', time:'10:00', status:'PENDING',   notes:'', motif:'Comportement' },
  { id:'3', parentName:'M. Ouazzani',           studentName:'Lina Ouazzani',      teacherName:'Sara Alami',    subject:'Mathématiques', date:'2026-05-23', time:'14:00', status:'PENDING',   notes:'', motif:'Orientation' },
  { id:'4', parentName:'M. & Mme Alaoui',       studentName:'Sara Alaoui',        teacherName:'Khadija Tazi',  subject:'Sciences',      date:'2026-05-20', time:'15:00', status:'DONE',      notes:'Excellent entretien', motif:'Félicitations' },
];

const TEACHERS = ['Sara Alami','Mohamed Alami','Khadija Tazi','Youssef Bennani'];
const MOTIFS   = ['Résultats scolaires','Comportement','Orientation','Absences répétées','Félicitations','Autre'];

const EMPTY_FORM = { parentName:'', studentName:'', teacherName:TEACHERS[0], subject:'', date:'', time:'09:00', motif:MOTIFS[0], notes:'' };

function dateLabel(d) {
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
}

export default function RendezVous() {
  const { user } = useAuthStore();
  const [rdvs, setRdvs]       = useState(DEMO_RDV);
  const [view, setView]        = useState('list'); // list | calendar
  const [modal, setModal]      = useState(false);
  const [editing, setEditing]  = useState(null);
  const [form, setForm]        = useState(EMPTY_FORM);
  const [filter, setFilter]    = useState('all');
  const [dateFilter, setDateF] = useState('');

  const openNew  = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ parentName:r.parentName, studentName:r.studentName, teacherName:r.teacherName, subject:r.subject, date:r.date, time:r.time, motif:r.motif, notes:r.notes||'' }); setModal(true); };

  const save = () => {
    if (editing) {
      setRdvs(prev => prev.map(r => r.id===editing.id ? { ...r, ...form } : r));
    } else {
      setRdvs(prev => [{ id: Date.now().toString(), ...form, status:'PENDING' }, ...prev]);
    }
    setModal(false);
  };

  const changeStatus = (id, status) => {
    setRdvs(prev => prev.map(r => r.id===id ? { ...r, status } : r));
  };

  const del = (id) => {
    if (!window.confirm('Supprimer ce rendez-vous ?')) return;
    setRdvs(prev => prev.filter(r => r.id !== id));
  };

  const displayed = rdvs.filter(r => {
    const mf = filter==='all' || r.status===filter;
    const df = !dateFilter || r.date===dateFilter;
    return mf && df;
  });

  // Group by date for calendar view
  const byDate = displayed.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const stats = [
    { label:'Total', val:rdvs.length, color:'#2563EB', bg:'#EFF6FF' },
    { label:'En attente', val:rdvs.filter(r=>r.status==='PENDING').length, color:'#D97706', bg:'#FFFBEB' },
    { label:'Confirmés', val:rdvs.filter(r=>r.status==='CONFIRMED').length, color:'#16A34A', bg:'#F0FDF4' },
    { label:'Effectués', val:rdvs.filter(r=>r.status==='DONE').length, color:'#6B7280', bg:'#F3F4F6' },
  ];

  const inp = { padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:6 };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Rendez-vous parents</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Planification des entretiens parents-professeurs</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ display:'flex', gap:3, background:'#F1F5F9', borderRadius:8, padding:3 }}>
            {[['list','Liste'],['calendar','Agenda']].map(([k,l]) => (
              <button key={k} onClick={()=>setView(k)} style={{ padding:'7px 16px', border:'none', borderRadius:7, fontSize:12, fontWeight:view===k?700:500, cursor:'pointer', fontFamily:'inherit', background:view===k?'#fff':'transparent', color:view===k?'#1B2C5E':'#64748B', boxShadow:view===k?'0 1px 3px rgba(0,0,0,.08)':'none' }}>{l}</button>
            ))}
          </div>
          <button onClick={openNew} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            + Nouveau RDV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:s.bg, borderRadius:10, padding:'14px 16px', border:`1px solid ${s.bg}` }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:700, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:9, padding:4 }}>
          {[['all','Tous'],['PENDING','En attente'],['CONFIRMED','Confirmés'],['DONE','Effectués'],['CANCELLED','Annulés']].map(([k,l]) => (
            <button key={k} onClick={()=>setFilter(k)} style={{ padding:'6px 14px', border:'none', borderRadius:7, fontSize:12, fontWeight:filter===k?700:500, cursor:'pointer', fontFamily:'inherit', background:filter===k?'#fff':'transparent', color:filter===k?'#1B2C5E':'#64748B', boxShadow:filter===k?'0 1px 3px rgba(0,0,0,.08)':'none' }}>{l}</button>
          ))}
        </div>
        <input type="date" value={dateFilter} onChange={e=>setDateF(e.target.value)} style={{ ...inp, width:'auto', cursor:'pointer' }} />
        {dateFilter && <button onClick={()=>setDateF('')} style={{ padding:'8px 14px', background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Effacer</button>}
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Date & Heure','Parent','Élève','Enseignant','Motif','Statut','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'#94A3B8', fontSize:13 }}>Aucun rendez-vous</td></tr>
              ) : displayed.map(r => {
                const st = STATUS[r.status];
                return (
                  <tr key={r.id} style={{ borderBottom:'1px solid #F1F5F9', transition:'background .1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{dateLabel(r.date)}</div>
                      <div style={{ fontSize:12, color:'#64748B', marginTop:2 }}>{r.time}</div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:13, color:'#374151', fontWeight:500 }}>{r.parentName}</td>
                    <td style={{ padding:'12px 14px', fontSize:13, color:'#374151' }}>{r.studentName}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:13, color:'#374151' }}>{r.teacherName}</div>
                      <div style={{ fontSize:11, color:'#94A3B8' }}>{r.subject}</div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B' }}>{r.motif}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <select value={r.status} onChange={e=>changeStatus(r.id,e.target.value)}
                        style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}`, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                        {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={()=>openEdit(r)} style={{ background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Modifier</button>
                        <button onClick={()=>del(r.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {Object.keys(byDate).sort().map(date => (
            <div key={date} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
              <div style={{ background:'#1B2C5E', padding:'12px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{dateLabel(date)}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>{byDate[date].length} rendez-vous</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, padding:16 }}>
                {byDate[date].map(r => {
                  const st = STATUS[r.status];
                  return (
                    <div key={r.id} style={{ border:`1px solid ${st.border}`, background:st.bg, borderRadius:10, padding:'12px 14px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                        <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:'#0F172A' }}>{r.time}</div>
                        <span style={{ fontSize:10, fontWeight:700, color:st.color }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:3 }}>{r.parentName}</div>
                      <div style={{ fontSize:12, color:'#64748B', marginBottom:3 }}>{r.studentName}</div>
                      <div style={{ fontSize:11, color:'#94A3B8' }}>{r.teacherName} · {r.motif}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(byDate).length === 0 && (
            <div style={{ textAlign:'center', padding:48, background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, color:'#94A3B8' }}>Aucun rendez-vous</div>
          )}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:560, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{editing?'Modifier le rendez-vous':'Nouveau rendez-vous'}</h3>
              <button onClick={()=>setModal(false)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8', lineHeight:1 }}>×</button>
            </div>
            <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label style={lbl}>Nom du parent</label><input value={form.parentName} onChange={e=>setForm({...form,parentName:e.target.value})} style={inp} placeholder="M. & Mme Benjelloun" /></div>
                <div><label style={lbl}>Nom de l'élève</label><input value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})} style={inp} placeholder="Youssef Benjelloun" /></div>
                <div>
                  <label style={lbl}>Enseignant</label>
                  <select value={form.teacherName} onChange={e=>setForm({...form,teacherName:e.target.value})} style={inp}>
                    {TEACHERS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Matière</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp} placeholder="Mathématiques" /></div>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Heure</label>
                  <select value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={inp}>
                    {HOURS.map(h=><option key={h}>{h}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'span 2' }}>
                  <label style={lbl}>Motif</label>
                  <select value={form.motif} onChange={e=>setForm({...form,motif:e.target.value})} style={inp}>
                    {MOTIFS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'span 2' }}>
                  <label style={lbl}>Notes (optionnel)</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} style={{ ...inp, resize:'vertical' }} placeholder="Remarques ou points à aborder..." />
                </div>
              </div>
            </div>
            <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={save} disabled={!form.parentName||!form.date} style={{ padding:'10px 22px', background:!form.parentName?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {editing?'Enregistrer':'Créer le RDV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
