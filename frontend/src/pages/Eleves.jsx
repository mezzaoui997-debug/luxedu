import { useEffect, useState } from 'react';
import api from '../api/axios';

const STEPS = ['Identite', 'Scolarite', 'Medical', 'Services', 'Confirmation'];
const SERVICES = [
  { id:'cantine', ic:'🍽️', lbl:'Cantine', price:180 },
  { id:'transport', ic:'🚌', lbl:'Transport', price:250 },
  { id:'garde', ic:'👧', lbl:'Garde', price:120 },
  { id:'sport', ic:'⚽', lbl:'Sport', price:80 },
];

export default function Eleves() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [services, setServices] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [form, setForm] = useState({ firstName:'', lastName:'', massar:'', dateOfBirth:'', sex:'', city:'Casablanca', parentPhone:'', parentName:'', prevSchool:'', bloodGroup:'', allergies:'', medicalConditions:'' });
  const [massarStatus, setMassarStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_PRICE = 2800;
  const totalPrice = BASE_PRICE + Object.entries(services).filter(([,v])=>v).reduce((sum,[id]) => sum + (SERVICES.find(s=>s.id===id)?.price || 0), 0);

  const load = () => api.get('/students').then(r => setStudents(r.data));
  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    (s.firstName+' '+s.lastName+s.massar).toLowerCase().includes(search.toLowerCase())
  );

  const validateMassar = (val) => {
    const v = val.toUpperCase();
    if (v.length === 0) { setMassarStatus(''); return; }
    setMassarStatus(/^[A-Z][0-9]{9}$/.test(v) ? 'ok' : 'err');
  };

  const openProfile = async (s) => {
    setSelectedStudent(s);
    try {
      const r = await api.get('/grades?semester=1');
      const studentData = r.data.find(d => d.id === s.id);
      setStudentGrades(studentData?.grades || []);
    } catch { setStudentGrades([]); }
  };

  const deleteStudent = async (id, name) => {
    if (!window.confirm('Supprimer ' + name + ' definitvement ?')) return;
    try {
      await api.delete('/students/' + id);
      setSelectedStudent(null);
      load();
    } catch(err) { alert('Erreur: ' + (err.response?.data?.error || err.message)); }
  };

  const openBulletin = async (studentId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://luxedu-production.up.railway.app/api/bulletin/' + studentId + '/1', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch(err) { alert('Erreur bulletin: ' + err.message); }
  };

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.massar) { alert('Remplissez prenom, nom et Code Massar'); return; }
    if (massarStatus !== 'ok') { alert('Code Massar invalide'); return; }
    setLoading(true);
    try {
      await api.post('/students', { firstName:form.firstName, lastName:form.lastName, massar:form.massar.toUpperCase(), dateOfBirth:form.dateOfBirth||null, parentPhone:form.parentPhone||null });
      setShowForm(false); setStep(1);
      setForm({ firstName:'', lastName:'', massar:'', dateOfBirth:'', sex:'', city:'Casablanca', parentPhone:'', parentName:'', prevSchool:'', bloodGroup:'', allergies:'', medicalConditions:'' });
      setServices({}); setMassarStatus('');
      load();
    } catch(err) { alert('Erreur: ' + (err.response?.data?.error || err.message)); }
    finally { setLoading(false); }
  };

  const avgOf = (grades) => {
    if (!grades.length) return null;
    const avgs = grades.filter(g => g.average).map(g => g.average);
    if (!avgs.length) return null;
    return (avgs.reduce((a,b) => a+b, 0) / avgs.length).toFixed(1);
  };

  const generalAvg = avgOf(studentGrades);

  const SUBJECTS_COLOR = { 'Mathematiques':'#E6F1FB', 'Francais':'#EAF3DE', 'Arabe':'#FAEEDA', 'Sciences':'#EEEDFE', 'Anglais':'#E1F5EE' };

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Gestion des eleves</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>{students.length} eleves inscrits · Annee 2025-2026</div>
      </div>

      <div className="toolbar">
        <div className="sbox">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="sinp" placeholder="Rechercher par nom, Code Massar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-navy" onClick={() => { setShowForm(!showForm); setStep(1); }}>+ Ajouter un eleve</button>
      </div>

      {showForm && (
        <div style={{ background:'white', border:'1px solid var(--g1)', borderRadius:10, padding:22, marginBottom:16, boxShadow:'0 4px 20px rgba(4,44,83,0.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--navy)' }}>Inscrire un eleve</div>
              <div style={{ fontSize:12, color:'var(--g2)', marginTop:2 }}>Etape {step} sur 5 — {STEPS[step-1]}</div>
            </div>
            <button className="btn btn-out btn-sm" onClick={() => setShowForm(false)}>Fermer ✕</button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:22, overflowX:'auto', paddingBottom:4 }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div onClick={() => n < step && setStep(n)} style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, cursor: n < step ? 'pointer' : 'default',
                  background: step > n ? 'var(--green)' : step === n ? 'var(--navy)' : 'var(--g1)',
                  color: step >= n ? 'white' : 'var(--g2)' }}>
                  {step > n ? '✓' : n}
                </div>
                <span style={{ fontSize:10, fontWeight:700, whiteSpace:'nowrap', color: step > n ? 'var(--green)' : step === n ? 'var(--navy)' : 'var(--g2)' }}>
                  {STEPS[n-1]}
                </span>
                {n < 5 && <div style={{ width:16, height:2, background: step > n ? 'var(--green)' : 'var(--g1)', flexShrink:0 }}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="fgrid2">
                <div className="fg"><label>Prenom *</label><input placeholder="ex: Omar" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} /></div>
                <div className="fg"><label>Nom *</label><input placeholder="ex: Moussa" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} /></div>
              </div>
              <div className="fgrid2">
                <div className="fg">
                  <label>Code Massar (CNE) *</label>
                  <input placeholder="ex: G412252321" value={form.massar} maxLength={10}
                    onChange={e => { const v=e.target.value.toUpperCase(); setForm({...form,massar:v}); validateMassar(v); }}
                    style={{ fontFamily:'monospace', letterSpacing:'0.07em', borderColor: massarStatus==='ok'?'var(--green)':massarStatus==='err'?'var(--red)':'' }} />
                  <div style={{ fontSize:11, marginTop:4, color: massarStatus==='ok'?'var(--green)':massarStatus==='err'?'var(--red)':'var(--g2)' }}>
                    {massarStatus==='ok'?'✓ Code Massar valide':massarStatus==='err'?'Format incorrect (ex: G412252321)':'Format: 1 lettre + 9 chiffres'}
                  </div>
                </div>
                <div className="fg"><label>Date de naissance</label><input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth:e.target.value})} /></div>
              </div>
              <div className="fgrid2">
                <div className="fg"><label>Sexe</label><select value={form.sex} onChange={e => setForm({...form,sex:e.target.value})}><option value="">-</option><option>Masculin</option><option>Feminin</option></select></div>
                <div className="fg"><label>Ville</label><input value={form.city} onChange={e => setForm({...form,city:e.target.value})} /></div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:14, borderTop:'1px solid var(--g1)', marginTop:4 }}>
                <button className="btn btn-navy" onClick={() => setStep(2)}>Suivant →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="fgrid2">
                <div className="fg"><label>Telephone parent *</label><input placeholder="+212 6 XX XX XX XX" value={form.parentPhone} onChange={e => setForm({...form,parentPhone:e.target.value})} /></div>
                <div className="fg"><label>Nom du parent</label><input placeholder="ex: M. Rachidi Karim" value={form.parentName} onChange={e => setForm({...form,parentName:e.target.value})} /></div>
              </div>
              <div className="fg"><label>Ecole precedente</label><input placeholder="ex: Ecole Al Amal" value={form.prevSchool} onChange={e => setForm({...form,prevSchool:e.target.value})} /></div>
              <div className="fg">
                <label>Documents recus</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:5 }}>
                  {['Acte de naissance','Bulletins precedents','Copie CIN parent','4 photos'].map(doc => (
                    <label key={doc} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer', padding:'5px 10px', border:'1px solid var(--g1)', borderRadius:7 }}>
                      <input type="checkbox" style={{ accentColor:'var(--navy)' }} /> {doc}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid var(--g1)', marginTop:4 }}>
                <button className="btn btn-out" onClick={() => setStep(1)}>← Precedent</button>
                <button className="btn btn-navy" onClick={() => setStep(3)}>Suivant →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="fg">
                <label>Groupe sanguin</label>
                <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:4 }}>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                    <button key={bg} onClick={() => setForm({...form,bloodGroup:bg})} className="btn btn-sm"
                      style={{ background:form.bloodGroup===bg?'var(--redl)':'white', color:form.bloodGroup===bg?'var(--red)':'var(--g3)', border:'1px solid '+(form.bloodGroup===bg?'#F09595':'var(--g1)') }}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
              <div className="fgrid2">
                <div className="fg"><label>Allergies</label><input placeholder="ex: Arachides..." value={form.allergies} onChange={e => setForm({...form,allergies:e.target.value})} /></div>
                <div className="fg"><label>Conditions medicales</label><input placeholder="ex: Asthme..." value={form.medicalConditions} onChange={e => setForm({...form,medicalConditions:e.target.value})} /></div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid var(--g1)', marginTop:4 }}>
                <button className="btn btn-out" onClick={() => setStep(2)}>← Precedent</button>
                <button className="btn btn-navy" onClick={() => setStep(4)}>Suivant →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize:12, color:'var(--g2)', marginBottom:12 }}>Services supplementaires · ajoutes aux frais de base (2 800 MAD)</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:9, marginBottom:16 }}>
                {SERVICES.map(svc => (
                  <div key={svc.id} onClick={() => setServices({...services,[svc.id]:!services[svc.id]})}
                    style={{ border:'1.5px solid '+(services[svc.id]?'var(--green)':'var(--g1)'), borderRadius:9, padding:12, textAlign:'center', cursor:'pointer', background:services[svc.id]?'var(--greenl)':'white', transition:'all .15s' }}>
                    <div style={{ fontSize:22, marginBottom:5 }}>{svc.ic}</div>
                    <div style={{ fontSize:11, fontWeight:700 }}>{svc.lbl}</div>
                    <div style={{ fontSize:10, color:'var(--g2)', marginTop:2 }}>+{svc.price} MAD</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--navy)', borderRadius:9, padding:'14px 16px', color:'white', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>Total mensuel</div>
                <div style={{ fontSize:22, fontWeight:700 }}>{totalPrice.toLocaleString('fr-FR')} MAD</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid var(--g1)', marginTop:14 }}>
                <button className="btn btn-out" onClick={() => setStep(3)}>← Precedent</button>
                <button className="btn btn-navy" onClick={() => setStep(5)}>Recapitulatif →</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div style={{ background:'var(--g0)', borderRadius:10, padding:18, marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Recapitulatif du dossier</div>
                <div className="fgrid2">
                  <div><div style={{ fontSize:10, color:'var(--g2)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>Nom complet</div><div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{form.firstName} {form.lastName}</div></div>
                  <div><div style={{ fontSize:10, color:'var(--g2)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>Code Massar</div><div style={{ fontSize:14, fontWeight:700, color:'var(--navy)', fontFamily:'monospace' }}>{form.massar}</div></div>
                  <div><div style={{ fontSize:10, color:'var(--g2)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>Tel. Parent</div><div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{form.parentPhone || '-'}</div></div>
                  <div><div style={{ fontSize:10, color:'var(--g2)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>Total mensuel</div><div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{totalPrice.toLocaleString('fr-FR')} MAD</div></div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid var(--g1)' }}>
                <button className="btn btn-out" onClick={() => setStep(4)}>← Precedent</button>
                <button className="btn btn-green" onClick={submit} disabled={loading}>{loading?'Enregistrement...':'✓ Enregistrer'}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedStudent && (
        <div style={{ position:'fixed', inset:0, background:'rgba(4,44,83,0.48)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget) setSelectedStudent(null); }}>
          <div style={{ background:'white', borderRadius:16, width:640, maxWidth:'96vw', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(4,44,83,0.2)', animation:'fu .2s ease' }}>
            <div style={{ padding:'22px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:17, fontWeight:700, color:'var(--navy)' }}>Profil eleve complet</div>
              <button style={{ background:'var(--g0)', border:'none', cursor:'pointer', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--g2)', fontSize:15 }} onClick={() => setSelectedStudent(null)}>✕</button>
            </div>
            <div style={{ padding:'0 24px 24px' }}>
              <div style={{ background:'var(--navy)', borderRadius:10, padding:18, marginBottom:14, display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap' }}>
                <div style={{ width:64, height:64, borderRadius:12, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'white', flexShrink:0 }}>
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:700, color:'white' }}>{selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:2 }}>Massar: {selectedStudent.massar} · Tel: {selectedStudent.parentPhone || '-'}</div>
                  <div style={{ display:'flex', gap:7, marginTop:10, flexWrap:'wrap' }}>
                    <span style={{ background: generalAvg && generalAvg < 10 ? 'var(--redl)' : 'rgba(255,255,255,0.15)', color: generalAvg && generalAvg < 10 ? 'var(--red)' : 'rgba(255,255,255,0.8)', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                      {generalAvg && generalAvg < 10 ? '⚠ Eleve a risque' : 'Actif 2025-26'}
                    </span>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {[
                    { val: generalAvg || '-', lbl:'Moyenne', color: generalAvg ? (generalAvg < 10 ? '#EF9F27' : '#4ade80') : 'white' },
                    { val: selectedStudent.parentPhone ? '✓' : '-', lbl:'Parent', color:'white' },
                    { val: new Date(selectedStudent.createdAt).getFullYear(), lbl:'Annee', color:'white' },
                  ].map(m => (
                    <div key={m.lbl} style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:10, textAlign:'center' }}>
                      <div style={{ fontSize:20, fontWeight:700, color:m.color }}>{m.val}</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', marginTop:2 }}>{m.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              {generalAvg && parseFloat(generalAvg) < 10 && (
                <div style={{ background:'var(--redl)', borderRadius:8, padding:'10px 13px', fontSize:12, color:'var(--red)', marginBottom:14 }}>
                  <strong>⚠ Alerte IA :</strong> Moyenne generale en dessous de 10. Intervention recommandee.
                </div>
              )}

              {studentGrades.length > 0 && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:9 }}>Notes par matiere</div>
                  {studentGrades.map(g => (
                    <div key={g.id} className="br-row">
                      <div className="br-lbl">{g.subject}</div>
                      <div className="br-track">
                        <div className="br-fill" style={{ width: g.average ? (g.average/20*100)+'%' : '0%', background: g.average < 10 ? 'var(--red)' : g.average >= 14 ? 'var(--green)' : 'var(--blue2)' }}></div>
                      </div>
                      <div className="br-val" style={{ color: g.average < 10 ? 'var(--red)' : g.average >= 14 ? 'var(--green)' : 'var(--navy)' }}>{g.average || '-'}</div>
                    </div>
                  ))}
                </div>
              )}

              {studentGrades.length === 0 && (
                <div style={{ background:'var(--g0)', borderRadius:8, padding:12, fontSize:12, color:'var(--g2)', marginBottom:14, textAlign:'center' }}>
                  Aucune note saisie pour cet eleve · Allez dans Notes pour saisir les notes
                </div>
              )}

              <div style={{ background:'var(--g0)', borderRadius:8, padding:12, marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', marginBottom:8 }}>Contact parent</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="av" style={{ width:36, height:36, fontSize:12, background:'var(--amberl)', color:'var(--gd)' }}>
                    {selectedStudent.firstName[0]}P
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{selectedStudent.parentName || 'Parent de '+selectedStudent.firstName}</div>
                    <div style={{ fontSize:12, color:'var(--g2)' }}>{selectedStudent.parentPhone || 'Telephone non renseigne'}</div>
                  </div>
                  {selectedStudent.parentPhone && (
                    <a href={'https://wa.me/'+selectedStudent.parentPhone.replace(/[^0-9]/g,'')} target="_blank" rel="noreferrer"
                      className="btn btn-wa btn-sm">WhatsApp</a>
                  )}
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-navy" style={{ flex:1 }} onClick={() => openBulletin(selectedStudent.id)}>📄 Bulletin PDF</button>
                <button className="btn btn-gold" style={{ flex:1 }}>💬 Envoyer message</button>
                <button className="btn btn-sm" style={{ background:'var(--redl)', color:'var(--red)', border:'1px solid #F09595', borderRadius:8, padding:'9px 14px', fontWeight:700, cursor:'pointer' }}
                  onClick={() => deleteStudent(selectedStudent.id, selectedStudent.firstName+' '+selectedStudent.lastName)}>
                  🗑 Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card cp">
        <table className="tbl">
          <thead>
            <tr><th>Eleve</th><th>Code Massar</th><th>Tel. Parent</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} onClick={() => openProfile(s)}>
                <td>
                  <div className="tav">
                    <div className="av" style={{ width:32, height:32, fontSize:11, background:'#E6F1FB', color:'#0C447C' }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:11, color:'var(--g2)' }}>Inscrit</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--navy)' }}>{s.massar}</td>
                <td style={{ color:'var(--g2)' }}>{s.parentPhone || '-'}</td>
                <td><span className="badge b-g">Actif</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display:'flex', gap:5 }}>
                    <button className="btn btn-out btn-sm" onClick={() => openProfile(s)}>Profil</button>
                    <button className="btn btn-gold btn-sm" onClick={() => openBulletin(s.id)}>Bulletin</button>
                    <button className="btn btn-sm" style={{ background:'var(--redl)', color:'var(--red)', border:'none', borderRadius:6, padding:'5px 9px', fontSize:11, fontWeight:700, cursor:'pointer' }}
                      onClick={() => deleteStudent(s.id, s.firstName+' '+s.lastName)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding:24, textAlign:'center', color:'var(--g2)' }}>
                {search ? 'Aucun resultat' : 'Aucun eleve — cliquez sur + Ajouter un eleve'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
