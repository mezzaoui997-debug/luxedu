import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const ROLE_COLORS = { DIRECTOR:'#1B2C5E', TEACHER:'#2563EB', FONCTIONNAIRE:'#0D9488' };
const ROLE_LABELS = { DIRECTOR:'Directeur', TEACHER:'Enseignant', FONCTIONNAIRE:'Fonctionnaire' };

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return 'À l\'instant';
  if (diff < 3600)  return `${Math.floor(diff/60)} min`;
  if (diff < 86400) return `${Math.floor(diff/3600)} h`;
  return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}

function Avatar({ name, role, size=36 }) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:ROLE_COLORS[role]||'#1B2C5E', color:'#fff', fontSize:size*0.35, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'Georgia,serif' }}>
      {initials}
    </div>
  );
}

export default function Messages() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unread, setUnread]     = useState(0);
  const [compose, setCompose]   = useState(false);
  const [reply, setReply]       = useState('');
  const [sending, setSending]   = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [newMsg, setNewMsg]     = useState({ subject:'', body:'', to:'all' });
  const bottomRef = useRef(null);

  const load = async () => {
    try {
      const r = await api.get('/messages');
      setMessages(r.data.messages);
      setUnread(r.data.unread);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selected && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior:'smooth' });
    }
  }, [selected]);

  const openMessage = async (msg) => {
    try {
      const r = await api.get(`/messages/${msg.id}`);
      setSelected(r.data);
      setMessages(prev => prev.map(m => m.id===msg.id ? {...m, read:true} : m));
      setUnread(prev => msg.read ? prev : Math.max(0, prev-1));
    } catch {
      setSelected(msg);
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const r = await api.post(`/messages/${selected.id}/reply`, { body: reply });
      setSelected(prev => ({ ...prev, replies: [...(prev.replies||[]), r.data] }));
      setReply('');
    } catch {}
    setSending(false);
  };

  const sendNew = async () => {
    if (!newMsg.subject.trim() || !newMsg.body.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', newMsg);
      setCompose(false);
      setNewMsg({ subject:'', body:'', to:'all' });
      load();
    } catch {}
    setSending(false);
  };

  const del = async (id) => {
    try { await api.delete(`/messages/${id}`); } catch {}
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const displayed = messages.filter(m => {
    const matchFilter = filter==='all' || (filter==='unread' && !m.read) || (filter==='sent' && m.fromRole===user?.role);
    const matchSearch = !search || m.subject.toLowerCase().includes(search.toLowerCase()) || m.from.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const inputStyle = { width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit', background:'#F8FAFC', boxSizing:'border-box', transition:'border-color .15s' };

  return (
    <div style={{ height:'calc(100vh - 118px)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexShrink:0 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:3 }}>
            Messagerie interne
            {unread > 0 && <span style={{ marginLeft:8, background:'#EF4444', color:'#fff', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:100 }}>{unread}</span>}
          </h2>
          <p style={{ fontSize:13, color:'#64748B' }}>Communication interne — direction, enseignants, administration</p>
        </div>
        <button onClick={() => setCompose(true)} style={{ padding:'10px 22px', background:'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          + Nouveau message
        </button>
      </div>

      {/* Main layout */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'320px 1fr', gap:12, overflow:'hidden', minHeight:0 }}>

        {/* LEFT: message list */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* search + filter */}
          <div style={{ padding:12, borderBottom:'1px solid #F1F5F9', flexShrink:0 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...inputStyle, marginBottom:8 }} onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
            <div style={{ display:'flex', gap:4 }}>
              {[['all','Tous'],['unread','Non lus'],['sent','Envoyés']].map(([k,l]) => (
                <button key={k} onClick={()=>setFilter(k)} style={{ flex:1, padding:'5px', border:'none', borderRadius:6, fontSize:11, fontWeight:filter===k?700:500, cursor:'pointer', fontFamily:'inherit', background:filter===k?'#1B2C5E':'#F1F5F9', color:filter===k?'#fff':'#64748B', transition:'all .15s' }}>{l}</button>
              ))}
            </div>
          </div>

          {/* list */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {displayed.length === 0 ? (
              <div style={{ padding:32, textAlign:'center', color:'#94A3B8', fontSize:13 }}>Aucun message</div>
            ) : displayed.map(msg => (
              <div key={msg.id} onClick={() => openMessage(msg)}
                style={{ padding:'12px 14px', borderBottom:'1px solid #F8FAFC', cursor:'pointer', background: selected?.id===msg.id ? '#EFF6FF' : !msg.read ? '#FAFBFF' : '#fff', borderLeft: selected?.id===msg.id ? '3px solid #2563EB' : '3px solid transparent', transition:'all .15s' }}
                onMouseEnter={e=>{ if(selected?.id!==msg.id) e.currentTarget.style.background='#F8FAFC'; }}
                onMouseLeave={e=>{ if(selected?.id!==msg.id) e.currentTarget.style.background=!msg.read?'#FAFBFF':'#fff'; }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <Avatar name={msg.from} role={msg.fromRole} size={34} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.from}</span>
                      <span style={{ fontSize:10, color:'#94A3B8', flexShrink:0, marginLeft:6 }}>{timeAgo(msg.createdAt)}</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:!msg.read?700:500, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{msg.subject}</div>
                    <div style={{ fontSize:11, color:'#94A3B8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.body?.slice(0,60)}...</div>
                    <div style={{ display:'flex', gap:6, marginTop:5, alignItems:'center' }}>
                      <span style={{ fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:100, background: ROLE_COLORS[msg.fromRole]+'20', color:ROLE_COLORS[msg.fromRole] }}>{ROLE_LABELS[msg.fromRole]}</span>
                      {msg.replies?.length > 0 && <span style={{ fontSize:10, color:'#94A3B8' }}>{msg.replies.length} réponse{msg.replies.length>1?'s':''}</span>}
                      {!msg.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#2563EB', marginLeft:'auto' }} />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: message detail */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {!selected ? (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div style={{ fontSize:14, color:'#94A3B8' }}>Sélectionnez un message</div>
            </div>
          ) : (
            <>
              {/* message header */}
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #F1F5F9', flexShrink:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:8 }}>{selected.subject}</h3>
                  <button onClick={()=>del(selected.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Supprimer</button>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar name={selected.from} role={selected.fromRole} size={36} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{selected.from}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{ROLE_LABELS[selected.fromRole]} · {new Date(selected.createdAt).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}</div>
                  </div>
                </div>
              </div>

              {/* thread */}
              <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
                {/* original message */}
                <div style={{ background:'#F8FAFC', borderRadius:10, padding:'14px 16px', marginBottom:16, border:'1px solid #E2E8F0' }}>
                  <p style={{ fontSize:14, color:'#374151', lineHeight:1.75, whiteSpace:'pre-wrap', margin:0 }}>{selected.body}</p>
                </div>

                {/* replies */}
                {selected.replies?.map(r => (
                  <div key={r.id} style={{ display:'flex', gap:10, marginBottom:14, justifyContent: r.fromRole===user?.role ? 'flex-end' : 'flex-start' }}>
                    {r.fromRole !== user?.role && <Avatar name={r.from} role={r.fromRole} size={32} />}
                    <div style={{ maxWidth:'75%', background: r.fromRole===user?.role ? '#EFF6FF' : '#F8FAFC', border:`1px solid ${r.fromRole===user?.role ? '#BFDBFE' : '#E2E8F0'}`, borderRadius:10, padding:'10px 14px' }}>
                      <div style={{ fontSize:11, fontWeight:600, color:ROLE_COLORS[r.fromRole]||'#374151', marginBottom:4 }}>{r.from}</div>
                      <div style={{ fontSize:13, color:'#374151', lineHeight:1.65, whiteSpace:'pre-wrap' }}>{r.body}</div>
                      <div style={{ fontSize:10, color:'#94A3B8', marginTop:5, textAlign:'right' }}>{timeAgo(r.createdAt)}</div>
                    </div>
                    {r.fromRole === user?.role && <Avatar name={r.from} role={r.fromRole} size={32} />}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* reply box */}
              <div style={{ padding:'12px 16px', borderTop:'1px solid #F1F5F9', flexShrink:0 }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
                  <textarea value={reply} onChange={e=>setReply(e.target.value)}
                    placeholder="Écrire une réponse..."
                    rows={2}
                    style={{ flex:1, padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit', resize:'none', background:'#F8FAFC', transition:'border-color .15s' }}
                    onFocus={e=>e.target.style.borderColor='#1B2C5E'}
                    onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                    onKeyDown={e=>{ if(e.key==='Enter' && (e.metaKey||e.ctrlKey)) sendReply(); }}
                  />
                  <button onClick={sendReply} disabled={!reply.trim()||sending}
                    style={{ padding:'10px 20px', background:!reply.trim()?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:!reply.trim()?'default':'pointer', fontFamily:'inherit', transition:'all .2s', flexShrink:0 }}>
                    {sending ? '...' : 'Répondre'}
                  </button>
                </div>
                <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>Ctrl+Enter pour envoyer</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* COMPOSE MODAL */}
      {compose && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', borderRadius:16, width:560, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,.2)' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>Nouveau message</h3>
              <button onClick={()=>setCompose(false)} style={{ background:'transparent', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8', lineHeight:1 }}>×</button>
            </div>
            <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Destinataire</label>
                <select value={newMsg.to} onChange={e=>setNewMsg({...newMsg,to:e.target.value})}
                  style={{ ...inputStyle, cursor:'pointer' }} onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}>
                  <option value="all">Toute l'équipe</option>
                  <option value="DIRECTOR">Directeur</option>
                  <option value="TEACHER">Enseignants</option>
                  <option value="FONCTIONNAIRE">Fonctionnaires</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Objet</label>
                <input value={newMsg.subject} onChange={e=>setNewMsg({...newMsg,subject:e.target.value})}
                  placeholder="Objet du message"
                  style={inputStyle} onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Message</label>
                <textarea value={newMsg.body} onChange={e=>setNewMsg({...newMsg,body:e.target.value})}
                  placeholder="Rédigez votre message..."
                  rows={5}
                  style={{ ...inputStyle, resize:'vertical' }} onFocus={e=>e.target.style.borderColor='#1B2C5E'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              </div>
            </div>
            <div style={{ padding:'14px 22px', borderTop:'1px solid #F1F5F9', display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setCompose(false)} style={{ padding:'10px 22px', background:'transparent', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={sendNew} disabled={sending||!newMsg.subject.trim()||!newMsg.body.trim()}
                style={{ padding:'10px 22px', background:!newMsg.subject.trim()?'#94A3B8':'#1B2C5E', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
