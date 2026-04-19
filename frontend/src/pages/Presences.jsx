import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Presences() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState('all');

  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const todayISO = new Date().toISOString().split('T')[0];

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

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const save = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id] || 'PRESENT',
        date: todayISO
      }));
      await api.post('/attendance', { records });
      const absents = students.filter(s => attendance[s.id] === 'ABSENT');
      if (absents.length > 0) {
        for (const s of absents) {
          if (s.parentPhone) {
            try {
              await api.post('/whatsapp/absence', { studentId: s.id, date: todayISO });
            } catch {}
          }
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) { alert('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const STATUS = {
    PRESENT: { bg:'var(--greenl)', color:'var(--green)', border:'#97C459', label:'✓ Present', short:'P' },
    ABSENT:  { bg:'var(--redl)',   color:'var(--red)',   border:'#F09595', label:'✗ Absent',  short:'A' },
    LATE:    { bg:'var(--amberl)', color:'var(--amber)', border:'#FAC775', label:'⏰ Retard',  short:'R' }
  };

  const counts = {
    present: students.filter(s => attendance[s.id] === 'PRESENT').length,
    absent: students.filter(s => attendance[s.id] === 'ABSENT').length,
    late: students.filter(s => attendance[s.id] === 'LATE').length,
  };

  const filtered = students.filter(s => {
    if (filter === 'all') return true;
    return attendance[s.id] === filter.toUpperCase();
  });

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>Presences</div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>Appel du {today}</div>
      </div>

      <div className="metrics" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        <div className="metric" onClick={() => setFilter('present')} style={{ borderColor: filter==='present'?'var(--green)':'' }}>
          <div className="mic" style={{ background:'var(--greenl)' }}>✓</div>
          <div className="mlbl">Presents</div>
          <div className="mval" style={{ color:'var(--green)' }}>{counts.present}</div>
          <div className="msub">{students.length>0?Math.round(counts.present/students.length*100):0}% de la classe</div>
        </div>
        <div className="metric" onClick={() => setFilter('absent')} style={{ borderColor: filter==='absent'?'var(--red)':'' }}>
          <div className="mic" style={{ background:'var(--redl)' }}>✗</div>
          <div className="mlbl">Absents</div>
          <div className="mval" style={{ color:'var(--red)' }}>{counts.absent}</div>
          <div className="msub">{counts.absent > 0 ? 'Parents a notifier' : 'Aucune absence'}</div>
        </div>
        <div className="metric" onClick={() => setFilter('late')} style={{ borderColor: filter==='late'?'var(--amber)':'' }}>
          <div className="mic" style={{ background:'var(--amberl)' }}>⏰</div>
          <div className="mlbl">Retards</div>
          <div className="mval" style={{ color:'var(--amber)' }}>{counts.late}</div>
          <div className="msub">{counts.late > 0 ? 'A justifier' : 'Aucun retard'}</div>
        </div>
      </div>

      {counts.absent > 0 && (
        <div style={{ background:'var(--redl)', border:'1px solid #F09595', borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:11 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--red)' }}>{counts.absent} absence(s) non justifiee(s)</div>
            <div style={{ fontSize:12, color:'var(--g2)' }}>Les parents seront notifies automatiquement sur WhatsApp</div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', gap:6 }}>
          {['all','present','absent','late'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="btn btn-sm"
              style={{ background: filter===f?'var(--navy)':'white', color: filter===f?'white':'var(--g3)', border:'1px solid '+(filter===f?'var(--navy)':'var(--g1)') }}>
              {f==='all'?'Tous':f==='present'?'Presents':f==='absent'?'Absents':'Retards'}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
          <button className="btn btn-out btn-sm" onClick={() => markAll('PRESENT')}>Tous presents</button>
          <button className="btn btn-navy" onClick={save} disabled={saving}>
            {saving ? 'Enregistrement...' : saved ? '✓ Enregistre ! WA envoye' : 'Enregistrer & Notifier WA'}
          </button>
        </div>
      </div>

      <div className="card cp">
        <div style={{ fontSize:12, color:'var(--g2)', marginBottom:12, padding:'4px 0' }}>
          Cliquez sur le bouton pour changer le statut · <strong>Vert</strong> = Present · <strong>Rouge</strong> = Absent · <strong>Orange</strong> = Retard
        </div>
        {filtered.map(s => {
          const st = STATUS[attendance[s.id]] || STATUS.PRESENT;
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 8px', borderBottom:'1px solid #F5F5F3', transition:'background .12s', borderRadius:7 }}
              onMouseOver={e => e.currentTarget.style.background='#FAFAF8'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div className="av" style={{ width:36, height:36, fontSize:12, background:'#E6F1FB', color:'#0C447C', flexShrink:0 }}>
                {s.firstName[0]}{s.lastName[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                <div style={{ fontSize:11, color:'var(--g2)' }}>{s.massar} {s.parentPhone ? '· ' + s.parentPhone : ''}</div>
              </div>
              <button onClick={() => cycle(s.id)}
                style={{ padding:'8px 16px', borderRadius:8, border:'1px solid '+st.border, cursor:'pointer', fontWeight:700, fontSize:12, background:st.bg, color:st.color, transition:'all .15s', minWidth:100 }}>
                {st.label}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:24, textAlign:'center', color:'var(--g2)' }}>Aucun eleve dans cette categorie</div>
        )}
      </div>
    </div>
  );
}
