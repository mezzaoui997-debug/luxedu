import { useState } from 'react';

const ALL_NOTIFS = [
  { id:1, type:'risk', title:'Eleve a risque — Note insuffisante', desc:'Youssef Benjelloun (4eme A) a une moyenne en baisse depuis 3 mois. Intervention pedagogique recommandee.', time:'Il y a 5 min', unread:true, priority:'high', action:'Voir le dossier' },
  { id:2, type:'absence', title:'3 absences non justifiees aujourd hui', desc:'Youssef Benjelloun, Sara Moukhtari, Karim Alaoui sont absents. Parents non encore notifies.', time:'Il y a 20 min', unread:true, priority:'high', action:'Notifier parents WA' },
  { id:3, type:'payment', title:'Paiement en retard — Famille Benjelloun', desc:'2 800 MAD dus depuis le 1er avril 2026. 12 jours de retard. Aucun rappel envoye aujourd hui.', time:'Il y a 2h', unread:true, priority:'medium', action:'Envoyer rappel WA' },
  { id:4, type:'payment', title:'Paiement recu — Famille El Idrissi', desc:'2 920 MAD recus par virement bancaire. Recu genere et envoye sur WhatsApp.', time:"Aujourd'hui 09:15", unread:false, priority:'low', action:'Voir recu' },
  { id:5, type:'risk', title:"Taux d'absence eleve — 3eme Bac", desc:"La classe 3eme Bac a un taux d'absence de 19% ce mois. C'est le niveau le plus eleve de l'ecole.", time:'Hier 17:00', unread:false, priority:'medium', action:'Voir la classe' },
  { id:6, type:'system', title:'12 rappels WhatsApp envoyes automatiquement', desc:"Rappels paiements envoyes a 12 familles ce matin. Taux d'ouverture: 83%.", time:"Aujourd'hui 08:00", unread:false, priority:'low', action:'Voir details' },
  { id:7, type:'system', title:'47 bulletins S1 telecharges par les parents', desc:'Les parents ont bien recu les bulletins du Semestre 1. Taux de telechargement: 94%.', time:'Hier 08:30', unread:false, priority:'low', action:'Voir rapport' },
];

const CFG = {
  risk:    { bg:'#fef2f2', border:'#fecaca', dot:'#ef4444', label:'Risque' },
  absence: { bg:'#fef2f2', border:'#fecaca', dot:'#ef4444', label:'Absence' },
  payment: { bg:'#fffbeb', border:'#fde68a', dot:'#f59e0b', label:'Paiement' },
  system:  { bg:'#eff6ff', border:'#bfdbfe', dot:'#3b82f6', label:'Systeme' },
};

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [notifs, setNotifs] = useState(ALL_NOTIFS);
  const [toast, setToast] = useState('');

  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  const unread = notifs.filter(n => n.unread).length;

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1e2d4f', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, whiteSpace:'nowrap' }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Notifications</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>{unread} nouvelles alertes · Derniere mise a jour: maintenant</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Non lues', value:unread, color:'#dc2626' },
          { label:'Risque eleves', value:notifs.filter(n=>n.type==='risk').length, color:'#dc2626' },
          { label:'Paiements', value:notifs.filter(n=>n.type==='payment').length, color:'#d97706' },
          { label:'Absences', value:notifs.filter(n=>n.type==='absence').length, color:'#2563eb' },
        ].map((s,i) => (
          <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'16px 20px' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:10 }}>{s.label}</div>
            <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        {[['all','Tout ('+notifs.length+')'],['risk','Risque'],['payment','Paiements'],['absence','Absences'],['system','Systeme']].map(([f,l]) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid '+(filter===f?'#1e2d4f':'#e5e9f2'), background:filter===f?'#1e2d4f':'white', color:filter===f?'white':'#6b7280' }}>
            {l}
          </button>
        ))}
        <button onClick={() => { setNotifs(p => p.map(n => ({...n,unread:false}))); showT('Toutes marquees comme lues'); }}
          style={{ marginLeft:'auto', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid #e5e9f2', background:'white', color:'#6b7280' }}>
          Tout marquer comme lu
        </button>
        <button onClick={() => showT('Actions WhatsApp envoyees pour toutes les alertes urgentes')}
          style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:'none', background:'#22c55e', color:'white' }}>
          Traiter toutes les alertes WA
        </button>
      </div>

      <div style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, overflow:'hidden' }}>
        {filtered.map((n, idx) => {
          const cfg = CFG[n.type] || CFG.system;
          return (
            <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id===n.id?{...x,unread:false}:x))}
              style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 20px', borderBottom: idx < filtered.length-1 ? '1px solid #f3f4f6' : 'none', cursor:'pointer', background:n.unread?'#fafbfd':'white', transition:'background .12s' }}
              onMouseOver={e => e.currentTarget.style.background='#f9fafb'}
              onMouseOut={e => e.currentTarget.style.background=n.unread?'#fafbfd':'white'}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:cfg.dot, marginTop:6, flexShrink:0 }}></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{ fontSize:13, fontWeight:n.unread?700:500, color:'#111827' }}>{n.title}</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:cfg.bg, color:cfg.dot, border:'1px solid '+cfg.border, flexShrink:0 }}>{cfg.label}</span>
                  {n.priority === 'high' && (
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'#fee2e2', color:'#dc2626', flexShrink:0 }}>Urgent</span>
                  )}
                </div>
                <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.6, marginBottom:8 }}>{n.desc}</div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:11, color:'#9ca3af' }}>{n.time}</span>
                  <button onClick={e => { e.stopPropagation(); showT(n.action+' effectue'); }}
                    style={{ fontSize:11, fontWeight:600, color:'#2563eb', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                    {n.action} →
                  </button>
                </div>
              </div>
              {n.unread && (
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#1e2d4f', flexShrink:0, marginTop:6 }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
