import { useRef, useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

function BarChart() {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chart.current) chart.current.destroy();
    chart.current = new window.Chart(ref.current.getContext('2d'), {
      type:'bar',
      data:{ labels:['6eme Exc.','5eme A','5eme B','4eme A','3eme Bac'], datasets:[
        { label:'Semestre 1', data:[16.8,14.5,13.9,13.2,11.8], backgroundColor:'#3b82f6', borderRadius:4 },
        { label:'Semestre 2', data:[17.6,15.1,14.4,13.8,12.1], backgroundColor:'#f59e0b', borderRadius:4 }
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:11 }, color:'#6b7280' } }, y:{ min:8, max:20, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{ size:11 }, color:'#6b7280' } } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, []);
  return <canvas ref={ref} />;
}

function DonutChart() {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chart.current) chart.current.destroy();
    chart.current = new window.Chart(ref.current.getContext('2d'), {
      type:'doughnut',
      data:{ datasets:[{ data:[22,45,18,15], backgroundColor:['#22c55e','#3b82f6','#f59e0b','#ef4444'], borderWidth:0 }] },
      options:{ cutout:'60%', responsive:false, plugins:{ legend:{ display:false }, tooltip:{ enabled:false } } }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, []);
  return <canvas ref={ref} width={160} height={160} />;
}

export default function Rapports() {
  const [loaded, setLoaded] = useState(!!window.Chart);
  useEffect(() => {
    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
      s.onload = () => setLoaded(true);
      document.head.appendChild(s);
    }
  }, []);

  const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Rapports & statistiques</h2>
        <p style={{ fontSize:12, color:'#6b7280' }}>Analyses de performance · 2025-2026</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:14, marginBottom:14 }}>
        <div style={C}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Evolution S1 vs S2</span>
          </div>
          <div style={{ display:'flex', gap:16, marginBottom:12 }}>
            {[['#3b82f6','Semestre 1'],['#f59e0b','Semestre 2']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }}></div>
                <span style={{ fontSize:11, color:'#6b7280' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ height:200 }}>{loaded && <BarChart />}</div>
        </div>
        <div style={C}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Repartition des niveaux</div>
          <div style={{ position:'relative', width:160, height:160, margin:'0 auto 16px' }}>
            {loaded && <DonutChart />}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
            {[['#22c55e','Excellent (≥16)'],['#3b82f6','Bien (12-15)'],['#f59e0b','Passable (10-11)'],['#ef4444','Insuffisant (<10)']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:c }}></div>{l}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...C }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Performances par matiere · <strong>6eme Excellence</strong></div>
        {[['Mathematiques',92,'#3b82f6',18.4],['Sciences',84,'#22c55e',16.8],['Francais',78,'#3b82f6',15.6],['Arabe',76,'#8b5cf6',15.2],['Anglais',70,'#f59e0b',14.0],['Histoire-Geo',65,'#6b7280',13.0]].map(([n,pct,c,v]) => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, fontSize:13 }}>
            <span style={{ width:110, color:'#6b7280' }}>{n}</span>
            <div style={{ flex:1, height:8, background:'#f1f4f9', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:4, background:c, width:pct+'%' }}></div>
            </div>
            <span style={{ width:36, textAlign:'right', fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
