import { useEffect, useState } from 'react';
import api from '../api/axios';

const SUBJECTS = ['Mathématiques','Français','Arabe','Sciences','Anglais','Histoire-Géo','Islamique'];

export default function Notes() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [subject, setSubject] = useState('Mathématiques');
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  useEffect(() => {
    if (students.length === 0) return;
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        if (s.grades && s.grades.length > 0) {
          const g = s.grades[0];
          map[s.id] = { devoir1: g.devoir1 ?? '', devoir2: g.devoir2 ?? '', exam: g.exam ?? '', average: g.average };
        } else {
          map[s.id] = { devoir1: '', devoir2: '', exam: '', average: null };
        }
      });
      setGrades(map);
    });
  }, [subject, semester, students]);

  const setGrade = (studentId, field, value) => {
    const updated = { ...grades, [studentId]: { ...grades[studentId], [field]: value } };
    const g = updated[studentId];
    const vals = [g.devoir1, g.devoir2, g.exam].filter(v => v !== '' && v !== null);
    const avg = vals.length > 0 ? (vals.reduce((a,b) => +a + +b, 0) / vals.length).toFixed(1) : null;
    updated[studentId].average = avg;
    setGrades(updated);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(students.map(s => {
        const g = grades[s.id];
        if (!g) return Promise.resolve();
        return api.post('/grades', {
          studentId: s.id,
          subject,
          semester,
          devoir1: g.devoir1 !== '' ? +g.devoir1 : null,
          devoir2: g.devoir2 !== '' ? +g.devoir2 : null,
          exam: g.exam !== '' ? +g.exam : null
        });
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) {
      alert('Erreur: ' + err.message);
    } finally { setSaving(false); }
  };

  const getMention = (avg) => {
    if (!avg) return '';
    if (avg >= 16) return { label:'Très bien', color:'#3B6D11' };
    if (avg >= 14) return { label:'Bien', color:'#0C447C' };
    if (avg >= 12) return { label:'Assez bien', color:'#185FA5' };
    if (avg >= 10) return { label:'Passable', color:'#854F0B' };
    return { label:'Insuffisant', color:'#A32D2D' };
  };

  return (
    <div style={{ padding:22 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Notes & Bulletins</div>
        <div style={{ fontSize:13, color:'#888780' }}>Saisie des notes · Notes sur 20</div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <select value={subject} onChange={e => setSubject(e.target.value)}
          style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={semester} onChange={e => setSemester(+e.target.value)}
          style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
        <button onClick={saveAll} disabled={saving}
          style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer', marginLeft:'auto' }}>
          {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer les notes'}
        </button>
      </div>
      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 100px 120px', gap:8, padding:'10px 16px', background:'#F5F5F3', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>
          <div>Élève</div><div style={{ textAlign:'center' }}>Devoir 1</div><div style={{ textAlign:'center' }}>Devoir 2</div><div style={{ textAlign:'center' }}>Examen</div><div style={{ textAlign:'center', color:'#0C447C' }}>Moyenne</div><div style={{ textAlign:'center' }}>Mention</div>
        </div>
        {students.map(s => {
          const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
          const avg = g.average;
          const mention = getMention(avg);
          const avgColor = avg < 10 ? '#A32D2D' : avg >= 14 ? '#3B6D11' : '#0C447C';
          return (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 100px 120px', gap:8, padding:'10px 16px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div style={{ fontWeight:700, fontSize:13 }}>{s.firstName} {s.lastName}</div>
              </div>
              {['devoir1','devoir2','exam'].map(field => (
                <input key={field} type="number" min="0" max="20" step="0.5"
                  value={g[field]} onChange={e => setGrade(s.id, field, e.target.value)}
                  placeholder="—"
                  style={{ textAlign:'center', padding:'7px', border:'1.5px solid ' + (g[field] !== '' && +g[field] < 10 ? '#F09595' : '#E8E6E0'), borderRadius:8, fontSize:13, outline:'none', background: g[field] !== '' && +g[field] < 10 ? '#FFF8F8' : 'white', color: g[field] !== '' && +g[field] < 10 ? '#A32D2D' : '#2C2C2A' }} />
              ))}
              <div style={{ textAlign:'center', fontWeight:700, fontSize:16, color: avg ? avgColor : '#888780', background: avg ? (avg < 10 ? '#FCEBEB' : avg >= 14 ? '#EAF3DE' : '#E6F1FB') : '#F5F5F3', borderRadius:8, padding:'7px 4px' }}>
                {avg || '—'}
              </div>
              <div style={{ textAlign:'center', fontSize:11, fontWeight:700, color: mention.color || '#888780' }}>
                {mention.label || '—'}
              </div>
            </div>
          );
        })}
        {students.length === 0 && <div style={{ padding:24, textAlign:'center', color:'#888780' }}>Aucun élève</div>}
      </div>
    </div>
  );
}
