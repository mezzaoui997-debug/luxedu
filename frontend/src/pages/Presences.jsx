import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Presences() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/students').then(r => {
      setStudents(r.data);
      const init = {};
      r.data.forEach(s => { init[s.id] = 'PRESENT'; });
      setAttendance(init);
    });
  }, []);

  const cycle = (id) => {
    const order = ['PRESENT','ABSENT','LATE'];
    const cur = order.indexOf(attendance[id]);
    setAttendance({...attendance, [id]: order[(cur+1)%3]});
  };

  const save = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id] || 'PRESENT',
        date: today
      }));
      await api.post('/attendance', { records });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) {
      alert('Erreur: ' + err.message);
    } finally { setSaving(false); }
  };

  const colors = { PRESENT: { bg:'#EAF3DE', color:'#3B6D11', label:'✓ Présent' }, ABSENT: { bg:'#FCEBEB', color:'#A32D2D', label:'✗ Absent' }, LATE: { bg:'#FAEEDA', color:'#854F0B', label:'⏰ Retard' } };

  return (
    <div style={{ padding:22 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Présences</div>
        <div style={{ fontSize:13, color:'#888780' }}>Appel du {new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <button onClick={() => { const a={}; students.forEach(s => a[s.id]='PRESENT'); setAttendance(a); }}
          style={{ background:'#F5F5F3', border:'1px solid #E8E6E0', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Tous présents
        </button>
        <button onClick={save} disabled={saving}
          style={{ background:'#042C53', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer', marginLeft:'auto' }}>
          {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer & Notifier WA'}
        </button>
      </div>
      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0', padding:8 }}>
        <div style={{ fontSize:12, color:'#888780', padding:'8px 12px', marginBottom:4 }}>Cliquez sur le bouton pour changer le statut</div>
        {students.map(s => (
          <div key={s.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 8px', borderBottom:'1px solid #F5F5F3' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
              {s.firstName[0]}{s.lastName[0]}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
              <div style={{ fontSize:11, color:'#888780' }}>{s.massar}</div>
            </div>
            <button onClick={() => cycle(s.id)}
              style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700, fontSize:12, background: colors[attendance[s.id]]?.bg, color: colors[attendance[s.id]]?.color }}>
              {colors[attendance[s.id]]?.label}
            </button>
          </div>
        ))}
        {students.length === 0 && <div style={{ padding:24, textAlign:'center', color:'#888780' }}>Aucun élève — ajoutez des élèves d'abord</div>}
      </div>
    </div>
  );
}
