import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
const TEMPLATES = [
  { id:'absence', ic:'📵', name:'Absence', desc:'Non justifiee', msg:"Bonjour {parent},\n\nVotre enfant {eleve} etait absent(e) aujourd'hui.\n\nMerci de nous contacter.\n\n{ecole}" },
  { id:'note', ic:'📊', name:'Note faible', desc:'Alerte < 10', msg:"Bonjour {parent},\n\n{eleve} a obtenu une note insuffisante en {matiere}.\n\nNous recommandons un soutien scolaire.\n\n{ecole}" },
  { id:'paiement', ic:'💰', name:'Paiement', desc:'Rappel retard', msg:"Bonjour {parent},\n\nLes frais de scolarite de {eleve} ({montant} MAD) sont en attente.\n\nMerci de regulariser.\n\n{ecole}" },
  { id:'bulletin', ic:'📋', name:'Bulletin', desc:'Disponible', msg:"Bonjour {parent},\n\nLe bulletin de {eleve} est disponible sur LuxEdu.\n\n{ecole}" },
  { id:'event', ic:'📅', name:'Evenement', desc:'Ecole', msg:"Bonjour {parent},\n\nNous vous informons d'un evenement a l'ecole le {date}.\n\n{ecole}" },
  { id:'custom', ic:'✏️', name:'Personnalise', desc:'Texte libre', msg:'' },
];
export default function WhatsApp() {
  const { school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [selectedTpl, setSelectedTpl] = useState('absence');
  const [dest, setDest] = useState('individual');
  const [msg, setMsg] = useState(TEMPLATES[0].msg);
  const [toast, setToast] = useState('');
  useEffect(() => { api.get('/students').then(r => setStudents(r.data)).catch(()=>{}); }, []);
  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const preview = msg.replace('{parent}','M. Parent').replace('{eleve}', students[0]?.firstName||'Youssef').replace('{date}', new Date().toLocaleDateString('fr-FR')).replace('{ecole}', school?.name||'Ecole Excellence').replace('{matiere}','Mathematiques').replace('{montant}','2 800');
  const sendWA = () => {
    const s = students[0];
    if (!s?.parentPhone) { showT('Aucun telephone parent'); return; }
    window.open('https://wa.me/'+s.parentPhone.replace(/[^0-9]/g,'')+'?text='+encodeURIComponent(preview),'_blank');
    showT('Message WhatsApp ouvert');
  };
  return (
    <div className="page-enter">
      {toast && <div style={{ position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#3B6D11',color:'white',padding:'11px 20px',borderRadius:10,fontSize:13,fontWeight:600,zIndex:999 }}>✓ {toast}</div>}
      <div className="ph"><h1>Compositeur WhatsApp</h1><p>Creez et envoyez des messages professionnels aux parents</p></div>
      <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:16 }}>
        <div>
          <div className="card cp" style={{ marginBottom:14 }}>
            <div className="ch"><div className="ct">Modele de message</div></div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => { setSelectedTpl(t.id); if(t.msg) setMsg(t.msg); }}
                  style={{ border:'1.5px solid '+(selectedTpl===t.id?'#25D366':'var(--g1)'),borderRadius:10,padding:14,cursor:'pointer',textAlign:'center',background:selectedTpl===t.id?'#E8F8EE':'white' }}>
                  <div style={{ fontSize:24,marginBottom:7 }}>{t.ic}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:selectedTpl===t.id?'#1a5e2a':'var(--g3)' }}>{t.name}</div>
                  <div style={{ fontSize:10,color:'var(--g2)',marginTop:3 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card cp" style={{ marginBottom:14 }}>
            <div className="ch"><div className="ct">Destinataires</div></div>
            {[{id:'individual',title:'Parent individuel',sub:students[0]?students[0].firstName+' '+students[0].lastName:'Selectionner'},{id:'class',title:'Toute une classe',sub:students.length+' parents'},{id:'all',title:"Toute l'ecole",sub:students.length+' parents'}].map(d => (
              <label key={d.id} onClick={()=>setDest(d.id)} style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:'1.5px solid '+(dest===d.id?'var(--navy)':'var(--g1)'),borderRadius:8,cursor:'pointer',marginBottom:8,background:dest===d.id?'var(--bl)':'white' }}>
                <input type="radio" name="dest" checked={dest===d.id} onChange={()=>{}} style={{ accentColor:'var(--navy)' }} />
                <div><div style={{ fontSize:13,fontWeight:700 }}>{d.title}</div><div style={{ fontSize:11,color:'var(--g2)' }}>{d.sub}</div></div>
              </label>
            ))}
          </div>
          <div className="card cp">
            <div className="ch"><div className="ct">Message</div></div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid var(--g1)',borderRadius:8,fontSize:13,outline:'none',resize:'vertical',lineHeight:1.6 }} />
            <div style={{ marginTop:8 }}>
              <div style={{ fontSize:11,color:'var(--g2)',marginBottom:6,fontWeight:700 }}>Variables:</div>
              <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                {['{parent}','{eleve}','{date}','{matiere}','{montant}','{ecole}'].map(v => (
                  <button key={v} onClick={()=>setMsg(p=>p+v)} style={{ background:'var(--bl)',color:'var(--blue)',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,border:'none',cursor:'pointer' }}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop:14,background:'var(--navy)',borderRadius:8,padding:'10px 14px',fontSize:13,fontWeight:700,color:'white',display:'flex',justifyContent:'space-between' }}>
              <span>{dest==='individual'?'1 destinataire':students.length+' parents'}</span>
              <span style={{ color:'var(--gold)' }}>{dest==='individual'?'1':students.length} message(s)</span>
            </div>
            <button onClick={sendWA} style={{ width:'100%',marginTop:10,background:'#25D366',color:'white',border:'none',borderRadius:8,padding:11,fontSize:13,fontWeight:700,cursor:'pointer' }}>
              Envoyer maintenant
            </button>
          </div>
        </div>
        <div className="card cp">
          <div className="ch"><div className="ct">Apercu WhatsApp</div><span className="badge b-g" style={{ fontSize:9 }}>Rendu reel</span></div>
          <div style={{ background:'#E5DDD5',borderRadius:12,overflow:'hidden' }}>
            <div style={{ background:'#075E54',padding:'12px 14px',display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'white' }}>EE</div>
              <div><div style={{ color:'white',fontSize:13,fontWeight:700 }}>{school?.name||'Ecole Excellence'}</div><div style={{ color:'rgba(255,255,255,0.65)',fontSize:10 }}>+212 5 22 12 34 56</div></div>
            </div>
            <div style={{ padding:12,minHeight:160 }}>
              <div style={{ background:'white',borderRadius:'8px 8px 8px 2px',padding:'9px 12px',fontSize:12,lineHeight:1.6,maxWidth:'90%',boxShadow:'0 1px 2px rgba(0,0,0,0.1)',whiteSpace:'pre-wrap' }}>{preview}</div>
              <div style={{ fontSize:10,color:'rgba(0,0,0,0.45)',marginTop:4 }}>09:32 ✓✓</div>
            </div>
          </div>
          <div style={{ marginTop:14,background:'var(--g0)',borderRadius:8,padding:12,fontSize:12,color:'var(--g2)' }}>
            <div style={{ fontWeight:700,color:'var(--g3)',marginBottom:6 }}>Envois recents</div>
            <div>✓ Rappels paiements · 12 parents · 09:00</div>
            <div>✓ Absence non justifiee · 3 parents · 08:15</div>
            <div>✓ Note &lt;10 · 5 parents · Hier 16:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
