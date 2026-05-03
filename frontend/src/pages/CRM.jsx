import { useState } from 'react';

const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };
const STATUTS = ['NOUVEAU','CONTACTE','VISITE','INSCRIT','PERDU'];
const STATUT_COLORS = { NOUVEAU:'#3b82f6', CONTACTE:'#f59e0b', VISITE:'#8b5cf6', INSCRIT:'#22c55e', PERDU:'#ef4444' };
const STATUT_BG = { NOUVEAU:'#eff6ff', CONTACTE:'#fffbeb', VISITE:'#f5f3ff', INSCRIT:'#f0fdf4', PERDU:'#fef2f2' };

const DEMO = [
  { id:'1', nom:'Famille Alaoui', enfant:'Karim Alaoui', niveau:'6eme', phone:'+212661234567', source:'Bouche a oreille', statut:'NOUVEAU', note:'Interesse pour septembre 2026', date:'2026-05-01' },
  { id:'2', nom:'Famille Benkirane', enfant:'Sara Benkirane', niveau:'5eme', phone:'+212662345678', source:'Instagram', statut:'CONTACTE', note:'Appel effectue, visite prevue', date:'2026-04-28' },
  { id:'3', nom:'Famille Tahiri', enfant:'Omar Tahiri', niveau:'4eme', phone:'+212663456789', source:'Facebook', statut:'VISITE', note:'Visite ecole faite, attente decision', date:'2026-04-25' },
  { id:'4', nom:'Famille Mansouri', enfant:'Leila Mansouri', niveau:'3eme', phone:'+212664567890', source:'Recommandation', statut:'INSCRIT', note:'Inscription validee', date:'2026-04-20' },
  { id:'5', nom:'Famille Chraibi', enfant:'Youssef Chraibi', niveau:'6eme', phone:'+212665678901', source:'Google', statut:'PERDU', note:'Choix d une autre ecole', date:'2026-04-15' },
];

export default function CRM({ showT }) {
  const [prospects, setProspects] = useState(DEMO);
  const [filter, setFilter] = useState('TOUS');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom:'', enfant:'', niveau:'6eme', phone:'', source:'Bouche a oreille', note:'' });
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'TOUS' ? prospects : prospects.filter(p => p.statut === filter);

  const addProspect = () => {
    if (!form.nom || !form.phone) return;
    const p = { id: Date.now().toString(), statut:'NOUVEAU', date: new Date().toISOString().split('T')[0], ...form };
    setProspects([p, ...prospects]);
    setForm({ nom:'', enfant:'', niveau:'6eme', phone:'', source:'Bouche a oreille', note:'' });
    setShowForm(false);
    showT && showT('Prospect ajoute');
  };

  const changeStatut = (id, statut) => {
    setProspects(prospects.map(p => p.id === id ? { ...p, statut } : p));
    setSelected(null);
  };

  return (
    <div>
      <div style={{ marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>CRM — Prospects</h2>
          <p style={{ fontSize:12, color:'#6b7280' }}>Suivi des familles interessees par l ecole</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding:'9px 20px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
          + Nouveau prospect
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:18 }}>
        {STATUTS.map(s => {
          const count = prospects.filter(p => p.statut === s).length;
          return (
            <div key={s} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:10, padding:'12px 14px', cursor:'pointer', borderTop:`3px solid ${STATUT_COLORS[s]}` }}
              onClick={() => setFilter(filter === s ? 'TOUS' : s)}>
              <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'#6b7280', marginBottom:6 }}>{s}</div>
              <div style={{ fontSize:24, fontWeight:700, color:STATUT_COLORS[s] }}>{count}</div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={{ ...C, marginBottom:14, border:'1px solid #bfdbfe', background:'#eff6ff' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Nouveau prospect</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Nom famille</label>
              <input value={form.nom} onChange={e => setForm({...form, nom:e.target.value})} placeholder="Famille Alaoui"
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Nom enfant</label>
              <input value={form.enfant} onChange={e => setForm({...form, enfant:e.target.value})} placeholder="Karim Alaoui"
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Telephone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="+212661234567"
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Niveau vise</label>
              <select value={form.niveau} onChange={e => setForm({...form, niveau:e.target.value})}
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }}>
                {['6eme','5eme','4eme','3eme','2nde','1ere','Terminale'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Source</label>
              <select value={form.source} onChange={e => setForm({...form, source:e.target.value})}
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }}>
                {['Bouche a oreille','Instagram','Facebook','Google','Recommandation','Autre'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Note</label>
              <input value={form.note} onChange={e => setForm({...form, note:e.target.value})} placeholder="Details..."
                style={{ width:'100%', padding:'8px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={addProspect} style={{ padding:'8px 20px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer' }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ padding:'8px 16px', background:'white', color:'#374151', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, cursor:'pointer' }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
        <button onClick={() => setFilter('TOUS')} style={{ padding:'5px 12px', border:'1px solid '+(filter==='TOUS'?'#1e2d4f':'#e5e9f2'), borderRadius:20, fontSize:12, background:filter==='TOUS'?'#1e2d4f':'white', color:filter==='TOUS'?'white':'#374151', cursor:'pointer' }}>Tous ({prospects.length})</button>
        {STATUTS.map(s => (
          <button key={s} onClick={() => setFilter(filter===s?'TOUS':s)}
            style={{ padding:'5px 12px', border:'1px solid '+(filter===s?STATUT_COLORS[s]:'#e5e9f2'), borderRadius:20, fontSize:12, background:filter===s?STATUT_BG[s]:'white', color:filter===s?STATUT_COLORS[s]:'#374151', cursor:'pointer' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={C}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{['Famille','Enfant','Niveau','Telephone','Source','Statut','Actions'].map(h => (
              <th key={h} style={{ textAlign:'left', fontSize:10, fontWeight:600, color:'#6b7280', padding:'8px 12px', borderBottom:'1px solid #e5e9f2', textTransform:'uppercase', letterSpacing:'.05em' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontWeight:600, fontSize:13 }}>{p.nom}</td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13 }}>{p.enfant}</td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}><span style={{ fontSize:11, background:'#f1f5f9', padding:'2px 8px', borderRadius:20 }}>{p.niveau}</span></td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, fontFamily:'monospace' }}>{p.phone}</td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{p.source}</td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                  <span style={{ fontSize:11, fontWeight:600, background:STATUT_BG[p.statut], color:STATUT_COLORS[p.statut], padding:'3px 10px', borderRadius:20 }}>{p.statut}</span>
                </td>
                <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                  <div style={{ display:'flex', gap:5 }}>
                    <select value={p.statut} onChange={e => changeStatut(p.id, e.target.value)}
                      style={{ padding:'4px 8px', border:'1px solid #e5e9f2', borderRadius:6, fontSize:11, cursor:'pointer', outline:'none' }}>
                      {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <a href={'tel:'+p.phone} style={{ padding:'4px 10px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:6, fontSize:11, textDecoration:'none', fontWeight:600 }}>📞</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign:'center', padding:30, color:'#6b7280' }}>Aucun prospect dans cette categorie</div>}
      </div>
    </div>
  );
}
