import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import * as XLSX from 'xlsx';

const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique','Physique-Chimie','SVT','Informatique'];

const FILIERES = [
  { id:'SVT', lbl:'Sciences de la Vie et de la Terre', min:13, coeffs:{ SVT:5, 'Physique-Chimie':4, Mathematiques:4, Francais:2 }, color:'#3B6D11', bg:'#EAF3DE' },
  { id:'PC', lbl:'Sciences Physiques et Chimiques', min:13, coeffs:{ 'Physique-Chimie':5, Mathematiques:4, SVT:3, Francais:2 }, color:'#185FA5', bg:'#E6F1FB' },
  { id:'SM', lbl:'Sciences Mathematiques', min:15, coeffs:{ Mathematiques:7, 'Physique-Chimie':4, Francais:2 }, color:'#042C53', bg:'#E6F1FB' },
  { id:'AGRO', lbl:'Sciences Agronomiques', min:12, coeffs:{ SVT:5, Sciences:4, Mathematiques:3 }, color:'#3B6D11', bg:'#EAF3DE' },
  { id:'ECO', lbl:'Sciences Economiques', min:11, coeffs:{ Mathematiques:4, Francais:3, Anglais:3, 'Histoire-Geo':2 }, color:'#854F0B', bg:'#FAEEDA' },
  { id:'LETTRE', lbl:'Lettres et Sciences Humaines', min:11, coeffs:{ Arabe:5, Francais:3, 'Histoire-Geo':3, Anglais:2 }, color:'#534AB7', bg:'#EEEDFE' },
  { id:'ARTS', lbl:'Arts Appliques', min:10, coeffs:{ Francais:3, Arabe:3, Anglais:2 }, color:'#A32D2D', bg:'#FCEBEB' },
  { id:'TECH', lbl:'Sciences et Technologies', min:11, coeffs:{ Mathematiques:4, 'Physique-Chimie':4, Informatique:3 }, color:'#185FA5', bg:'#E6F1FB' },
];

export default function Tawjih() {
  const { school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [allGrades, setAllGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orientation');
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importHeaders, setImportHeaders] = useState([]);
  const [importSubject, setImportSubject] = useState('Mathematiques');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [filterFiliere, setFilterFiliere] = useState('all');

  useEffect(() => {
    const loadAll = async () => {
      const sRes = await api.get('/students');
      setStudents(sRes.data);
      const gradesMap = {};
      for (const subj of SUBJECTS) {
        try {
          const gRes = await api.get('/grades?subject=' + subj + '&semester=1');
          gRes.data.forEach(s => {
            if (!gradesMap[s.id]) gradesMap[s.id] = {};
            if (s.grades && s.grades[0]) gradesMap[s.id][subj] = s.grades[0].average;
          });
        } catch(e) {}
      }
      setAllGrades(gradesMap);
      setLoading(false);
    };
    loadAll();
  }, []);

  const getAvg = (studentId) => {
    const g = allGrades[studentId] || {};
    const vals = Object.values(g).filter(v => v != null);
    if (!vals.length) return null;
    return (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(2);
  };

  const getWeightedAvg = (studentId, filiere) => {
    const g = allGrades[studentId] || {};
    let total = 0, totalCoeff = 0;
    Object.entries(filiere.coeffs).forEach(([subj, coeff]) => {
      if (g[subj] != null) { total += g[subj] * coeff; totalCoeff += coeff; }
    });
    return totalCoeff > 0 ? (total / totalCoeff).toFixed(2) : null;
  };

  const getFilieres = (studentId) => {
    const avg = parseFloat(getAvg(studentId));
    if (!avg) return [];
    return FILIERES
      .filter(f => avg >= f.min)
      .map(f => ({ ...f, weightedAvg: getWeightedAvg(studentId, f) }))
      .sort((a, b) => (parseFloat(b.weightedAvg) || 0) - (parseFloat(a.weightedAvg) || 0));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImportFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type:'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header:1 });
      if (data.length > 0) {
        setImportHeaders(data[0].map(h => String(h)));
        setImportPreview(data.slice(1, 6).map(row => {
          const obj = {};
          data[0].forEach((h, i) => { obj[String(h)] = row[i] ?? ''; });
          return obj;
        }));
      }
    };
    reader.readAsBinaryString(f);
  };

  const runImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type:'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header:1 });
      const hdrs = data[0].map(h => String(h));
      const rows = data.slice(1);
      const massarIdx = hdrs.findIndex(h => h.toLowerCase().includes('massar') || h.toLowerCase().includes('cne'));
      const d1Idx = hdrs.findIndex(h => h.toLowerCase().includes('devoir') && h.includes('1'));
      const d2Idx = hdrs.findIndex(h => h.toLowerCase().includes('devoir') && h.includes('2'));
      const exIdx = hdrs.findIndex(h => h.toLowerCase().includes('exam'));
      if (massarIdx === -1) { alert('Colonne Massar non trouvee'); setImporting(false); return; }
      const studentsRes = await api.get('/students');
      const studentsList = studentsRes.data;
      let success = 0, errors = 0, notFound = [];
      for (const row of rows) {
        if (!row || row.length === 0) continue;
        const massar = String(row[massarIdx] || '').toUpperCase().trim();
        const student = studentsList.find(s => s.massar === massar);
        if (!student) { notFound.push(massar); errors++; continue; }
        try {
          await api.post('/grades', {
            studentId: student.id, subject: importSubject, semester: 1,
            devoir1: d1Idx >= 0 && row[d1Idx] !== '' ? +row[d1Idx] : null,
            devoir2: d2Idx >= 0 && row[d2Idx] !== '' ? +row[d2Idx] : null,
            exam: exIdx >= 0 && row[exIdx] !== '' ? +row[exIdx] : null,
          });
          success++;
        } catch { errors++; }
      }
      setImportResult({ success, errors, notFound });
      setImporting(false);
      if (success > 0) {
        const gRes = await api.get('/grades?subject=' + importSubject + '&semester=1');
        setAllGrades(prev => {
          const updated = {...prev};
          gRes.data.forEach(s => {
            if (!updated[s.id]) updated[s.id] = {};
            if (s.grades && s.grades[0]) updated[s.id][importSubject] = s.grades[0].average;
          });
          return updated;
        });
      }
    };
    reader.readAsBinaryString(importFile);
  };


  const exportMassar = () => {
    const header = ['Code_Massar','Prenom','Nom',...SUBJECTS.map(s => s+'_D1'),...SUBJECTS.map(s => s+'_D2'),...SUBJECTS.map(s => s+'_Exam'),...SUBJECTS.map(s => s+'_Moy')];
    const lines = [header.join(';')];
    students.forEach(s => {
      const g = allGrades[s.id] || {};
      const row = [s.massar, s.firstName, s.lastName,
        ...SUBJECTS.map(sub => g[sub] ? '-' : '-'),
        ...SUBJECTS.map(sub => g[sub] ? '-' : '-'),
        ...SUBJECTS.map(sub => g[sub] ? '-' : '-'),
        ...SUBJECTS.map(sub => g[sub] || '-'),
      ];
      lines.push(row.join(';'));
    });
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'massar-notes-' + new Date().getFullYear() + '.csv'; a.click();
  };

  const exportCSV = () => {
    const header = ['Nom','Prenom','Massar','Moyenne',...SUBJECTS,'Filiere 1','Filiere 2','Filiere 3'];
    const lines = [header.join(',')];
    students.forEach(s => {
      const g = allGrades[s.id] || {};
      const avg = getAvg(s.id) || '-';
      const filieres = getFilieres(s.id);
      const row = [
        s.lastName, s.firstName, s.massar, avg,
        ...SUBJECTS.map(sub => g[sub] || '-'),
        filieres[0]?.id || '-', filieres[1]?.id || '-', filieres[2]?.id || '-'
      ];
      lines.push(row.join(','));
    });
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tawjih-2026.csv'; a.click();
  };

  const getColor = (avg) => {
    if (!avg) return '#888780';
    const n = parseFloat(avg);
    if (n >= 16) return '#3B6D11';
    if (n >= 14) return '#185FA5';
    if (n >= 10) return '#854F0B';
    return '#A32D2D';
  };

  const filteredStudents = filterFiliere === 'all' ? students :
    students.filter(s => getFilieres(s.id).some(f => f.id === filterFiliere));

  if (loading) return (
    <div style={{ padding:40, textAlign:'center', color:'#888780' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
      <div>Chargement des donnees...</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Tawjih — Orientation scolaire</div>
        <div style={{ fontSize:13, color:'#888780' }}>Recommandations IA · Coefficients MEN officiels · Export Excel</div>
      </div>

      <div style={{ background:'linear-gradient(135deg, #042C53 0%, #0C447C 100%)', borderRadius:10, padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontSize:28 }}>🤖</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:3 }}>IA — Orientation automatique avec coefficients MEN</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
            {students.length} eleves analysés · {FILIERES.length} filieres disponibles · Coefficients officiels
          </div>
        </div>
        <button onClick={exportCSV}
          style={{ background:'#EF9F27', color:'#633806', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
          📥 Export Excel Tawjih
        </button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[['orientation','🎓 Orientation'],['import','📥 Import Excel Notes'],['stats','📊 Statistiques'],['massar','🇲🇦 Export Massar']].map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)} className="btn btn-sm"
            style={{ background:tab===id?'var(--navy)':'white', color:tab===id?'white':'var(--g3)', border:'1px solid '+(tab===id?'var(--navy)':'var(--g1)') }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'orientation' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            <select value={filterFiliere} onChange={e => setFilterFiliere(e.target.value)}
              style={{ padding:'8px 12px', border:'1px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
              <option value="all">Toutes les filieres</option>
              {FILIERES.map(f => <option key={f.id} value={f.id}>{f.id} — {f.lbl}</option>)}
            </select>
            <div style={{ fontSize:12, color:'var(--g2)', display:'flex', alignItems:'center' }}>
              {filteredStudents.length} eleve(s) affiche(s)
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filteredStudents.map(s => {
              const avg = getAvg(s.id);
              const filieres = getFilieres(s.id);
              const g = allGrades[s.id] || {};
              return (
                <div key={s.id} style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:'#042C53' }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:12, color:'#888780' }}>{s.massar}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:28, fontWeight:700, color:getColor(avg) }}>{avg || '-'}</div>
                      <div style={{ fontSize:11, color:'#888780' }}>Moyenne generale</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:14 }}>
                    {SUBJECTS.slice(0,7).map(subj => (
                      <div key={subj} style={{ background:'#F5F5F3', borderRadius:8, padding:'7px 6px', textAlign:'center' }}>
                        <div style={{ fontSize:8, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{subj.slice(0,5)}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:getColor(g[subj]) }}>{g[subj] || '-'}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:8 }}>Filieres recommandees par IA (coefficients MEN)</div>
                    {filieres.length === 0 ? (
                      <div style={{ background:'#FCEBEB', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#A32D2D', fontWeight:700 }}>
                        Moyenne insuffisante — soutien scolaire recommande avant orientation
                      </div>
                    ) : (
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {filieres.slice(0,4).map((f, i) => (
                          <div key={f.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:20, background:i===0?'#042C53':f.bg, border:i===0?'none':'1px solid '+f.color+'44' }}>
                            {i === 0 && <span>⭐</span>}
                            <div>
                              <div style={{ fontSize:12, fontWeight:700, color:i===0?'white':f.color }}>{f.id} — {f.lbl}</div>
                              {f.weightedAvg && <div style={{ fontSize:10, color:i===0?'rgba(255,255,255,0.6)':f.color+'99' }}>Moy. ponderee: {f.weightedAvg}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'import' && (
        <div>
          <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:20, marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#042C53', marginBottom:4 }}>Import Excel — Notes des professeurs</div>
            <div style={{ fontSize:12, color:'#888780', marginBottom:16 }}>Importez un fichier Excel avec les colonnes: Massar, Devoir1, Devoir2, Examen</div>

            <div style={{ background:'#F5F5F3', borderRadius:8, padding:14, marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:8 }}>Format attendu</div>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#042C53', color:'white' }}>
                    {['Massar','Prenom','Nom','Devoir1','Devoir2','Examen'].map(h => (
                      <th key={h} style={{ padding:'6px 10px', textAlign:'left', fontSize:11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[['G412252321','Omar','Moussa','15','16','14'],['B903751842','Youssef','Benjelloun','13','14','12']].map((row,i) => (
                    <tr key={i} style={{ background:i%2===0?'white':'#F5F5F3' }}>
                      {row.map((cell,j) => <td key={j} style={{ padding:'6px 10px', fontFamily:j===0?'monospace':'inherit' }}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#888780', marginBottom:5, textTransform:'uppercase' }}>Matiere</label>
              <select value={importSubject} onChange={e => setImportSubject(e.target.value)}
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid var(--g1)', borderRadius:8, fontSize:13, outline:'none' }}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ border:'2px dashed var(--g1)', borderRadius:10, padding:24, textAlign:'center', marginBottom:14 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📊</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:8 }}>
                {importFile ? importFile.name : 'Glissez votre fichier Excel ici'}
              </div>
              <label style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:12, fontWeight:700, cursor:'pointer', display:'inline-block' }}>
                Selectionner fichier .xlsx
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display:'none' }} />
              </label>
            </div>

            {importPreview.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#888780', textTransform:'uppercase', marginBottom:8 }}>
                  Apercu ({importPreview.length} lignes)
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                    <thead>
                      <tr style={{ background:'#F5F5F3' }}>
                        {importHeaders.map(h => <th key={h} style={{ padding:'6px 10px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row, i) => (
                        <tr key={i} style={{ borderBottom:'1px solid var(--g1)' }}>
                          {importHeaders.map(h => <td key={h} style={{ padding:'7px 10px' }}>{String(row[h] ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importResult && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
                <div style={{ background:'#EAF3DE', borderRadius:9, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:28, fontWeight:700, color:'#3B6D11' }}>{importResult.success}</div>
                  <div style={{ fontSize:12, color:'#3B6D11', fontWeight:700 }}>Notes importees</div>
                </div>
                <div style={{ background: importResult.errors>0?'#FCEBEB':'#F5F5F3', borderRadius:9, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:28, fontWeight:700, color:importResult.errors>0?'#A32D2D':'#888780' }}>{importResult.errors}</div>
                  <div style={{ fontSize:12, color:importResult.errors>0?'#A32D2D':'#888780', fontWeight:700 }}>Erreurs</div>
                </div>
                <div style={{ background:'#E6F1FB', borderRadius:9, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:28, fontWeight:700, color:'#0C447C' }}>{importResult.success + importResult.errors}</div>
                  <div style={{ fontSize:12, color:'#0C447C', fontWeight:700 }}>Total traite</div>
                </div>
              </div>
            )}

            <button onClick={runImport} disabled={!importFile || importing}
              style={{ background: importFile?'#3B6D11':'#E8E6E0', color: importFile?'white':'#888780', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor: importFile?'pointer':'not-allowed', width:'100%' }}>
              {importing ? 'Import en cours...' : importResult ? '✓ Reimporter' : '✓ Lancer l import'}
            </button>
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            {[
              { lbl:'Eleves analyses', val:students.length, color:'#0C447C', bg:'#E6F1FB' },
              { lbl:'Avec orientation', val:students.filter(s=>getFilieres(s.id).length>0).length, color:'#3B6D11', bg:'#EAF3DE' },
              { lbl:'Soutien necessaire', val:students.filter(s=>getFilieres(s.id).length===0).length, color:'#A32D2D', bg:'#FCEBEB' },
              { lbl:'Moyenne classe', val:(() => { const avgs=students.map(s=>parseFloat(getAvg(s.id))).filter(a=>a); return avgs.length?(avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(1):'-'; })(), color:'#185FA5', bg:'#E6F1FB' },
            ].map(m => (
              <div key={m.lbl} style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:16 }}>
                <div style={{ fontSize:10, color:'#888780', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>{m.lbl}</div>
                <div style={{ fontSize:28, fontWeight:700, color:m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#042C53', marginBottom:14 }}>Repartition par filiere</div>
            {FILIERES.map(f => {
              const count = students.filter(s => getFilieres(s.id)[0]?.id === f.id).length;
              return (
                <div key={f.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div style={{ width:50, fontSize:11, fontWeight:700, color:f.color }}>{f.id}</div>
                  <div style={{ flex:1, background:'#F5F5F3', borderRadius:6, height:22, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:f.color, width: students.length>0?(count/students.length*100)+'%':'0%', borderRadius:6, transition:'width .7s', display:'flex', alignItems:'center', paddingLeft:8 }}>
                      {count > 0 && <span style={{ fontSize:11, fontWeight:700, color:'white' }}>{count}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:f.color, width:30, textAlign:'right' }}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'massar' && (
        <div>
          <div style={{ background:'linear-gradient(135deg, #042C53 0%, #185FA5 100%)', borderRadius:10, padding:'18px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:32 }}>🇲🇦</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:3 }}>Portail Massar — Ministere de l Education Nationale</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>
                Exportez les notes au format Massar et importez-les manuellement sur massarservice.men.gov.ma
              </div>
            </div>
            <a href="https://massarservice.men.gov.ma" target="_blank" rel="noreferrer"
              style={{ background:'white', color:'#042C53', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer', textDecoration:'none', flexShrink:0 }}>
              Ouvrir Massar →
            </a>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:4 }}>Etape 1 — Exporter depuis LuxEdu</div>
              <div style={{ fontSize:12, color:'#888780', marginBottom:14, lineHeight:1.6 }}>
                Generez un fichier Excel avec toutes les notes dans le format accepte par Massar.
              </div>
              <div style={{ background:'#F5F5F3', borderRadius:8, padding:12, marginBottom:14, fontSize:12 }}>
                <div style={{ fontWeight:700, color:'#042C53', marginBottom:6 }}>Format Massar requis :</div>
                <div style={{ fontFamily:'monospace', fontSize:11, color:'#888780', lineHeight:1.8 }}>
                  Code_Massar | Matiere | Note_D1 | Note_D2 | Note_Exam | Moyenne
                </div>
              </div>
              <button onClick={exportMassar}
                style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'10px 20px', fontSize:12, fontWeight:700, cursor:'pointer', width:'100%' }}>
                📥 Exporter format Massar
              </button>
            </div>

            <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:4 }}>Etape 2 — Importer dans Massar</div>
              <div style={{ fontSize:12, color:'#888780', marginBottom:14, lineHeight:1.6 }}>
                Connectez-vous sur Massar avec vos identifiants d etablissement et importez le fichier.
              </div>
              {[
                '1. Allez sur massarservice.men.gov.ma',
                '2. Connectez-vous avec le code etablissement',
                '3. Allez dans Gestion des notes',
                '4. Cliquez sur Importer',
                '5. Selectionnez le fichier LuxEdu',
                '6. Validez l import',
              ].map((step, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid #F5F5F3', fontSize:12 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#042C53', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div>{step.slice(3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'white', borderRadius:10, border:'1px solid var(--g1)', padding:18 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#042C53', marginBottom:14 }}>Validation des Codes Massar</div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#F5F5F3' }}>
                  {['Eleve','Code Massar','Validation','Statut'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const valid = /^[A-Z][0-9]{9}$/.test(s.massar);
                  return (
                    <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                      <td style={{ padding:'11px 12px', fontWeight:700 }}>{s.firstName} {s.lastName}</td>
                      <td style={{ padding:'11px 12px', fontFamily:'monospace', fontSize:12, color:'#042C53' }}>{s.massar}</td>
                      <td style={{ padding:'11px 12px', fontSize:12, color: valid?'#3B6D11':'#A32D2D' }}>
                        {valid ? '✓ Format valide (1 lettre + 9 chiffres)' : '✗ Format invalide'}
                      </td>
                      <td style={{ padding:'11px 12px' }}>
                        <span style={{ background:valid?'#EAF3DE':'#FCEBEB', color:valid?'#3B6D11':'#A32D2D', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20 }}>
                          {valid ? 'Pret Massar' : 'A corriger'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
