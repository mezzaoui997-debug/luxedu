import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Eleves() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', massar:'', parentPhone:'' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/students').then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    (s.firstName+' '+s.lastName+s.massar).toLowerCase().includes(search.toLowerCase())
  );

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/students', form);
      setForm({ firstName:'', lastName:'', massar:'', parentPhone:'' });
      setShowForm(false);
      load();
    } catch(err) {
      alert('Erreur: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding:22 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Gestion des élèves</div>
        <div style={{ fontSize:13, color:'#888780' }}>{students.length} élèves inscrits</div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        <input placeholder="Rechercher par nom ou Code Massar..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
        <button onClick={() => setShowForm(!showForm)}
          style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          + Ajouter élève
        </button>
      </div>

      {showForm && (
        <div style={{ background:'white', border:'1px solid #E8E6E0', borderRadius:10, padding:20, marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:14 }}>Nouvel élève</div>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              {[['Prénom','firstName','ex: Omar'],['Nom','lastName','ex: Moussa'],['Code Massar','massar','ex: G412252321'],['Tél. parent','parentPhone','ex: +212661234567']].map(([lbl,key,ph]) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>{lbl}</label>
                  <input placeholder={ph} value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})}
                    style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" disabled={loading}
                style={{ background:'#3B6D11', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                {loading ? 'Enregistrement...' : '✓ Enregistrer'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ background:'#F5F5F3', color:'#2C2C2A', border:'1px solid #E8E6E0', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#F5F5F3' }}>
              {['Élève','Code Massar','Téléphone parent','Statut','Actions'].map(h => (
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                <td style={{ padding:'11px 12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:11, color:'#888780' }}>Inscrit</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'11px 12px', fontFamily:'monospace', color:'#042C53', fontSize:12 }}>{s.massar}</td>
                <td style={{ padding:'11px 12px', color:'#888780' }}>{s.parentPhone || '—'}</td>
                <td style={{ padding:'11px 12px' }}><span style={{ background:'#EAF3DE', color:'#3B6D11', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>Actif</span></td>
                <td style={{ padding:'11px 12px' }}>
                  <button style={{ background:'#E6F1FB', color:'#0C447C', border:'none', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Profil</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding:24, textAlign:'center', color:'#888780' }}>Aucun élève trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
