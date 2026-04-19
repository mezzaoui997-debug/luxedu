import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Bulletins() {
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState(1);

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  const openBulletin = async (studentId) => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://luxedu-production.up.railway.app/api/bulletin/' + studentId + '/' + semester, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const html = await res.text();
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  return (
    <div style={{ padding:22 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'#042C53', marginBottom:2 }}>Bulletins PDF</div>
        <div style={{ fontSize:13, color:'#888780' }}>Format conforme MEN Maroc · Generation en 1 clic</div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <select value={semester} onChange={e => setSemester(+e.target.value)}
          style={{ padding:'9px 13px', border:'1px solid #E8E6E0', borderRadius:8, fontSize:13, outline:'none', background:'white' }}>
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
        <button onClick={() => students.forEach(s => openBulletin(s.id))}
          style={{ background:'#EF9F27', color:'#633806', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Generer tous les bulletins
        </button>
      </div>
      <div style={{ background:'white', borderRadius:10, border:'1px solid #E8E6E0' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#F5F5F3' }}>
              {['Eleve','Code Massar','Classe','Actions'].map(h => (
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#888780', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom:'1px solid #F5F5F3' }}>
                <td style={{ padding:'11px 12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'#E6F1FB', color:'#0C447C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                  </div>
                </td>
                <td style={{ padding:'11px 12px', fontFamily:'monospace', color:'#042C53', fontSize:12 }}>{s.massar}</td>
                <td style={{ padding:'11px 12px', color:'#888780' }}>{s.class?.name || '-'}</td>
                <td style={{ padding:'11px 12px' }}>
                  <button onClick={() => openBulletin(s.id)}
                    style={{ background:'#042C53', color:'white', border:'none', borderRadius:6, padding:'6px 14px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    Voir bulletin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
