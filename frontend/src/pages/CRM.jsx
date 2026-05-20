import { useState, useEffect } from 'react';
import api from '../api/axios';

const STATUSES = [
  { id:'NOUVEAU',   label:'Nouveau',    bg:'#EFF6FF', color:'#2563EB' },
  { id:'CONTACTE',  label:'Contacté',   bg:'#FFFBEB', color:'#D97706' },
  { id:'VISITE',    label:'Visite',     bg:'#F5F3FF', color:'#7C3AED' },
  { id:'INSCRIT',   label:'Inscrit',    bg:'#DCFCE7', color:'#16A34A' },
  { id:'PERDU',     label:'Perdu',      bg:'#FEF2F2', color:'#DC2626' },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s=>[s.id,s]));

const EMPTY = { name:'', phone:'', email:'', child:'', level:'', source:'', notes:'' };

export default function CRM() {
  const [prospects, setProspects] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/prospects').then(r=>{ setProspects(r.data); setLoading(false); }).catch(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name:p.name, phone:p.phone, email:p.email||'', child:p.child, level:p.level, source:p.source||'', notes:p.notes||'' }); setModal(true); };

  const save = async () => {
    try {
      if (editing) { await api.put(`/prospects/${editing.id}`, form); }
      else { await api.post('/prospects', form); }
      setModal(false); load();
    } catch { alert('Erreur'); }
  };

  const changeStatus = async (p, status) => {
    try { await api.put(`/prospects/${p.id}`, { ...p, status }); load(); } catch {}
  };

  const del = async (id) => {
    if (!window.confirm('Supprimer ce prospect ?')) return;
    try { await api.delete(`/prospects/${id}`); load(); } catch {}
  };

  const displayed = prospects.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.child?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = STATUSES.map(s => ({ ...s, count: prospects.filter(p=>p.status===s.id).length }));

  const inp = (k) => ({ value:form[k]||'', onChange:e=>setForm({...form,[k]:e.target.value}), style:{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', boxSizing:'border-box' } });

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:4 }}>CRM Prospects</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Pipeline d'inscriptions — {prospects.length} prospects</p>
        </div>
        <button onClick={openNew} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          + Nouveau prospect
        </button>
      </div>

      {/* Pipeline stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.id} onClick={()=>setFilter(filter===s.id?'all':s.id)}
            style={{ background: filter===s.id ? s.bg : '#fff', border:`1.5px solid ${filter===s.id?s.color:'#E2E8F0'}`, borderRadius:10, padding:'14px 16px', cursor:'pointer', transition:'all .15s' }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:'Georgia,serif', lineHeight:1 }}>{s.count}</div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par nom ou enfant..." style={{ flex:1, padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit', background:'#F8FAFC' }} />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:'center', padding:48, color:'#94A3B8' }}>Chargement...</div>
      ) : (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Famille','Téléphone','Enfant','Niveau','Source','Statut','Date','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:32, color:'#94A3B8', fontSize:13 }}>Aucun prospect trouvé</td></tr>
              ) : displayed.map(p => {
                const st = STATUS_MAP[p.status] || STATUSES[0];
                return (
                  <tr key={p.id} style={{ borderBottom:'1px solid #F1F5F9' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'11px 14px' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{p.name}</div>
                      {p.email && <div style={{ fontSize:11, color:'#94A3B8' }}>{p.email}</div>}
                    </td>
                    <td style={{ padding:'11px 14px', fontSize:13, color:'#374151' }}>{p.phone}</td>
                    <td style={{ padding:'11px 14px', fontSize:13, color:'#374151' }}>{p.child}</td>
                    <td style={{ padding:'11px 14px', fontSize:13, color:'#374151' }}>{p.level}</td>
                    <td style={{ padding:'11px 14px', fontSize:12, color:'#64748B' }}>{p.source||'—'}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <select value={p.status} onChange={e=>changeStatus(p,e.target.value)}
                        style={{ background:st.bg, color:st.color, border:`1px solid ${st.bg}`, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                        {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'11px 14px', fontSize:12, color:'#94A3B8' }}>{p.createdAt?.split('T')[0]||p.createdAt}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>openEdit(p)} style={{ padding:'5px 10px', background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Modifier</button>
                        <button onClick={()=>del(p.id)} style={{ padding:'5px 10px', background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:520, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:17, fontWeight:700, color:'#0F172A' }}>{editing?'Modifier le prospect':'Nouveau prospect'}</h3>
              <button onClick={()=>setModal(false)} style={{ background:'transparent', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[['name','Famille (nom)'],['phone','Téléphone'],['email','Email'],['child','Nom de l\'enfant'],['level','Niveau souhaité'],['source','Source (WhatsApp, Bouche à oreille...)']].map(([k,l])=>(
                <div key={k} style={ k==='source'||k==='name'?{ gridColumn:'span 2' }:{} }>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:5 }}>{l}</label>
                  <input {...inp(k)} placeholder={l} />
                </div>
              ))}
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:5 }}>Notes</label>
                <textarea value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Remarques, intérêts particuliers..." style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', resize:'vertical', minHeight:80, boxSizing:'border-box' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
              <button onClick={()=>setModal(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={save} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {editing?'Enregistrer':'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
