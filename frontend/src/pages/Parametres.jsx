import { useState } from 'react';
import useAuthStore from '../store/authStore';
export default function Parametres() {
  const { school } = useAuthStore();
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name:school?.name||'Ecole Excellence Casablanca', address:'45 Rue Hassan II, Maarif, Casablanca', phone:'+212 5 22 12 34 56', email:'contact@excellence-casa.ma', frais:'2800', cantine:'180', transport:'250' });
  const showT = (m) => { setToast(m); setTimeout(()=>setToast(''),3000); };
  return (
    <div className="page-enter">
      {toast && <div style={{ position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#3B6D11',color:'white',padding:'11px 20px',borderRadius:10,fontSize:13,fontWeight:600,zIndex:999 }}>✓ {toast}</div>}
      <div className="ph"><h1>Parametres</h1><p>Configuration de votre etablissement</p></div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        <div>
          <div className="card cp" style={{ marginBottom:14 }}>
            <div className="ch"><div className="ct">Informations etablissement</div></div>
            <div className="fg"><label>Nom de l ecole</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="fg"><label>Adresse</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
            <div className="fgrid2">
              <div className="fg"><label>Telephone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div className="fg"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <button className="btn btn-navy" onClick={()=>showT('Informations sauvegardees')}>Sauvegarder</button>
          </div>
          <div className="card cp">
            <div className="ch"><div className="ct">Frais de scolarite (MAD)</div></div>
            <div className="fgrid2">
              <div className="fg"><label>Frais mensuels</label><input type="number" value={form.frais} onChange={e=>setForm({...form,frais:e.target.value})} /></div>
              <div className="fg"><label>Cantine</label><input type="number" value={form.cantine} onChange={e=>setForm({...form,cantine:e.target.value})} /></div>
              <div className="fg"><label>Transport</label><input type="number" value={form.transport} onChange={e=>setForm({...form,transport:e.target.value})} /></div>
            </div>
            <button className="btn btn-navy" onClick={()=>showT('Frais sauvegardes')}>Mettre a jour</button>
          </div>
        </div>
        <div>
          <div className="card cp" style={{ marginBottom:14 }}>
            <div className="ch"><div className="ct">WhatsApp Business API</div></div>
            <div style={{ background:'var(--g0)',borderRadius:8,padding:14,marginBottom:14,fontSize:12,color:'var(--g2)' }}>Pour connecter le vrai WhatsApp Business API, vous avez besoin d'un compte Meta Business.</div>
            <div className="fg"><label>WA_TOKEN</label><input type="password" placeholder="Token WhatsApp Business" /></div>
            <div className="fg"><label>WA_PHONE_ID</label><input placeholder="ID de votre numero" /></div>
            <button className="btn btn-wa" onClick={()=>showT('WhatsApp configure')}>Connecter WhatsApp</button>
          </div>
          <div className="card cp" style={{ marginBottom:14 }}>
            <div className="ch"><div className="ct">Annee scolaire</div></div>
            <div className="fgrid2">
              <div className="fg"><label>Debut</label><input type="date" defaultValue="2025-09-08" /></div>
              <div className="fg"><label>Fin</label><input type="date" defaultValue="2026-06-30" /></div>
            </div>
            <button className="btn btn-navy" onClick={()=>showT('Calendrier sauvegarde')}>Sauvegarder</button>
          </div>
          <div className="card cp">
            <div className="ch"><div className="ct">Securite</div></div>
            <div className="fg"><label>Nouveau mot de passe</label><input type="password" placeholder="Minimum 8 caracteres" /></div>
            <div className="fg"><label>Confirmer</label><input type="password" placeholder="Confirmer" /></div>
            <button className="btn btn-navy" onClick={()=>showT('Mot de passe modifie')}>Modifier</button>
          </div>
        </div>
      </div>
    </div>
  );
}
