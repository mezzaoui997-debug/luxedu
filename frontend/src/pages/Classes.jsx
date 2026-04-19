import { useEffect, useState } from 'react';
import api from '../api/axios';

const NIVEAUX = ['1er Annee','2eme Annee','3eme Annee','4eme Annee','5eme Annee','6eme Annee','1er College','2eme College','3eme College','Tronc Commun','1ere Bac','2eme Bac'];
const MATIERES_BASE = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique'];

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('eleves');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', level:'6eme Annee' });
  const [matieres, setMatieres] = useState([...MATIERES_BASE]);
  const [newM, setNewM] = useState('');

  const load = async () => {
    const [c, s] = await Promise.all([api.get('/classes'), api.get('/students')]);
    setClasses(c.data);
    setStudents(s.data);
  };

  useEffect(() => { load(); }, []);

  const createClass = async () => {
    if (!form.name) { alert('Entrez le nom de la classe'); return; }
    try {
      await api.post('/classes', form);
      setShowForm(false);
      setForm({ name:'', level:'6eme Annee' });
      load();
    } catch(err) { alert('Erreur: ' + err.message); }
  };

  const assign = async (studentId) => {
    try { await api.put('/students/' + studentId, { classId: selected.id }); load(); }
    catch(err) { alert('Erreur: ' + err.message); }
  };

  const unassign = async (studentId) => {
    try { await api.put('/students/' + studentId, { classId: null }); load(); }
    catch(err) { alert('Erreur: ' + err.message); }
  };

  const handleAddMatiere = () => {
    const val = newM.trim();
    if (!val) return;
    if (matieres.includes(val)) { alert('Matiere deja ajoutee'); return; }
    setMatieres(function(prev) { return [...prev, val]; });
    setNewM('');
  };

  const handleRemoveMatiere = (m) => {
    setMatieres(function(prev) { return prev.filter(function(x) { return x !== m; }); });
  };

  const clsStudents = selected ? students.filter(function(s) { return s.classId === selected.id; }) : [];
  const unassigned = students.filter(function(s) { return !s.classId; });

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)' }}>Classes et Matieres</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>{classes.length} classes · {students.length} eleves</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '280px 1fr' : '1fr', gap:16 }}>

        <div>
          <button className="btn btn-navy" style={{ width:'100%', marginBottom:12 }} onClick={function() { setShowForm(!showForm); }}>
            + Nouvelle classe
          </button>

          {showForm && (
            <div style={{ background:'white', border:'1px solid var(--g1)', borderRadius:10, padding:16, marginBottom:12 }}>
              <div className="fg">
                <label>Nom de la classe</label>
                <input placeholder="ex: 6eme A" value={form.name} onChange={function(e) { setForm({...form, name:e.target.value}); }} />
              </div>
              <div className="fg">
                <label>Niveau</label>
                <select value={form.level} onChange={function(e) { setForm({...form, level:e.target.value}); }}>
                  {NIVEAUX.map(function(n) { return <option key={n}>{n}</option>; })}
                </select>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-green" onClick={createClass}>Creer</button>
                <button className="btn btn-out" onClick={function() { setShowForm(false); }}>Annuler</button>
              </div>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {classes.map(function(c) {
              const n = students.filter(function(s) { return s.classId === c.id; }).length;
              const isActive = selected && selected.id === c.id;
              return (
                <div key={c.id}
                  onClick={function() { setSelected(isActive ? null : c); setTab('eleves'); }}
                  style={{ background:'white', border:'2px solid '+(isActive?'var(--navy)':'var(--g1)'), borderRadius:10, padding:'12px 14px', cursor:'pointer' }}>
                  <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'var(--g2)', marginTop:3 }}>{c.level} · {n} eleves</div>
                </div>
              );
            })}
            {classes.length === 0 && (
              <div style={{ padding:24, textAlign:'center', color:'var(--g2)', background:'white', borderRadius:10, border:'1px solid var(--g1)', fontSize:13 }}>
                Aucune classe
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--navy)' }}>{selected.name}</div>
                <div style={{ fontSize:12, color:'var(--g2)' }}>{selected.level}</div>
              </div>
              <button className="btn btn-out btn-sm" onClick={function() { setSelected(null); }}>Fermer</button>
            </div>

            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {[['eleves','Eleves ('+clsStudents.length+')'],['ajouter','Ajouter eleves'],['matieres','Matieres']].map(function(item) {
                return (
                  <button key={item[0]} onClick={function() { setTab(item[0]); }} className="btn btn-sm"
                    style={{ background:tab===item[0]?'var(--navy)':'white', color:tab===item[0]?'white':'var(--g3)', border:'1px solid '+(tab===item[0]?'var(--navy)':'var(--g1)') }}>
                    {item[1]}
                  </button>
                );
              })}
            </div>

            {tab === 'eleves' && (
              <div>
                {clsStudents.length === 0 && (
                  <div style={{ padding:20, textAlign:'center', color:'var(--g2)', fontSize:13 }}>
                    Aucun eleve dans cette classe
                  </div>
                )}
                {clsStudents.map(function(s) {
                  return (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #F5F5F3' }}>
                      <div className="av" style={{ width:34, height:34, fontSize:11, background:'#E6F1FB', color:'#0C447C' }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar}</div>
                      </div>
                      <button onClick={function() { unassign(s.id); }}
                        style={{ background:'var(--redl)', color:'var(--red)', border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                        Retirer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'ajouter' && (
              <div>
                {unassigned.length === 0 && (
                  <div style={{ padding:20, textAlign:'center', color:'var(--g2)', fontSize:13 }}>
                    Tous les eleves sont dans une classe
                  </div>
                )}
                {unassigned.map(function(s) {
                  return (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #F5F5F3' }}>
                      <div className="av" style={{ width:34, height:34, fontSize:11, background:'var(--amberl)', color:'var(--gd)' }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar}</div>
                      </div>
                      <button onClick={function() { assign(s.id); }} className="btn btn-green btn-sm">
                        Ajouter
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'matieres' && (
              <div>
                <div style={{ fontSize:13, color:'var(--g2)', marginBottom:14 }}>
                  {matieres.length} matieres pour cette classe
                </div>

                <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                  <input
                    type="text"
                    placeholder="Nom de la matiere..."
                    value={newM}
                    onChange={function(e) { setNewM(e.target.value); }}
                    onKeyDown={function(e) { if(e.key === 'Enter') { e.preventDefault(); handleAddMatiere(); } }}
                    style={{ flex:1, padding:'10px 13px', border:'2px solid var(--navy)', borderRadius:8, fontSize:13, outline:'none' }}
                  />
                  <button
                    onClick={handleAddMatiere}
                    style={{ background:'var(--navy)', color:'white', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                    Ajouter
                  </button>
                </div>

                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {matieres.map(function(m) {
                    return (
                      <div key={m} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--bl)', padding:'7px 13px', borderRadius:20 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:'var(--blue)' }}>{m}</span>
                        <button
                          onClick={function() { handleRemoveMatiere(m); }}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', fontSize:16, padding:0, lineHeight:1, fontWeight:700 }}>
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
