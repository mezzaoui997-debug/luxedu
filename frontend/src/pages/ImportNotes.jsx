import { useState } from 'react';
import api from '../api/axios';
import * as XLSX from 'xlsx';

export default function ImportNotes() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({ firstName:'', lastName:'', massar:'', subject:'', devoir1:'', devoir2:'', exam:'' });
  const [subject, setSubject] = useState('Mathematiques');
  const [semester, setSemester] = useState(1);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1);

  const SUBJECTS = ['Mathematiques','Francais','Arabe','Sciences','Anglais','Histoire-Geo','Islamique'];

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type:'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header:1 });
      if (data.length > 0) {
        setHeaders(data[0].map(h => String(h)));
        setPreview(data.slice(1, 6).map(row => {
          const obj = {};
          data[0].forEach((h, i) => { obj[String(h)] = row[i] ?? ''; });
          return obj;
        }));
        setStep(2);
      }
    };
    reader.readAsBinaryString(f);
  };

  const importNotes = async () => {
    setImporting(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const wb = XLSX.read(evt.target.result, { type:'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header:1 });
        const rows = data.slice(1);
        const hdrs = data[0].map(h => String(h));

        const getVal = (row, field) => {
          const idx = hdrs.indexOf(mapping[field]);
          return idx >= 0 ? row[idx] : null;
        };

        const studentsRes = await api.get('/students');
        const students = studentsRes.data;

        let success = 0, errors = 0, notFound = [];

        for (const row of rows) {
          if (!row || row.length === 0) continue;
          const massar = String(getVal(row, 'massar') || '').toUpperCase().trim();
          const student = students.find(s => s.massar === massar);

          if (!student) {
            notFound.push(massar);
            errors++;
            continue;
          }

          const d1 = getVal(row, 'devoir1');
          const d2 = getVal(row, 'devoir2');
          const ex = getVal(row, 'exam');

          try {
            await api.post('/grades', {
              studentId: student.id,
              subject: subject,
              semester: semester,
              devoir1: d1 !== null && d1 !== '' ? +d1 : null,
              devoir2: d2 !== null && d2 !== '' ? +d2 : null,
              exam: ex !== null && ex !== '' ? +ex : null,
            });
            success++;
          } catch { errors++; }
        }

        setResult({ success, errors, notFound });
        setStep(3);
        setImporting(false);
      };
      reader.readAsBinaryString(file);
    } catch(err) {
      alert('Erreur: ' + err.message);
      setImporting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Import Excel — Notes</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>Importez les notes des professeurs en un clic</div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:22 }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
              background: step > n ? 'var(--green)' : step === n ? 'var(--navy)' : 'var(--g1)',
              color: step >= n ? 'white' : 'var(--g2)' }}>
              {step > n ? '✓' : n}
            </div>
            <span style={{ fontSize:11, fontWeight:700, color: step===n?'var(--navy)':step>n?'var(--green)':'var(--g2)' }}>
              {n===1?'Upload fichier':n===2?'Configurer':' Resultat'}
            </span>
            {n < 3 && <div style={{ width:20, height:2, background: step>n?'var(--green)':'var(--g1)', margin:'0 4px' }}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card cp">
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Telecharger le modele Excel</div>
          <div style={{ fontSize:12, color:'var(--g2)', marginBottom:14 }}>Le fichier doit contenir les colonnes : Massar, Devoir1, Devoir2, Examen</div>

          <div style={{ background:'var(--g0)', borderRadius:8, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', marginBottom:8 }}>Format attendu</div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'var(--navy)', color:'white' }}>
                  {['Massar','Prenom','Nom','Devoir1','Devoir2','Examen'].map(h => (
                    <th key={h} style={{ padding:'7px 10px', textAlign:'left', fontSize:11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[['G412252321','Omar','Moussa','15','16','14'],['B903751842','Youssef','Benjelloun','13','14','12']].map((row,i) => (
                  <tr key={i} style={{ background: i%2===0?'white':'var(--g0)' }}>
                    {row.map((cell,j) => <td key={j} style={{ padding:'7px 10px', fontFamily: j===0?'monospace':'inherit' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ border:'2px dashed var(--g1)', borderRadius:10, padding:32, textAlign:'center', marginBottom:14, transition:'all .15s' }}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.background='var(--bl)'; }}
            onDragLeave={e => { e.currentTarget.style.borderColor='var(--g1)'; e.currentTarget.style.background='transparent'; }}
            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor='var(--g1)'; e.currentTarget.style.background='transparent'; const f=e.dataTransfer.files[0]; if(f) handleFile({target:{files:[f]}}); }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Glissez votre fichier Excel ici</div>
            <div style={{ fontSize:12, color:'var(--g2)', marginBottom:14 }}>ou cliquez pour selectionner</div>
            <label className="btn btn-navy" style={{ cursor:'pointer' }}>
              Selectionner fichier .xlsx
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display:'none' }} />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card cp">
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Configurer l'import</div>
          <div style={{ fontSize:12, color:'var(--g2)', marginBottom:14 }}>Fichier: {file?.name} · {preview.length} lignes apercu</div>

          <div className="fgrid2" style={{ marginBottom:14 }}>
            <div className="fg">
              <label>Matiere</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="fg">
              <label>Semestre</label>
              <select value={semester} onChange={e => setSemester(+e.target.value)}>
                <option value={1}>Semestre 1</option>
                <option value={2}>Semestre 2</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', marginBottom:10 }}>Correspondance des colonnes</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
            {[['massar','Code Massar *'],['devoir1','Devoir 1'],['devoir2','Devoir 2'],['exam','Examen']].map(([key, lbl]) => (
              <div className="fg" key={key} style={{ marginBottom:0 }}>
                <label>{lbl}</label>
                <select value={mapping[key]} onChange={e => setMapping({...mapping, [key]:e.target.value})}>
                  <option value="">-- Selectionner --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--g2)', textTransform:'uppercase', marginBottom:8 }}>Apercu (5 premieres lignes)</div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'var(--g0)' }}>
                    {headers.map(h => <th key={h} style={{ padding:'7px 10px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} style={{ borderBottom:'1px solid var(--g1)' }}>
                      {headers.map(h => <td key={h} style={{ padding:'7px 10px' }}>{String(row[h] ?? '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-green" onClick={importNotes} disabled={importing || !mapping.massar}>
              {importing ? 'Import en cours...' : '✓ Lancer import'}
            </button>
            <button className="btn btn-out" onClick={() => { setStep(1); setFile(null); setPreview([]); }}>← Retour</button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="card cp">
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>Resultat de l'import</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
            <div style={{ background:'var(--greenl)', borderRadius:9, padding:16, textAlign:'center' }}>
              <div style={{ fontSize:32, fontWeight:700, color:'var(--green)' }}>{result.success}</div>
              <div style={{ fontSize:12, color:'var(--green)', fontWeight:700 }}>Notes importees</div>
            </div>
            <div style={{ background: result.errors>0?'var(--redl)':'var(--g0)', borderRadius:9, padding:16, textAlign:'center' }}>
              <div style={{ fontSize:32, fontWeight:700, color: result.errors>0?'var(--red)':'var(--g2)' }}>{result.errors}</div>
              <div style={{ fontSize:12, color: result.errors>0?'var(--red)':'var(--g2)', fontWeight:700 }}>Erreurs</div>
            </div>
            <div style={{ background:'var(--bl)', borderRadius:9, padding:16, textAlign:'center' }}>
              <div style={{ fontSize:32, fontWeight:700, color:'var(--blue)' }}>{result.success + result.errors}</div>
              <div style={{ fontSize:12, color:'var(--blue)', fontWeight:700 }}>Total traite</div>
            </div>
          </div>
          {result.notFound.length > 0 && (
            <div style={{ background:'var(--amberl)', borderRadius:8, padding:12, marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--gd)', marginBottom:6 }}>Codes Massar non trouves :</div>
              <div style={{ fontSize:12, color:'var(--g2)', fontFamily:'monospace' }}>{result.notFound.join(', ')}</div>
            </div>
          )}
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-navy" onClick={() => { setStep(1); setFile(null); setPreview([]); setResult(null); }}>Nouvel import</button>
            <button className="btn btn-out" onClick={() => window.location.href='/'}>Voir les notes</button>
          </div>
        </div>
      )}
    </div>
  );
}
