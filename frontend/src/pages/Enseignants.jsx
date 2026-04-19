import { useEffect, useState } from 'react';
import api from '../api/axios';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

const ROLES = [
  { value:'TEACHER', label:'Enseignant', color:'var(--blue)', bg:'var(--bl)', desc:'Saisie notes et presences' },
  { value:'FONCTIONNAIRE', label:'Fonctionnaire', color:'var(--purple)', bg:'var(--purpl)', desc:'Inscriptions, paiements, certificats' },
];

export default function Enseignants() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'TEACHER', subject:'Mathematiques' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/auth/teachers').then(r => setStaff(r.data)).catch(err => { console.error(err); });
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) { alert('Remplissez tous les champs'); return; }
    setLoading(true);
    try {
      await api.post('/auth/staff', form);
      setShowForm(false);
      setForm({ firstName:'', lastName:'', email:'', password:'', role:'TEACHER', subject:'Mathematiques' });
      load();
      alert('Compte cree ! Identifiants: ' + form.email + ' / ' + form.password);
    } catch(err) { alert('Erreur: ' + (err.response?.data?.error || err.message)); }
    finally { setLoading(false); }
  };

  const getRoleInfo = (role) => ROLES.find(r => r.value === role) || ROLES[0];

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)' }}>Equipe & Acces</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>{staff.length} membres · 3 types d'acces</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
        {[
          { role:'DIRECTOR', label:'Directeur', ic:'👨‍💼', color:'var(--navy)', bg:'var(--bl)', desc:'Acces complet a tout le systeme' },
          { role:'TEACHER', label:'Enseignants', ic:'👨‍🏫', color:'var(--blue)', bg:'var(--bl)', desc:'Notes, presences, eleves' },
          { role:'FONCTIONNAIRE', label:'Fonctionnaires', ic:'📋', color:'var(--purple)', bg:'var(--purpl)', desc:'Inscriptions, paiements, certificats' },
        ].map(r => (
          <div key={r.role} style={{ background:'white', border:'1px solid var(--g1)', borderRadius:10, padding:16 }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{r.ic}</div>
            <div style={{ fontSize:14, fontWeight:700, color:r.color }}>{r.label}</div>
            <div style={{ fontSize:12, color:'var(--g2)', marginTop:4 }}>{r.desc}</div>
            <div style={{ fontSize:12, fontWeight:700, color:r.color, marginTop:8 }}>
              {r.role === 'DIRECTOR' ? '1' : staff.filter(s => s.role === r.role).length} compte(s)
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div style={{ flex:1 }}></div>
        <button className="btn btn-navy" onClick={() => setShowForm(!showForm)}>+ Ajouter membre</button>
      </div>

      {showForm && (
        <div style={{ background:'white', border:'1px solid var(--g1)', borderRadius:10, padding:20, marginBottom:16, boxShadow:'0 4px 20px rgba(4,44,83,0.08)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:14 }}>Nouveau membre</div>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:12 }}>
              {ROLES.map(r => (
                <div key={r.value} onClick={() => setForm({...form, role:r.value})}
                  style={{ border:'2px solid '+(form.role===r.value?r.color:'var(--g1)'), borderRadius:9, padding:12, cursor:'pointer', background:form.role===r.value?r.bg:'white' }}>
                  <div style={{ fontWeight:700, color:r.color, fontSize:13 }}>{r.label}</div>
                  <div style={{ fontSize:11, color:'var(--g2)', marginTop:3 }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <div className="fgrid2">
              <div className="fg"><label>Prenom *</label><input value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} placeholder="ex: Mohammed" /></div>
              <div className="fg"><label>Nom *</label><input value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} placeholder="ex: Alami" /></div>
            </div>
            <div className="fgrid2">
              <div className="fg"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="prof@ecole.ma" /></div>
              <div className="fg"><label>Mot de passe *</label><input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Minimum 6 caracteres" /></div>
            </div>
            {form.role === 'TEACHER' && (
              <div className="fg">
                <label>Matiere principale</label>
                <select value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div style={{ background:'var(--amberl)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'var(--gd)', marginBottom:12 }}>
              Notez bien le mot de passe — vous devrez le communiquer a la personne.
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" className="btn btn-green" disabled={loading}>{loading?'...':'Creer le compte'}</button>
              <button type="button" className="btn btn-out" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="card cp">
        {staff.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'var(--g2)' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>👥</div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Aucun membre</div>
            <div style={{ fontSize:13 }}>Ajoutez des enseignants et fonctionnaires</div>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>Membre</th><th>Role</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {staff.map(t => {
                const roleInfo = getRoleInfo(t.role);
                return (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="av" style={{ width:34, height:34, fontSize:12, background:roleInfo.bg, color:roleInfo.color }}>
                          {t.firstName[0]}{t.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight:700 }}>{t.firstName} {t.lastName}</div>
                          <div style={{ fontSize:11, color:'var(--g2)' }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background:roleInfo.bg, color:roleInfo.color }}>{roleInfo.label}</span></td>
                    <td style={{ color:'var(--g2)', fontSize:12 }}>{t.email}</td>
                    <td>
                      <button className="btn btn-wa btn-sm"
                        onClick={() => window.open('https://wa.me/?text=Bonjour '+t.firstName+', voici vos identifiants LuxEdu: Email: '+t.email)}>
                        Envoyer WA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
