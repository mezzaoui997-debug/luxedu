import { useState } from 'react';

const CATS = [
  { id:'circulaires',  label:'Circulaires',   color:'#2563EB', bg:'#EFF6FF', icon:'C' },
  { id:'pedagogique',  label:'Pédagogique',   color:'#7C3AED', bg:'#F5F3FF', icon:'P' },
  { id:'administratif',label:'Administratif', color:'#D97706', bg:'#FFFBEB', icon:'A' },
  { id:'rh',           label:'RH',            color:'#0D9488', bg:'#F0FDFA', icon:'R' },
  { id:'parent',       label:'Parents',       color:'#DC2626', bg:'#FEF2F2', icon:'P' },
];

const CAT_MAP = Object.fromEntries(CATS.map(c=>[c.id,c]));

const DEMO_DOCS = [
  { id:'1', name:'Circulaire rentrée 2026-2027.pdf',       cat:'circulaires',   size:'245 Ko',  date:'2026-05-18', author:'Ahmed Benali',  shared:['TEACHER','FONCTIONNAIRE','PARENT'], description:'Informations pour la rentrée scolaire prochaine' },
  { id:'2', name:'Emplois du temps — S2 2026.xlsx',        cat:'pedagogique',   size:'128 Ko',  date:'2026-05-15', author:'Sara Alami',    shared:['TEACHER'], description:'Emplois du temps de tous les enseignants' },
  { id:'3', name:'Règlement intérieur 2026.pdf',            cat:'administratif', size:'512 Ko',  date:'2026-04-20', author:'Ahmed Benali',  shared:['TEACHER','FONCTIONNAIRE','PARENT'], description:'Règlement officiel de l\'établissement' },
  { id:'4', name:'Contrats CDI enseignants.docx',           cat:'rh',            size:'89 Ko',   date:'2026-04-10', author:'Fatima Benali', shared:['DIRECTOR'], description:'Modèles de contrats CDI' },
  { id:'5', name:'Guide parents — portail numérique.pdf',   cat:'parent',        size:'1.2 Mo',  date:'2026-05-10', author:'Ahmed Benali',  shared:['PARENT'], description:'Comment utiliser le portail parents LuxEdu' },
  { id:'6', name:'Programme pédagogique 2026.pdf',          cat:'pedagogique',   size:'890 Ko',  date:'2026-04-05', author:'Sara Alami',    shared:['TEACHER','DIRECTOR'], description:'Programme annuel par matière et niveau' },
  { id:'7', name:'Budget prévisionnel 2026-2027.xlsx',      cat:'administratif', size:'67 Ko',   date:'2026-05-17', author:'Ahmed Benali',  shared:['DIRECTOR'], description:'Budget de l\'année scolaire à venir' },
  { id:'8', name:'Formulaire demande de congé.docx',        cat:'rh',            size:'34 Ko',   date:'2026-03-01', author:'Fatima Benali', shared:['TEACHER','FONCTIONNAIRE'], description:'Formulaire officiel de demande de congé' },
];

const ROLES_LABELS = { DIRECTOR:'Directeur', TEACHER:'Enseignants', FONCTIONNAIRE:'Fonctionnaires', PARENT:'Parents' };

function FileIcon({ ext }) {
  const colors = { pdf:'#DC2626', xlsx:'#16A34A', docx:'#2563EB', ppt:'#D97706' };
  const e = ext.toLowerCase().replace('.','');
  return (
    <div style={{ width:42, height:48, borderRadius:6, background: colors[e]||'#6B7280', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
      <div style={{ position:'absolute', top:0, right:0, width:0, height:0, borderLeft:'10px solid transparent', borderTop:`10px solid rgba(255,255,255,0.3)` }} />
      <span style={{ fontSize:10, fontWeight:800, color:'#fff', letterSpacing:'-.5px' }}>{e.toUpperCase()}</span>
    </div>
  );
}

const EMPTY_FORM = { name:'', cat:'circulaires', description:'', shared:['TEACHER'], date:'' };

export default function Documents() {
  const [docs, setDocs]       = useState(DEMO_DOCS);
  const [catFilter, setCatF]  = useState('all');
  const [search, setSearch]   = useState('');
  const [viewMode, setViewM]  = useState('grid'); // grid | list
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);

  const openNew = () => { setForm(EMPTY_FORM); setModal(true); };

  const save = () => {
    const ext = form.name.includes('.') ? '' : '.pdf';
    setDocs(prev => [{
      id: Date.now().toString(),
      name: form.name + ext,
      cat: form.cat,
      description: form.description,
      shared: form.shared,
      size: '—',
      date: form.date || new Date().toISOString().split('T')[0],
      author: 'Moi',
    }, ...prev]);
    setModal(false);
  };

  const del = (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const toggleShared = (role) => {
    setForm(prev => ({
      ...prev,
      shared: prev.shared.includes(role) ? prev.shared.filter(r=>r!==role) : [...prev.shared, role]
    }));
  };

  const displayed = docs.filter(d => {
    const cf = catFilter==='all' || d.cat===catFilter;
    const sf = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase());
    return cf && sf;
  });

  const inp = { padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:6 };

  const getExt = (name) => name.split('.').pop() || 'pdf';

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Espace documentaire</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Partage et archivage des documents de l'établissement</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ display:'flex', gap:3, background:'#F1F5F9', borderRadius:8, padding:3 }}>
            {[['grid','Grille'],['list','Liste']].map(([k,l]) => (
              <button key={k} onClick={()=>setViewM(k)} style={{ padding:'7px 14px', border:'none', borderRadius:7, fontSize:12, fontWeight:viewMode===k?700:500, cursor:'pointer', fontFamily:'inherit', background:viewMode===k?'#fff':'transparent', color:viewMode===k?'#1B2C5E':'#64748B' }}>{l}</button>
            ))}
          </div>
          <button onClick={openNew} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            + Ajouter document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        {CATS.map(c => {
          const count = docs.filter(d=>d.cat===c.id).length;
          return (
            <div key={c.id} onClick={()=>setCatF(catFilter===c.id?'all':c.id)}
              style={{ background:catFilter===c.id?c.bg:'#fff', border:`1.5px solid ${catFilter===c.id?c.color:'#E2E8F0'}`, borderRadius:10, padding:'12px 14px', cursor:'pointer', transition:'all .15s' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:700, color:c.color }}>{count}</div>
              <div style={{ fontSize:11, color:'#64748B', marginTop:3 }}>{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un document..." style={{ ...inp, flex:1 }} onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
        {catFilter !== 'all' && (
          <button onClick={()=>setCatF('all')} style={{ padding:'10px 16px', background:'#F1F5F9', border:'none', borderRadius:8, fontSize:12, color:'#64748B', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
            Effacer filtre
          </button>
        )}
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {displayed.map(doc => {
            const cat = CAT_MAP[doc.cat] || CATS[0];
            const ext = getExt(doc.name);
            return (
              <div key={doc.id}
                style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'16px', transition:'all .2s', cursor:'default' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.09)'; e.currentTarget.style.borderColor='#1B2C5E'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <FileIcon ext={ext} />
                  <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:100, background:cat.bg, color:cat.color }}>{cat.label}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:4, lineHeight:1.4 }}>{doc.name}</div>
                {doc.description && <div style={{ fontSize:11, color:'#94A3B8', marginBottom:10, lineHeight:1.5 }}>{doc.description}</div>}
                <div style={{ fontSize:10, color:'#94A3B8', marginBottom:10 }}>{doc.size} · {doc.date}</div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                  {doc.shared.map(r => (
                    <span key={r} style={{ fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:100, background:'#F1F5F9', color:'#64748B' }}>{ROLES_LABELS[r]}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:6, paddingTop:10, borderTop:'1px solid #F3F4F6' }}>
                  <button onClick={()=>setPreview(doc)} style={{ flex:1, padding:'6px', background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Aperçu</button>
                  <button onClick={()=>del(doc.id)} style={{ padding:'6px 10px', background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                </div>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div style={{ gridColumn:'span 4', textAlign:'center', padding:48, background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, color:'#94A3B8' }}>
              Aucun document trouvé
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Document','Catégorie','Taille','Date','Partagé avec','Actions'].map(h=>(
                  <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map(doc => {
                const cat = CAT_MAP[doc.cat] || CATS[0];
                const ext = getExt(doc.name);
                return (
                  <tr key={doc.id} style={{ borderBottom:'1px solid #F1F5F9' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                      <FileIcon ext={ext} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{doc.name}</div>
                        <div style={{ fontSize:11, color:'#94A3B8' }}>{doc.description}</div>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px' }}><span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:100, background:cat.bg, color:cat.color }}>{cat.label}</span></td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B' }}>{doc.size}</td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B' }}>{doc.date}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                        {doc.shared.map(r=><span key={r} style={{ fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:100, background:'#F1F5F9', color:'#64748B' }}>{ROLES_LABELS[r]}</span>)}
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={()=>setPreview(doc)} style={{ background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Aperçu</button>
                        <button onClick={()=>del(doc.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:500, padding:'28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                <FileIcon ext={getExt(preview.name)} />
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>{preview.name}</div>
                  <div style={{ fontSize:12, color:'#94A3B8', marginTop:3 }}>{preview.size} · Par {preview.author}</div>
                </div>
              </div>
              <button onClick={()=>setPreview(null)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>
            {preview.description && <div style={{ background:'#F8FAFC', borderRadius:8, padding:'12px 14px', fontSize:13, color:'#374151', lineHeight:1.65, marginBottom:16 }}>{preview.description}</div>}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8 }}>Partagé avec</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {preview.shared.map(r => {
                  return <span key={r} style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:100, background:'#EFF6FF', color:'#2563EB' }}>{ROLES_LABELS[r]}</span>;
                })}
              </div>
            </div>
            <div style={{ background:'#F8FAFC', borderRadius:8, height:160, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #E2E8F0', marginBottom:16 }}>
              <div style={{ textAlign:'center', color:'#94A3B8' }}>
                <FileIcon ext={getExt(preview.name)} />
                <div style={{ fontSize:12, marginTop:8 }}>Aperçu non disponible</div>
                <div style={{ fontSize:11, marginTop:4 }}>Cliquez sur Télécharger pour ouvrir</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setPreview(null)} style={{ flex:1, padding:'11px', background:'#F1F5F9', color:'#374151', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Fermer</button>
              <button style={{ flex:1, padding:'11px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:520 }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>Ajouter un document</h3>
              <button onClick={()=>setModal(false)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>
            <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Nom du document</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="Circulaire mai 2026.pdf" /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={lbl}>Catégorie</label>
                  <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={inp}>
                    {CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp} /></div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} style={{ ...inp, resize:'vertical' }} placeholder="Brève description du document..." /></div>
              <div>
                <label style={lbl}>Partager avec</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {Object.entries(ROLES_LABELS).map(([r,l]) => (
                    <div key={r} onClick={()=>toggleShared(r)}
                      style={{ padding:'7px 14px', border:`1.5px solid ${form.shared.includes(r)?'#1B2C5E':'#E2E8F0'}`, background:form.shared.includes(r)?'#EFF6FF':'#fff', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:form.shared.includes(r)?700:400, color:form.shared.includes(r)?'#1B2C5E':'#64748B', transition:'all .15s' }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={save} disabled={!form.name} style={{ padding:'10px 22px', background:!form.name?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
