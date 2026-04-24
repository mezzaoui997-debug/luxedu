import { useState } from 'react';
import useAuthStore from '../store/authStore';
export default function Arabic() {
  const { school } = useAuthStore();
  const [ar, setAr] = useState(false);
  return (
    <div className="page-enter" dir={ar?'rtl':'ltr'}>
      <div className="ph"><h1>{ar?'واجهة عربية — دعم RTL':'Support Arabe — الواجهة العربية'}</h1><p>{ar?'نظام إدارة مدرسي متكامل':'Interface bilingue FR/AR avec support complet RTL'}</p></div>
      <div style={{ background:'var(--navy)',borderRadius:10,padding:20,marginBottom:16 }}>
        <div style={{ fontSize:14,fontWeight:700,color:'white',marginBottom:14 }}>🌐 {ar?'تفعيل اللغة العربية':'Activez la langue arabe'}</div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.08)',borderRadius:10,padding:'14px 16px',marginBottom:14 }}>
          <div><div style={{ fontSize:13,fontWeight:700,color:'white' }}>{ar?'الواجهة العربية (RTL)':'Interface arabe (RTL)'}</div><div style={{ fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:2 }}>Bascule tout le systeme en arabe</div></div>
          <button onClick={()=>setAr(!ar)} style={{ width:46,height:26,borderRadius:13,border:'none',cursor:'pointer',background:ar?'#25D366':'rgba(255,255,255,0.2)',position:'relative',transition:'background .2s' }}>
            <div style={{ width:20,height:20,borderRadius:'50%',background:'white',position:'absolute',top:3,transition:'left .2s',left:ar?22:3 }}></div>
          </button>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
          {[{v:'347',l:ar?'التلاميذ':'Eleves'},{v:'94%',l:ar?'نسبة الحضور':'Presence'},{v:'14.7',l:ar?'المعدل العام':'Moyenne'},{v:'18',l:ar?'متأخرة':'Retards'}].map((m,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.08)',borderRadius:10,padding:14,textAlign:'center' }}>
              <div style={{ fontSize:22,fontWeight:700,color:'white' }}>{m.v}</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.45)',marginTop:4 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
        <div className="card cp">
          <div className="ch"><div className="ct">{ar?'معاينة الواجهة':'Apercu interface RTL'}</div></div>
          <div style={{ background:'white',borderRadius:10,padding:16,direction:'rtl',textAlign:'right',lineHeight:2,fontFamily:"'Segoe UI',Tahoma,Arial,sans-serif" }}>
            <h3 style={{ fontSize:16,fontWeight:700,color:'var(--navy)',marginBottom:10 }}>لوحة تحكم المدير</h3>
            {[['اسم المدرسة',school?.name||'مدرسة التميز'],['السنة الدراسية','2025 – 2026'],['عدد التلاميذ','347 تلميذ'],['المستحقات','23,400 درهم']].map(([l,v],i)=>(
              <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--g1)' }}>
                <span style={{ color:'var(--g2)' }}>{l}</span>
                <span style={{ fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card cp">
          <div className="ch"><div className="ct">{ar?'النتائج بالعربية':'Bulletin en arabe'}</div></div>
          <div style={{ background:'var(--navy)',color:'white',padding:14,borderRadius:8,marginBottom:12,textAlign:'center',direction:'rtl' }}>
            <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>مدرسة التميز - الدار البيضاء</div>
            <div style={{ fontSize:16,fontWeight:700,marginTop:8,color:'var(--gold)' }}>كشف النقط — الفصل الثاني</div>
          </div>
          <div style={{ direction:'rtl',fontSize:13 }}>
            {[['اسم التلميذ','يوسف بنجلون'],['الرياضيات','19.2/20'],['اللغة العربية','17.2/20'],['المعدل العام','17.4/20']].map(([l,v],i)=>(
              <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--g1)' }}>
                <span style={{ color:'var(--g2)' }}>{l}</span>
                <span style={{ fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-navy" style={{ width:'100%',marginTop:12 }} onClick={()=>setAr(!ar)}>{ar?'Revenir au francais ←':'تفعيل الواجهة العربية ←'}</button>
        </div>
      </div>
    </div>
  );
}
