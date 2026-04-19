import { useEffect, useState } from 'react';
import api from '../api/axios';

const SUBJECTS = [
  { name:'Mathematiques', coeff:3 },
  { name:'Francais', coeff:3 },
  { name:'Arabe', coeff:3 },
  { name:'Sciences', coeff:2 },
  { name:'Anglais', coeff:1 },
  { name:'Histoire-Geo', coeff:2 },
  { name:'Islamique', coeff:2 },
];

const getMention = (avg) => {
  if (!avg) return { label:'-', color:'var(--g2)' };
  if (avg >= 16) return { label:'Tres bien', color:'var(--green)' };
  if (avg >= 14) return { label:'Bien', color:'var(--blue)' };
  if (avg >= 12) return { label:'Assez bien', color:'var(--blue2)' };
  if (avg >= 10) return { label:'Passable', color:'var(--amber)' };
  return { label:'Insuffisant', color:'var(--red)' };
};

export default function Notes() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [subject, setSubject] = useState('Mathematiques');
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState('matiere');

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  useEffect(() => {
    if (!students.length) return;
    api.get('/grades?subject=' + subject + '&semester=' + semester).then(r => {
      const map = {};
      r.data.forEach(s => {
        const g = s.grades?.[0];
        map[s.id] = g ? { devoir1:g.devoir1??'', devoir2:g.devoir2??'', exam:g.exam??'', average:g.average } : { devoir1:'', devoir2:'', exam:'', average:null };
      });
      setGrades(map);
    });
  }, [subject, semester, students]);

  const setGrade = (studentId, field, value) => {
    const updated = { ...grades, [studentId]: { ...grades[studentId], [field]:value } };
    const g = updated[studentId];
    const vals = [g.devoir1, g.devoir2, g.exam].filter(v => v !== '' && v !== null && !isNaN(v));
    const avg = vals.length > 0 ? +(vals.reduce((a,b) => +a + +b, 0) / vals.length).toFixed(1) : null;
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
          studentId: s.id, subject, semester,
          devoir1: g.devoir1 !== '' ? +g.devoir1 : null,
          devoir2: g.devoir2 !== '' ? +g.devoir2 : null,
          exam: g.exam !== '' ? +g.exam : null,
        });
      }));
      const lowGrade = students.filter(s => grades[s.id]?.average && grades[s.id].average < 10);
      for (const s of lowGrade) {
        if (s.parentPhone) {
          try {
            await api.post('/whatsapp/send', {
              phone: s.parentPhone,
              message: 'Bonjour, votre enfant ' + s.firstName + ' a obtenu ' + grades[s.id].average + '/20 en ' + subject + '. Soutien scolaire recommande.'
            });
          } catch {}
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const classAvg = () => {
    const avgs = students.map(s => grades[s.id]?.average).filter(a => a != null);
    if (!avgs.length) return null;
    return (avgs.reduce((a,b) => a+b, 0) / avgs.length).toFixed(1);
  };

  const avg = classAvg();

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Notes & Bulletins</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>Saisie des notes · Notes sur 20 · Semestre {semester}</div>
      </div>

      <div className="metrics" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        <div className="metric">
          <div className="mic" style={{ background:'var(--bl)' }}>📊</div>
          <div className="mlbl">Moyenne classe</div>
          <div className="mval" style={{ color: avg && avg < 10 ? 'var(--red)' : avg >= 14 ? 'var(--green)' : 'var(--navy)' }}>
            {avg || '-'}
          </div>
          <div className="msub">{subject}</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'var(--greenl)' }}>🏆</div>
          <div className="mlbl">Au-dessus de 10</div>
          <div className="mval" style={{ color:'var(--green)' }}>
            {students.filter(s => grades[s.id]?.average >= 10).length}
          </div>
          <div className="msub">eleves</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'var(--redl)' }}>⚠️</div>
          <div className="mlbl">En dessous de 10</div>
          <div className="mval" style={{ color:'var(--red)' }}>
            {students.filter(s => grades[s.id]?.average != null && grades[s.id].average < 10).length}
          </div>
          <div className="msub">parents alertes WA</div>
        </div>
        <div className="metric">
          <div className="mic" style={{ background:'var(--amberl)' }}>📝</div>
          <div className="mlbl">Notes saisies</div>
          <div className="mval">
            {students.filter(s => grades[s.id]?.average != null).length}
          </div>
          <div className="msub">sur {students.length} eleves</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <select value={subject} onChange={e => setSubject(e.target.value)} className="sel">
          {SUBJECTS.map(s => <option key={s.name}>{s.name}</option>)}
        </select>
        <select value={semester} onChange={e => setSemester(+e.target.value)} className="sel">
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
        <div style={{ display:'flex', gap:6 }}>
          <button className="btn btn-sm" onClick={() => setView('matiere')}
            style={{ background:view==='matiere'?'var(--navy)':'white', color:view==='matiere'?'white':'var(--g3)', border:'1px solid '+(view==='matiere'?'var(--navy)':'var(--g1)') }}>
            Par matiere
          </button>
          <button className="btn btn-sm" onClick={() => setView('eleve')}
            style={{ background:view==='eleve'?'var(--navy)':'white', color:view==='eleve'?'white':'var(--g3)', border:'1px solid '+(view==='eleve'?'var(--navy)':'var(--g1)') }}>
            Par eleve
          </button>
        </div>
        <button className="btn btn-navy" onClick={saveAll} disabled={saving} style={{ marginLeft:'auto' }}>
          {saving ? 'Enregistrement...' : saved ? '✓ Enregistre ! WA envoye' : 'Enregistrer & Notifier WA'}
        </button>
      </div>

      <div className="card cp">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', background:'var(--g0)', borderRadius:7, marginBottom:8, fontSize:10, fontWeight:700, color:'var(--g2)', textTransform:'uppercase' }}>
          <div>Eleve</div>
          <div style={{ textAlign:'center' }}>Devoir 1</div>
          <div style={{ textAlign:'center' }}>Devoir 2</div>
          <div style={{ textAlign:'center' }}>Examen</div>
          <div style={{ textAlign:'center', color:'var(--blue)' }}>Moyenne</div>
          <div style={{ textAlign:'center' }}>Mention</div>
        </div>
        {students.map(s => {
          const g = grades[s.id] || { devoir1:'', devoir2:'', exam:'', average:null };
          const avg = g.average;
          const mention = getMention(avg);
          const avgBg = avg == null ? 'var(--g0)' : avg < 10 ? 'var(--redl)' : avg >= 14 ? 'var(--greenl)' : 'var(--bl)';
          return (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 90px 90px 100px 110px', gap:8, padding:'10px 16px', borderBottom:'1px solid #F5F5F3', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C', flexShrink:0 }}>
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                  {avg != null && avg < 10 && s.parentPhone && (
                    <div style={{ fontSize:10, color:'var(--red)' }}>⚠ Parent sera notifie WA</div>
                  )}
                </div>
              </div>
              {['devoir1','devoir2','exam'].map(field => (
                <input key={field} type="number" min="0" max="20" step="0.5"
                  value={g[field]} onChange={e => setGrade(s.id, field, e.target.value)}
                  placeholder="-"
                  style={{ textAlign:'center', padding:'7px', borderRadius:8, fontSize:13, outline:'none', width:'100%',
                    border:'1.5px solid '+(g[field]!==''&&+g[field]<10?'#F09595':'var(--g1)'),
                    background: g[field]!==''&&+g[field]<10?'#FFF8F8':'white',
                    color: g[field]!==''&&+g[field]<10?'var(--red)':'var(--g3)' }} />
              ))}
              <div style={{ textAlign:'center', fontWeight:700, fontSize:15, padding:'7px 4px', borderRadius:8, background:avgBg, color:mention.color }}>
                {avg ?? '-'}
              </div>
              <div style={{ textAlign:'center', fontSize:11, fontWeight:700, color:mention.color }}>
                {mention.label}
              </div>
            </div>
          );
        })}
        {students.length === 0 && (
          <div style={{ padding:24, textAlign:'center', color:'var(--g2)' }}>Aucun eleve</div>
        )}
      </div>
    </div>
  );
}
