import { useState } from 'react';

const CATS = [
  { id:'salaires',     label:'Salaires',        color:'#7C3AED', bg:'#F5F3FF' },
  { id:'fournitures',  label:'Fournitures',      color:'#2563EB', bg:'#EFF6FF' },
  { id:'entretien',    label:'Entretien',         color:'#D97706', bg:'#FFFBEB' },
  { id:'informatique', label:'Informatique',      color:'#0D9488', bg:'#F0FDFA' },
  { id:'transport',    label:'Transport',          color:'#DC2626', bg:'#FEF2F2' },
  { id:'autre',        label:'Autre',             color:'#6B7280', bg:'#F3F4F6' },
];

const CAT_MAP = Object.fromEntries(CATS.map(c=>[c.id,c]));

const DEMO_DEPENSES = [
  { id:'1', label:'Salaires enseignants — Mai 2026',  cat:'salaires',     montant:42000, date:'2026-05-01', note:'8 enseignants × 5 250 MAD', recurrent:true },
  { id:'2', label:'Salaires administration — Mai',     cat:'salaires',     montant:12000, date:'2026-05-01', note:'3 administratifs', recurrent:true },
  { id:'3', label:'Fournitures bureau',                cat:'fournitures',  montant:1850,  date:'2026-05-03', note:'Papier, stylos, classeurs', recurrent:false },
  { id:'4', label:'Maintenance climatiseurs',          cat:'entretien',    montant:3200,  date:'2026-05-08', note:'Entreprise FroidPro', recurrent:false },
  { id:'5', label:'Abonnement LuxEdu — Annuel',        cat:'informatique', montant:3990,  date:'2026-05-10', note:'Logiciel ERP scolaire', recurrent:true },
  { id:'6', label:'Carburant bus scolaire',            cat:'transport',    montant:2400,  date:'2026-05-15', note:'Mois de mai 2026', recurrent:true },
  { id:'7', label:'Photocopies et impressions',        cat:'fournitures',  montant:980,   date:'2026-05-17', note:'1 800 copies', recurrent:false },
];

const DEMO_REVENUS = [
  { id:'r1', label:'Frais scolarité — Mai 2026', montant:126000, date:'2026-05-01', note:'45 élèves × 2 800 MAD', type:'scolarite' },
  { id:'r2', label:'Frais inscription nouveaux', montant:8000,   date:'2026-05-05', note:'4 nouveaux élèves', type:'inscription' },
  { id:'r3', label:'Cantine — Mai 2026',          montant:12000,  date:'2026-05-01', note:'40 élèves × 300 MAD', type:'cantine' },
  { id:'r4', label:'Transport scolaire',          montant:9000,   date:'2026-05-01', note:'18 élèves × 500 MAD', type:'transport' },
];

const EMPTY_DEP = { label:'', cat:'salaires', montant:'', date:'', note:'', recurrent:false };

export default function Budget() {
  const [depenses, setDepenses] = useState(DEMO_DEPENSES);
  const [revenus]               = useState(DEMO_REVENUS);
  const [tab, setTab]           = useState('overview');
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_DEP);
  const [editing, setEditing]   = useState(null);
  const [catFilter, setCatF]    = useState('all');

  const totalDepenses = depenses.reduce((a,d)=>a+d.montant, 0);
  const totalRevenus  = revenus.reduce((a,r)=>a+r.montant, 0);
  const solde         = totalRevenus - totalDepenses;

  const catTotals = CATS.map(c => ({
    ...c,
    total: depenses.filter(d=>d.cat===c.id).reduce((a,d)=>a+d.montant,0),
    count: depenses.filter(d=>d.cat===c.id).length,
  }));

  const openNew  = () => { setEditing(null); setForm(EMPTY_DEP); setModal(true); };
  const openEdit = (d) => { setEditing(d); setForm({ label:d.label, cat:d.cat, montant:d.montant, date:d.date, note:d.note||'', recurrent:d.recurrent }); setModal(true); };

  const save = () => {
    const data = { ...form, montant: parseFloat(form.montant)||0 };
    if (editing) {
      setDepenses(prev => prev.map(d => d.id===editing.id ? { ...d, ...data } : d));
    } else {
      setDepenses(prev => [{ id:Date.now().toString(), ...data }, ...prev]);
    }
    setModal(false);
  };

  const del = (id) => {
    if (!window.confirm('Supprimer cette dépense ?')) return;
    setDepenses(prev => prev.filter(d => d.id !== id));
  };

  const filtered = catFilter === 'all' ? depenses : depenses.filter(d=>d.cat===catFilter);

  const inp = { padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#0F172A', background:'#F8FAFC', outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:6 };
  const card = { background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:'20px 22px', marginBottom:14 };

  const fmt = (n) => n.toLocaleString('fr-FR') + ' MAD';

  const TABS = [['overview','Vue d\'ensemble'],['depenses','Dépenses'],['revenus','Revenus']];

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Budget & Dépenses</h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Suivi financier de l'établissement — Mai 2026</p>
        </div>
        <button onClick={openNew} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          + Ajouter dépense
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        <div style={{ background:'linear-gradient(135deg,#1B2C5E,#2563EB)', borderRadius:14, padding:'20px 22px', color:'#fff' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginBottom:8 }}>Revenus ce mois</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, lineHeight:1 }}>{fmt(totalRevenus)}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:6 }}>4 sources de revenus</div>
        </div>
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:14, padding:'20px 22px' }}>
          <div style={{ fontSize:12, color:'#94A3B8', marginBottom:8 }}>Dépenses ce mois</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, color:'#DC2626', lineHeight:1 }}>{fmt(totalDepenses)}</div>
          <div style={{ fontSize:11, color:'#94A3B8', marginTop:6 }}>{depenses.length} postes de dépenses</div>
        </div>
        <div style={{ background: solde >= 0 ? '#F0FDF4' : '#FEF2F2', border:`1px solid ${solde>=0?'#BBF7D0':'#FECACA'}`, borderRadius:14, padding:'20px 22px' }}>
          <div style={{ fontSize:12, color:'#94A3B8', marginBottom:8 }}>Solde du mois</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, color:solde>=0?'#16A34A':'#DC2626', lineHeight:1 }}>{solde>=0?'+':''}{fmt(solde)}</div>
          <div style={{ fontSize:11, color:'#94A3B8', marginTop:6 }}>Taux charges : {Math.round(totalDepenses/totalRevenus*100)} %</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
        {TABS.map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ padding:'8px 20px', border:'none', borderRadius:8, fontSize:13, fontWeight:tab===k?700:500, cursor:'pointer', fontFamily:'inherit', background:tab===k?'#fff':'transparent', color:tab===k?'#1B2C5E':'#64748B', boxShadow:tab===k?'0 1px 4px rgba(0,0,0,.08)':'none' }}>{l}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* depenses by cat */}
          <div style={card}>
            <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:16 }}>Dépenses par catégorie</div>
            {catTotals.filter(c=>c.total>0).sort((a,b)=>b.total-a.total).map(c => (
              <div key={c.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:c.color }} />
                    <span style={{ fontSize:13, color:'#374151' }}>{c.label}</span>
                    <span style={{ fontSize:11, color:'#94A3B8' }}>{c.count} postes</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:c.color }}>{fmt(c.total)}</span>
                </div>
                <div style={{ height:6, background:'#F3F4F6', borderRadius:3 }}>
                  <div style={{ width: Math.round(c.total/totalDepenses*100)+'%', height:6, borderRadius:3, background:c.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Revenus breakdown */}
          <div style={card}>
            <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:16 }}>Revenus par source</div>
            {revenus.map(r => (
              <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F3F4F6' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{r.label}</div>
                  <div style={{ fontSize:11, color:'#94A3B8' }}>{r.note}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:'#16A34A' }}>{fmt(r.montant)}</div>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', marginTop:4 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>Total revenus</span>
              <span style={{ fontSize:14, fontWeight:800, color:'#16A34A' }}>{fmt(totalRevenus)}</span>
            </div>
          </div>

          {/* Monthly evolution mini */}
          <div style={{ ...card, gridColumn:'span 2' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:16 }}>Évolution mensuelle 2025-2026</div>
            <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:80 }}>
              {[['Sep',38,62],['Oct',41,65],['Nov',39,68],['Déc',52,71],['Jan',55,74],['Fév',58,76],['Mar',60,78],['Avr',62,80],['Mai',66,155]].map(([m,d,r],i) => {
                const maxVal = 160;
                return (
                  <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, justifyContent:'flex-end', height:'100%' }}>
                    <div style={{ width:'100%', display:'flex', gap:1, alignItems:'flex-end', justifyContent:'center', height:72 }}>
                      <div style={{ flex:1, background:'#FECACA', borderRadius:'2px 2px 0 0', height: Math.round(d/maxVal*72)+'px' }} />
                      <div style={{ flex:1, background:'#BBF7D0', borderRadius:'2px 2px 0 0', height: Math.round(r/maxVal*72)+'px' }} />
                    </div>
                    <div style={{ fontSize:8, color:'#94A3B8' }}>{m}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:16, marginTop:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748B' }}><div style={{ width:10, height:10, borderRadius:2, background:'#FECACA' }} />Dépenses (milliers MAD)</div>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#64748B' }}><div style={{ width:10, height:10, borderRadius:2, background:'#BBF7D0' }} />Revenus (milliers MAD)</div>
            </div>
          </div>
        </div>
      )}

      {/* DEPENSES */}
      {tab === 'depenses' && (
        <div>
          <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
            {[{id:'all',label:'Toutes'},...CATS].map(c => (
              <button key={c.id} onClick={()=>setCatF(c.id)} style={{ padding:'6px 14px', border:`1.5px solid ${catFilter===c.id?(CAT_MAP[c.id]?.color||'#1B2C5E'):'#E2E8F0'}`, background:catFilter===c.id?(CAT_MAP[c.id]?.bg||'#EFF6FF'):'#fff', color:catFilter===c.id?(CAT_MAP[c.id]?.color||'#1B2C5E'):'#64748B', borderRadius:20, fontSize:12, fontWeight:catFilter===c.id?700:400, cursor:'pointer', fontFamily:'inherit' }}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#F8FAFC' }}>
                  {['Libellé','Catégorie','Montant','Date','Récurrent','Actions'].map(h=>(
                    <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const cat = CAT_MAP[d.cat] || CATS[5];
                  return (
                    <tr key={d.id} style={{ borderBottom:'1px solid #F1F5F9' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ fontSize:13, fontWeight:500, color:'#0F172A' }}>{d.label}</div>
                        {d.note && <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{d.note}</div>}
                      </td>
                      <td style={{ padding:'12px 14px' }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:100, background:cat.bg, color:cat.color }}>{cat.label}</span>
                      </td>
                      <td style={{ padding:'12px 14px', fontSize:14, fontWeight:700, color:'#DC2626' }}>{fmt(d.montant)}</td>
                      <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B' }}>{d.date}</td>
                      <td style={{ padding:'12px 14px' }}>
                        {d.recurrent ? <span style={{ fontSize:11, fontWeight:600, color:'#7C3AED', background:'#F5F3FF', padding:'2px 8px', borderRadius:100 }}>Récurrent</span> : <span style={{ fontSize:11, color:'#94A3B8' }}>Ponctuel</span>}
                      </td>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={()=>openEdit(d)} style={{ background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Modifier</button>
                          <button onClick={()=>del(d.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Suppr.</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background:'#F8FAFC', borderTop:'2px solid #E2E8F0' }}>
                  <td colSpan={2} style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#0F172A' }}>Total</td>
                  <td style={{ padding:'12px 14px', fontSize:14, fontWeight:800, color:'#DC2626' }}>{fmt(filtered.reduce((a,d)=>a+d.montant,0))}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* REVENUS */}
      {tab === 'revenus' && (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Source','Montant','Date','Note'].map(h=>(
                  <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'#64748B', textAlign:'left', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenus.map(r => (
                <tr key={r.id} style={{ borderBottom:'1px solid #F1F5F9' }}>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:500, color:'#0F172A' }}>{r.label}</td>
                  <td style={{ padding:'12px 14px', fontSize:14, fontWeight:700, color:'#16A34A' }}>{fmt(r.montant)}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B' }}>{r.date}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#94A3B8' }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:'#F0FDF4', borderTop:'2px solid #BBF7D0' }}>
                <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#0F172A' }}>Total revenus</td>
                <td style={{ padding:'12px 14px', fontSize:14, fontWeight:800, color:'#16A34A' }}>{fmt(totalRevenus)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:520 }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{editing?'Modifier la dépense':'Nouvelle dépense'}</h3>
              <button onClick={()=>setModal(false)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>
            <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Libellé</label><input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} style={inp} placeholder="Salaires enseignants" /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={lbl}>Catégorie</label>
                  <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})} style={inp}>
                    {CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Montant (MAD)</label><input type="number" value={form.montant} onChange={e=>setForm({...form,montant:e.target.value})} style={inp} placeholder="0" /></div>
                <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:22 }}>
                  <input type="checkbox" id="rec" checked={form.recurrent} onChange={e=>setForm({...form,recurrent:e.target.checked})} style={{ width:16, height:16, cursor:'pointer' }} />
                  <label htmlFor="rec" style={{ fontSize:13, color:'#374151', cursor:'pointer', fontWeight:500 }}>Dépense récurrente</label>
                </div>
              </div>
              <div><label style={lbl}>Note (optionnel)</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={inp} placeholder="Détails supplémentaires..." /></div>
            </div>
            <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={save} disabled={!form.label||!form.montant} style={{ padding:'10px 22px', background:!form.label?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {editing?'Enregistrer':'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
