import { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const TYPES = {
  DEVOIR:  { label:'Devoir',  bg:'#FEF3C7', color:'#D97706', border:'#FDE68A' },
  LECON:   { label:'Leçon',   bg:'#DBEAFE', color:'#2563EB', border:'#BFDBFE' },
  PROJET:  { label:'Projet',  bg:'#F5F3FF', color:'#7C3AED', border:'#DDD6FE' },
  EXAMEN:  { label:'Examen',  bg:'#FEE2E2', color:'#DC2626', border:'#FECACA' },
  ACTIVITE:{ label:'Activité',bg:'#DCFCE7', color:'#16A34A', border:'#BBF7D0' },
};

const SUBJECTS = ['Mathématiques','Français','Sciences','Histoire-Géographie','Arabe','Anglais','Éducation physique','Arts plastiques','Informatique'];
const CLASSES  = [{ id:'6exc', name:'6ème Excellence' },{ id:'5a', name:'5ème A' },{ id:'4a', name:'4ème A' },{ id:'3bac', name:'3ème Bac' }];

const EMPTY = { classId:'6exc', className:'6ème Excellence', subject:'Mathématiques', type:'DEVOIR', title:'', description:'', dueDate:'' };

function daysUntil(dateStr) {
  const diff = (new Date(dateStr) - new Date()) / 86400000;
  if (diff < 0)   return { label:'Dépassé', color:'#DC2626', bg:'#FEF2F2' };
  if (diff < 1)   return { label:'Aujourd\'hui', color:'#D97706', bg:'#FFFBEB' };
  if (diff < 3)   return { label:`Dans ${Math.ceil(diff)} j`, color:'#D97706', bg:'#FFFBEB' };
  return { label:`Dans ${Math.ceil(diff)} j`, color:'#16A34A', bg:'#F0FDF4' };
};

export default function CahierTexte() {
  const { user } = useAuthStore();
  const [items, setItems]     = useState([]);
  const [filter, setFilter]   = useState('all');
  const [classFilter, setCF]  = useState('all');
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const isTeacher = user?.role === 'TEACHER';

  const load = () => {
    setLoading(true);
    api.get('/cahier').then(r=>{ setItems(r.data); setLoading(false); }).catch(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (i) => { setEditing(i); setForm({ classId:i.classId, className:i.className, subject:i.subject, type:i.type, title:i.title, description:i.description, dueDate:i.dueDate }); setModal(true); };

  const save = async () => {
    try {
      const data = { ...form };
      if (editing) { await api.put(`/cahier/${editing.id}`, data); }
      else { await api.post('/cahier', data); }
      setModal(false); load();
    } catch { alert('Erreur'); }
  };

  const toggleDone = async (item) => {
    try { await api.put(`/cahier/${item.id}`, { done: !item.done }); }
    catch {}
    setItems(prev => prev.map(i => i.id===item.id ? {...i, done:!i.done} : i));
  };

  const del = async (id) => {
    if (!window.confirm('Supprimer ?')) return;
    try { await api.delete(`/cahier/${id}`); load(); } catch {}
  };

  const displayed = items.filter(i => {
    const mf = filter==='all' || i.type===filter || (filter==='pending' && !i.done) || (filter==='done' && i.done);
    const cf = classFilter==='all' || i.classId===classFilter;
    return mf && cf;
  });

  const upcoming = items.filter(i => !i.done && new Date(i.dueDate) >= new Date()).length;
  const overdue  = items.filter(i => !i.done && new Date(i.dueDate) < new Date()).length;

  const inputStyle = { width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Cahier de texte</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Devoirs, leçons et activités — accessibles par les parents</p>
        </div>
        <button onClick={openNew} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          + Publier
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:22 }}>
        {[
          { label:'Total publiés', val:items.length, color:'#2563EB', bg:'#EFF6FF' },
          { label:'En attente', val:upcoming, color:'#D97706', bg:'#FFFBEB' },
          { label:'En retard', val:overdue, color:'#DC2626', bg:'#FEF2F2' },
          { label:'Complétés', val:items.filter(i=>i.done).length, color:'#16A34A', bg:'#F0FDF4' },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.bg}`, borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:700, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:9, padding:4 }}>
          {[['all','Tous'],['pending','En attente'],['done','Complétés'],['DEVOIR','Devoirs'],['EXAMEN','Examens']].map(([k,l]) => (
            <button key={k} onClick={()=>setFilter(k)} style={{ padding:'6px 14px', border:'none', borderRadius:7, fontSize:12, fontWeight:filter===k?700:500, cursor:'pointer', fontFamily:'inherit', background:filter===k?'#fff':'transparent', color:filter===k?'#1B2C5E':'#64748B', boxShadow:filter===k?'0 1px 3px rgba(0,0,0,.08)':'none', transition:'all .15s' }}>{l}</button>
          ))}
        </div>
        <select value={classFilter} onChange={e=>setCF(e.target.value)}
          style={{ padding:'8px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:12, color:'#374151', background:'#fff', cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
          <option value="all">Toutes les classes</option>
          {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:48, color:'#94A3B8' }}>Chargement...</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background:'#fff', border:'1px solid #E2E8F0', borderRadius:12 }}>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Aucun élément trouvé</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {displayed.map(item => {
            const ts = TYPES[item.type] || TYPES.DEVOIR;
            const due = daysUntil(item.dueDate);
            return (
              <div key={item.id}
                style={{ background:'#fff', border:`1px solid ${item.done?'#E2E8F0':'#E2E8F0'}`, borderRadius:14, padding:'18px 20px', opacity:item.done?.8:1, transition:'all .2s', position:'relative', overflow:'hidden' }}>
                {/* top accent */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:ts.color, opacity:item.done?.4:1 }} />

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:100, background:ts.bg, color:ts.color, border:`1px solid ${ts.border}` }}>{ts.label}</span>
                    <span style={{ fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:100, background:'#F1F5F9', color:'#64748B' }}>{item.className}</span>
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    {(isTeacher || user?.role==='DIRECTOR') && (
                      <>
                        <button onClick={()=>openEdit(item)} style={{ background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:5, padding:'3px 8px', fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Modifier</button>
                        <button onClick={()=>del(item.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:5, padding:'3px 8px', fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:6, textDecoration:item.done?'line-through':undefined }}>{item.title}</div>
                <div style={{ fontSize:12, color:'#64748B', lineHeight:1.6, marginBottom:12 }}>{item.description}</div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid #F1F5F9' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>Matière</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{item.subject}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:2, alignItems:'flex-end' }}>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>Date limite</div>
                    <div style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, background:due.bg, color:due.color }}>{due.label}</div>
                  </div>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                  <div style={{ fontSize:11, color:'#94A3B8' }}>Par {item.teacherName}</div>
                  <button onClick={()=>toggleDone(item)}
                    style={{ padding:'5px 12px', border:`1.5px solid ${item.done?'#BBF7D0':'#E2E8F0'}`, background:item.done?'#DCFCE7':'transparent', color:item.done?'#16A34A':'#64748B', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
                    {item.done ? 'Complété' : 'Marquer complété'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:560, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{editing?'Modifier':'Publier dans le cahier de texte'}</h3>
              <button onClick={()=>setModal(false)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>
            <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Classe</label>
                  <select value={form.classId} onChange={e=>{ const c=CLASSES.find(cl=>cl.id===e.target.value); setForm({...form,classId:e.target.value,className:c?.name||''}); }} style={inputStyle}>
                    {CLASSES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Matière</label>
                  <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inputStyle}>
                    {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Type</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inputStyle}>
                    {Object.entries(TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Date limite</label>
                  <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Titre</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Titre du devoir ou de la leçon" style={inputStyle} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Description</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Instructions détaillées..." rows={4} style={{ ...inputStyle, resize:'vertical' }} />
              </div>
            </div>
            <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={save} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {editing?'Enregistrer':'Publier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
