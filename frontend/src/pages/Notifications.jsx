import { useState } from 'react';
const NOTIFS = [
  { id:1, type:'risk', title:'Alerte IA — Eleve a risque detecte', desc:'Youssef Benjelloun (4eme A) : moyenne en baisse pendant 3 mois consecutifs. Intervention pedagogique recommandee.', time:'Il y a 5 min', unread:true, ic:'⚠', icBg:'var(--redl)' },
  { id:2, type:'absence', title:'Absence non justifiee · 4eme A', desc:"3 eleves absents aujourd'hui sans justificatif. Parents non encore notifies.", time:'Il y a 20 min', unread:true, ic:'✗', icBg:'var(--redl)' },
  { id:3, type:'payment', title:'Paiement en retard · Famille Benjelloun', desc:"2 800 MAD dus depuis le 1er avril 2026 (12 jours de retard).", time:'Il y a 2h', unread:true, ic:'💰', icBg:'var(--amberl)' },
  { id:4, type:'payment', title:'Paiement recu · Famille El Idrissi', desc:'2 920 MAD recus par virement bancaire. Recu genere et envoye sur WhatsApp.', time:"Aujourd'hui 09:15", unread:false, ic:'✓', icBg:'var(--greenl)' },
  { id:5, type:'risk', title:"Taux d'absence eleve — 3eme Bac", desc:"La classe 3eme Bac a un taux d'absence de 19% ce mois.", time:'Hier 17:00', unread:false, ic:'📊', icBg:'var(--purpl)' },
  { id:6, type:'payment', title:'12 rappels WhatsApp envoyes', desc:"Rappels paiements automatiques envoyes a 12 familles. Taux d'ouverture: 83%.", time:"Aujourd'hui 08:00", unread:false, ic:'💬', icBg:'var(--bl)' },
  { id:7, type:'absence', title:'47 bulletins S1 telecharges', desc:'Les parents ont bien recu les bulletins du Semestre 1. Taux: 94%.', time:'Hier 08:30', unread:false, ic:'📄', icBg:'var(--greenl)' },
];
export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [notifs, setNotifs] = useState(NOTIFS);
  const [toast, setToast] = useState('');
  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  return (
    <div className="page-enter">
      {toast && <div style={{ position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#3B6D11',color:'white',padding:'11px 20px',borderRadius:10,fontSize:13,fontWeight:600,zIndex:999 }}>✓ {toast}</div>}
      <div className="ph"><h1>Centre de notifications</h1><p>7 nouvelles alertes</p></div>
      <div style={{ display:'flex',gap:8,marginBottom:16,flexWrap:'wrap' }}>
        {[{id:'all',lbl:'Tout (7)'},{id:'risk',lbl:'Risque (2)'},{id:'payment',lbl:'Paiements (3)'},{id:'absence',lbl:'Absences (2)'}].map(f => (
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{ padding:'6px 14px',borderRadius:20,fontSize:11,fontWeight:700,cursor:'pointer',border:'1.5px solid '+(filter===f.id?'var(--navy)':'var(--g1)'),background:filter===f.id?'var(--navy)':'white',color:filter===f.id?'white':'var(--g2)' }}>{f.lbl}</button>
        ))}
      </div>
      <div className="card">
        {filtered.map(n => (
          <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))}
            style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'14px 16px',borderBottom:'1px solid #F5F5F3',cursor:'pointer',background:n.unread?'#FAFCFF':'white',borderRadius:8 }}>
            <div style={{ width:38,height:38,borderRadius:10,background:n.icBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{n.ic}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:13,fontWeight:700,color:n.unread?'var(--navy)':'var(--g3)',marginBottom:3 }}>{n.title}</div>
              <div style={{ fontSize:12,color:'var(--g2)',lineHeight:1.5 }}>{n.desc}</div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,flexShrink:0 }}>
              <div style={{ fontSize:11,color:'var(--g2)',whiteSpace:'nowrap' }}>{n.time}</div>
              {n.unread && <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--navy)' }}></div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex',gap:8,marginTop:12 }}>
        <button className="btn btn-navy btn-sm" onClick={()=>{setNotifs(p=>p.map(n=>({...n,unread:false})));showT('Toutes marquees comme lues');}}>Tout marquer comme lu</button>
        <button className="btn btn-wa btn-sm" onClick={()=>showT('Actions WhatsApp envoyees')}>Traiter toutes les alertes WA</button>
      </div>
    </div>
  );
}
