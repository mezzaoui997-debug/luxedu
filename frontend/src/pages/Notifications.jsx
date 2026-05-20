import { useState, useEffect } from 'react';
import api from '../api/axios';

const TYPE_STYLE = {
  payment: { bg:'#FFFBEB', border:'#FDE68A', color:'#D97706', label:'Paiement' },
  absence: { bg:'#FEF2F2', border:'#FECACA', color:'#DC2626', label:'Absence' },
  system:  { bg:'#F0FDF4', border:'#BBF7D0', color:'#16A34A', label:'Système' },
  info:    { bg:'#EFF6FF', border:'#BFDBFE', color:'#2563EB', label:'Info' },
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400)return `Il y a ${Math.floor(diff/3600)} h`;
  return `Il y a ${Math.floor(diff/86400)} j`;
}

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [unread, setUnread]   = useState(0);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await api.get('/notifications');
      setNotifs(r.data.notifications);
      setUnread(r.data.unread);
    } catch { 
      setNotifs([
        { id:'1', type:'payment', title:'Paiement en retard', message:'Youssef Benjelloun — 2 800 MAD — Avril 2026', read:false, createdAt: new Date(Date.now()-3600000).toISOString() },
        { id:'2', type:'absence', title:'Absence signalée', message:'Omar Moussa absent aujourd\'hui — 5ème A', read:false, createdAt: new Date(Date.now()-7200000).toISOString() },
        { id:'3', type:'system',  title:'Sauvegarde effectuée', message:'Données sauvegardées automatiquement', read:true, createdAt: new Date(Date.now()-86400000).toISOString() },
        { id:'4', type:'payment', title:'Paiement reçu', message:'Kenza Alami — 2 800 MAD reçus', read:true, createdAt: new Date(Date.now()-172800000).toISOString() },
      ]);
      setUnread(2);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); } catch {}
    setNotifs(prev => prev.map(n => n.id===id ? {...n, read:true} : n));
    setUnread(prev => Math.max(0, prev-1));
  };

  const markAllRead = async () => {
    try { await api.put('/notifications/read-all'); } catch {}
    setNotifs(prev => prev.map(n => ({...n, read:true})));
    setUnread(0);
  };

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n=>!n.read) : notifs.filter(n=>n.type===filter);
  const C = { card:{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, padding:24, marginBottom:16 } };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:4 }}>
            Notifications
            {unread > 0 && <span style={{ marginLeft:10, background:'#EF4444', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 8px', borderRadius:100 }}>{unread}</span>}
          </h2>
          <p style={{ fontSize:13, color:'#64748B' }}>{notifs.length} notifications · {unread} non lues</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ padding:'9px 20px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, color:'#1B2C5E', cursor:'pointer', fontFamily:'inherit' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, background:'#F1F5F9', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
        {[['all','Toutes'],['unread','Non lues'],['payment','Paiements'],['absence','Absences'],['system','Système']].map(([k,l]) => (
          <button key={k} onClick={()=>setFilter(k)} style={{ padding:'7px 16px', border:'none', borderRadius:8, fontSize:13, fontWeight:filter===k?700:500, cursor:'pointer', fontFamily:'inherit', background:filter===k?'#fff':'transparent', color:filter===k?'#1B2C5E':'#64748B', boxShadow:filter===k?'0 1px 4px rgba(0,0,0,.08)':'none', transition:'all .15s' }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:48, color:'#94A3B8' }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...C.card, textAlign:'center', padding:48 }}>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Aucune notification</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(n => {
            const ts = TYPE_STYLE[n.type] || TYPE_STYLE.info;
            return (
              <div key={n.id} onClick={() => !n.read && markRead(n.id)}
                style={{ background: n.read ? '#fff' : '#FAFBFF', border:`1px solid ${n.read ? '#E2E8F0' : '#BFDBFE'}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:14, cursor: n.read ? 'default' : 'pointer', transition:'all .15s' }}>
                {/* dot */}
                <div style={{ width:8, height:8, borderRadius:'50%', background: n.read ? '#E2E8F0' : '#2563EB', flexShrink:0, marginTop:5 }} />
                {/* type badge */}
                <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:100, background:ts.bg, color:ts.color, border:`1px solid ${ts.border}`, flexShrink:0, marginTop:1 }}>{ts.label}</span>
                {/* content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight: n.read ? 500 : 700, color:'#0F172A', marginBottom:3 }}>{n.title}</div>
                  <div style={{ fontSize:13, color:'#64748B' }}>{n.message}</div>
                </div>
                {/* time */}
                <div style={{ fontSize:12, color:'#94A3B8', flexShrink:0, marginTop:1 }}>{timeAgo(n.createdAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
