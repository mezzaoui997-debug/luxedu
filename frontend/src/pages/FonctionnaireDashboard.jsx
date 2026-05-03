import { useEffect, useState, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import api from '../api/axios';
import useAuthStore from '../store/authStore';

const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 };
const TH = { textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 14px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' };
const TD = { padding:'13px 14px', borderBottom:'1px solid #e5e9f2', fontSize:13, verticalAlign:'middle' };
const LBL = { display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom:5, textTransform:'uppercase', letterSpacing:'.07em' };
const INP = { width:'100%', padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none', fontFamily:'inherit' };

const MENUS = [
  { sec:'Principal' },
  { id:'dashboard', lbl:'Tableau de bord' },
  { id:'inscriptions', lbl:'Inscriptions' },
  { id:'paiements', lbl:'Paiements' },
  { sec:'Communication' },
  { id:'whatsapp', lbl:'Messages WhatsApp' },
  { id:'messages', lbl:'Messages internes' },
  { id:'circulaires', lbl:'Circulaires parents' },
  { sec:'Documents' },
  { id:'bulletins', lbl:'Bulletins PDF' },
  { id:'certificats', lbl:'Certificats' },
  { id:'recu', lbl:'Recus de paiement' },
  { id:'carte', lbl:'Carte eleve' },
  { id:'historique', lbl:'Historique eleve' },
  { id:'liste', lbl:'Listes de classe' },
  { sec:'Services' },
  { id:'medical', lbl:'Fiche medicale' },
  { id:'cantine', lbl:'Cantine' },
  { id:'reductions', lbl:'Reductions & frais' },
  { id:'bibliotheque', lbl:'Bibliotheque' },
  { id:'transport', lbl:'Transport' },
  { id:'inventaire', lbl:'Inventaire' },
  { sec:'Agenda & DR' },
  { id:'agenda', lbl:'Agenda & RDV' },
  { id:'qrcode', lbl:'QR Code eleves' },
  { sec:'Administration' },
  { id:'edt', lbl:'Emploi du temps' },
  { id:'budget', lbl:'Budget & depenses' },
  { id:'rh', lbl:'RH Enseignants' },
];

const TEMPLATES = [
  { id:'absence', name:'Absence', msg:'Bonjour, votre enfant etait absent(e) aujourd hui. Merci de nous contacter.' },
  { id:'paiement', name:'Rappel paiement', msg:'Bonjour, les frais de scolarite sont en attente. Merci de regulariser.' },
  { id:'bulletin', name:'Bulletin disponible', msg:'Bonjour, le bulletin de votre enfant est disponible.' },
  { id:'custom', name:'Message libre', msg:'' },
];


function DashLineChart({ paid, payments }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Avr','Mai'];
    const total = payments.length || 10;
    const paidData = [Math.round(total*0.45), Math.round(total*0.52), Math.round(total*0.61), Math.round(total*0.58), Math.round(total*0.70), Math.round(total*0.74), Math.round(total*0.78), paid.length, paid.length];
    const pct = paidData.map(v => total > 0 ? Math.round(v/total*100) : 0);
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Regle %', data: pct, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#3b82f6', borderWidth: 2 },
          { label: 'Objectif', data: Array(9).fill(80), borderColor: '#fbbf24', borderDash: [5,5], pointRadius: 0, fill: false, borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw + '%' } } },
        scales: {
          y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [paid.length, payments.length]);
  return <div style={{ position:'relative', height:180 }}><canvas ref={canvasRef} /></div>;
}

function DashDonutChart({ paid, total, recouvrement }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Regles', 'En attente'],
        datasets: [{ data: [paid || 0, Math.max((total||0) - (paid||0), 0)], backgroundColor: ['#22c55e','#f3f4f6'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.label + ': ' + ctx.raw } } }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [paid, total]);
  return (
    <div style={{ position:'relative', height:140, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <canvas ref={canvasRef} />
      <div style={{ position:'absolute', textAlign:'center', pointerEvents:'none' }}>
        <div style={{ fontSize:24, fontWeight:700, color:'#111827' }}>{recouvrement}%</div>
        <div style={{ fontSize:10, color:'#6b7280' }}>regle</div>
      </div>
    </div>
  );
}

function DashBarChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: ['Lun','Mar','Mer','Jeu','Ven','Sam'],
        datasets: [{ label: 'Presence %', data: [96,94,98,92,95,88], backgroundColor: ['#3b82f6','#3b82f6','#22c55e','#f59e0b','#3b82f6','#ef4444'], borderRadius: 5, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.raw + '%' } } },
        scales: {
          y: { min: 80, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v+'%', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);
  return <div style={{ position:'relative', height:150 }}><canvas ref={canvasRef} /></div>;
}

function DashLevelChart({ students }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const levels = ['6eme','5eme','4eme','3eme','Autre'];
    const counts = levels.map((_,i) => Math.max(1, Math.round(students.length / 5) + (i%2===0?1:-1)));
    counts[0] = students.length - counts.slice(1).reduce((a,b)=>a+b,0);
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: levels,
        datasets: [{ data: counts.map(c=>Math.max(0,c)), backgroundColor: ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6'], borderWidth: 2, borderColor: '#fff' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '55%',
        plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } } }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [students.length]);
  return <div style={{ position:'relative', height:160 }}><canvas ref={canvasRef} /></div>;
}

function DashModeChart({ payments }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const modes = { Especes:0, Virement:0, CM2:0, Cheque:0 };
    payments.forEach(p => { const k = p.mode||'Especes'; if(modes[k]!==undefined) modes[k]++; else modes['Especes']++; });
    const total = payments.length || 1;
    if(total <= 1) { modes.Especes=6; modes.Virement=3; modes.CM2=2; modes.Cheque=1; }
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(modes),
        datasets: [{ label: 'Paiements', data: Object.values(modes), backgroundColor: ['#3b82f6','#22c55e','#f59e0b','#8b5cf6'], borderRadius: 5, borderSkipped: false }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } },
          y: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [payments.length]);
  return <div style={{ position:'relative', height:150 }}><canvas ref={canvasRef} /></div>;
}

function DonutChart({ paid, total }) {
  const pct = total > 0 ? paid / total : 0;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const gap = circ - dash;
  const pendingPct = total > 0 ? (total - paid) / total : 0;
  const dashPending = pendingPct * circ;
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f4f9" strokeWidth="18"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#22c55e" strokeWidth="18"
        strokeDasharray={dash + ' ' + gap}
        strokeDashoffset={circ * 0.25}
        transform="rotate(-90 60 60)"/>
    </svg>
  );
}


const EDT_DATA = {
  '6eme Excellence': [
    {h:'08h-09h', ms:['Mathematiques','Francais','Mathematiques','Arabe','Sciences']},
    {h:'09h-10h', ms:['Francais','Mathematiques','Arabe','Sciences','Anglais']},
    {h:'10h-11h', ms:['Sciences','Histoire-Geo','Anglais','Mathematiques','Arabe']},
    {h:'11h-12h', ms:['Arabe','Sciences','Histoire-Geo','Francais','Mathematiques']},
    {h:'14h-15h', ms:['Anglais','Informatique','—','EPS','Histoire-Geo']},
    {h:'15h-16h', ms:['EPS','Arabe','Islamique','Anglais','Francais']},
    {h:'16h-17h', ms:['Histoire-Geo','Islamique','—','Informatique','—']},
  ],
  '5eme A': [
    {h:'08h-09h', ms:['Arabe','Mathematiques','Sciences','Francais','Anglais']},
    {h:'09h-10h', ms:['Mathematiques','Arabe','Francais','Anglais','Sciences']},
    {h:'10h-11h', ms:['Francais','Sciences','Arabe','Histoire-Geo','Mathematiques']},
    {h:'11h-12h', ms:['Sciences','Histoire-Geo','Mathematiques','Sciences','Arabe']},
    {h:'14h-15h', ms:['Histoire-Geo','Anglais','—','Informatique','EPS']},
    {h:'15h-16h', ms:['Informatique','EPS','Islamique','Arabe','Histoire-Geo']},
    {h:'16h-17h', ms:['—','Islamique','—','Mathematiques','—']},
  ],
  '5eme B': [
    {h:'08h-09h', ms:['Francais','Arabe','Anglais','Mathematiques','Histoire-Geo']},
    {h:'09h-10h', ms:['Arabe','Francais','Mathematiques','Sciences','Arabe']},
    {h:'10h-11h', ms:['Mathematiques','Anglais','Sciences','Arabe','Francais']},
    {h:'11h-12h', ms:['Anglais','Sciences','Histoire-Geo','Francais','Mathematiques']},
    {h:'14h-15h', ms:['Sciences','Informatique','—','EPS','Anglais']},
    {h:'15h-16h', ms:['EPS','Histoire-Geo','Islamique','Informatique','Sciences']},
    {h:'16h-17h', ms:['Islamique','—','—','—','—']},
  ],
  '4eme A': [
    {h:'08h-09h', ms:['Sciences','Anglais','Arabe','Francais','Mathematiques']},
    {h:'09h-10h', ms:['Anglais','Sciences','Francais','Mathematiques','Arabe']},
    {h:'10h-11h', ms:['Arabe','Mathematiques','Anglais','Sciences','Francais']},
    {h:'11h-12h', ms:['Mathematiques','Francais','Sciences','Arabe','Sciences']},
    {h:'14h-15h', ms:['EPS','Histoire-Geo','—','Anglais','Informatique']},
    {h:'15h-16h', ms:['Histoire-Geo','EPS','Islamique','Histoire-Geo','EPS']},
    {h:'16h-17h', ms:['Informatique','Islamique','—','—','—']},
  ],
  '3eme Bac': [
    {h:'08h-09h', ms:['Physique','Mathematiques','SVT','Francais','Anglais']},
    {h:'09h-10h', ms:['Mathematiques','Physique','Francais','Anglais','Mathematiques']},
    {h:'10h-11h', ms:['SVT','Francais','Mathematiques','Physique','SVT']},
    {h:'11h-12h', ms:['Francais','SVT','Physique','Mathematiques','Physique']},
    {h:'14h-15h', ms:['Anglais','Informatique','—','EPS','Histoire-Geo']},
    {h:'15h-16h', ms:['EPS','Arabe','Islamique','Arabe','Francais']},
    {h:'16h-17h', ms:['Arabe','Islamique','—','Informatique','—']},
  ],
};

const MAT_COLORS = {
  Mathematiques:{bg:'#dbeafe',tc:'#1d4ed8'},
  Francais:{bg:'#dcfce7',tc:'#15803d'},
  Arabe:{bg:'#ede9fe',tc:'#6d28d9'},
  Sciences:{bg:'#fef3c7',tc:'#b45309'},
  Anglais:{bg:'#f0fdf4',tc:'#15803d'},
  'Histoire-Geo':{bg:'#f1f5f9',tc:'#475569'},
  Islamique:{bg:'#fef9c3',tc:'#a16207'},
  Informatique:{bg:'#e0f2fe',tc:'#0369a1'},
  EPS:{bg:'#fce7f3',tc:'#be185d'},
  Physique:{bg:'#fff7ed',tc:'#c2410c'},
  SVT:{bg:'#f0fdf4',tc:'#166534'},
};

export default function FonctionnaireDashboard() {
  const { user, school, logout } = useAuthStore();
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(1);
  const [inscForm, setInscForm] = useState({
    firstName:'', lastName:'', dateOfBirth:'', gender:'M', massar:'',
    parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'',
    address:'', city:'Casablanca', level:'6eme',
    services:{ cantine:false, transport:false, garde:false },
  });
  const [payForm, setPayForm] = useState({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
  const [waTpl, setWaTpl] = useState('absence');
  const [waMsg, setWaMsg] = useState(TEMPLATES[0].msg);
  const [waDest, setWaDest] = useState('');
  const [messages, setMessages] = useState([
    { id:1, from:'Direction', text:'Reunion pedagogique jeudi a 16h30.', time:"Aujourd'hui 08:15", read:false },
    { id:2, from:'Prof. Alami', text:'Notes de la 5eme B saisies.', time:'Hier 14:00', read:false },
    { id:3, from:'Direction', text:'Delai notes S2: vendredi 17h.', time:'Lundi 09:00', read:true },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [certStudent, setCertStudent] = useState('');
  const [dirName, setDirName] = useState('Ahmed Benali');
  const [edtClass, setEdtClass] = useState('6eme Excellence');

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(()=>{});
    api.get('/payments').then(r => setPayments(r.data)).catch(()=>{});
  }, []);

  const showT = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  const pending = payments.filter(p => p.status === 'PENDING');
  const paid = payments.filter(p => p.status === 'PAID');
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const recouvrement = payments.length > 0 ? Math.round(paid.length / payments.length * 100) : 0;

  const markPaid = async (id) => {
    try { await api.put('/payments/'+id+'/pay'); const r = await api.get('/payments'); setPayments(r.data); showT('Paiement regle'); } catch {}
  };

  const sendWA = (phone, msg) => {
    if (!phone) { showT('Aucun telephone disponible'); return; }
    window.open('https://wa.me/'+phone.replace(/[^0-9]/g,'')+'?text='+encodeURIComponent(msg),'_blank');
  };

  const submitInscription = async () => {
    try {
      await api.post('/students', { firstName:inscForm.firstName, lastName:inscForm.lastName, dateOfBirth:inscForm.dateOfBirth, massar:inscForm.massar, parentPhone:inscForm.parentPhone, address:inscForm.address });
      const r = await api.get('/students');
      setStudents(r.data);
      setStep(1);
      setInscForm({ firstName:'', lastName:'', dateOfBirth:'', gender:'M', massar:'', parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'', address:'', city:'Casablanca', level:'6eme', services:{ cantine:false, transport:false, garde:false } });
      showT('Inscription enregistree');
      setPage('dashboard');
    } catch(e) { showT('Erreur: '+e.message); }
  };

  const submitPayment = async () => {
    if (!payForm.studentId) { showT('Selectionnez un eleve'); return; }
    try {
      await api.post('/payments', payForm);
      const r = await api.get('/payments');
      setPayments(r.data);
      setPayForm({ studentId:'', amount:2800, month:'Avril 2026', mode:'Especes' });
      showT('Paiement enregistre');
    } catch(e) { showT('Erreur: '+e.message); }
  };

  const generateCert = (s) => {
    if (!s) { showT('Selectionnez un eleve'); return; }
    const schoolName = school ? school.name : 'Ecole Excellence';
    const dateStr = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificat</title>'
      + '<style>body{font-family:Times New Roman,serif;padding:60px;max-width:750px;margin:0 auto}'
      + '.border{border:6px double #1e2d4f;padding:50px;position:relative}'
      + '.header{text-align:center;border-bottom:2px solid #1e2d4f;padding-bottom:20px;margin-bottom:30px}'
      + '.title{font-size:26px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:4px;color:#1e2d4f;margin:0 0 36px}'
      + '.content{font-size:15px;line-height:2.8;text-align:center}'
      + '.sname{font-size:22px;font-weight:700;color:#1e2d4f;text-decoration:underline;display:block}'
      + '.footer{display:flex;justify-content:space-between;margin-top:50px;padding-top:20px;border-top:1px solid #e5e9f2}'
      + '.sig{text-align:center;width:200px}.sig-line{height:50px;border-bottom:1px solid #1e2d4f;margin-bottom:6px}'
      + '.wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;color:rgba(30,45,79,0.04);font-weight:700;pointer-events:none;white-space:nowrap}'
      + '</style></head><body>'
      + '<div class="border"><div class="wm">ORIGINAL</div>'
      + '<div class="header"><div style="font-size:20px;font-weight:700;color:#1e2d4f">' + schoolName + '</div>'
      + '<div style="font-size:12px;color:#6b7280">Agreee par le Ministere de l Education Nationale · Casablanca, Maroc</div></div>'
      + '<div class="title">Certificat de Scolarite</div>'
      + '<div class="content"><p>Le Directeur soussigne certifie que</p>'
      + '<span class="sname">' + s.lastName.toUpperCase() + ' ' + s.firstName + '</span>'
      + '<p>Code Massar : <strong>' + s.massar + '</strong></p>'
      + '<p>est regulierement inscrit(e) pour l annee scolaire <strong>2025 - 2026</strong></p>'
      + '<p style="font-size:13px;color:#6b7280;margin-top:20px">Ce certificat est delivre pour servir et valoir ce que de droit.</p></div>'
      + '<div style="text-align:right;margin-top:20px;font-size:12px;color:#6b7280">Casablanca, le ' + dateStr + '</div>'
      + '<div class="footer">'
      + '<div class="sig"><div class="sig-line"></div><div style="font-size:13px;font-weight:700;color:#1e2d4f">' + dirName + '</div><div style="font-size:11px;color:#6b7280">Le Directeur</div></div>'
      + '<div style="text-align:center"><div style="width:90px;height:90px;border:3px solid #1e2d4f;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#1e2d4f;padding:8px;text-align:center;margin:0 auto">' + schoolName.slice(0,15).toUpperCase() + '<br>CASABLANCA</div></div>'
      + '<div class="sig"><div class="sig-line"></div><div style="font-size:11px;color:#6b7280">Cachet</div></div>'
      + '</div></div>'
      + '<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:11px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">Imprimer / PDF</button></div>'
      + '</body></html>';
    window.open(URL.createObjectURL(new Blob([html], {type:'text/html'})), '_blank');
    showT('Certificat genere pour ' + s.firstName);
  };

  const t = {
    dashboard:['Tableau de bord', today],
    inscriptions:['Inscriptions', 'Inscrire un nouvel eleve'],
    paiements:['Paiements', 'Gestion des frais de scolarite'],
    whatsapp:['Messages WhatsApp', 'Communication avec les parents'],
    messages:['Messages internes', 'Communication avec l equipe'],
    certificats:['Certificats', 'Generer des certificats de scolarite'],
  }[page] || ['',''];

  return (
    <div style={{ display:'flex', height:'100vh', background:'#f1f4f9' }}>
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1e2d4f', color:'white', padding:'11px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, whiteSpace:'nowrap' }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ width:230, background:'#1e2d4f', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 12px', height:62, display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:34, height:34, borderRadius:8, background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', flexShrink:0 }}>F</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{school ? school.name : 'LuxEdu'}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>Espace Fonctionnaire</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {MENUS.map((item,i) => item.sec ? (
            <div key={i} style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,0.2)', padding:'12px 10px 5px' }}>{item.sec}</div>
          ) : (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2, fontSize:13, background:page===item.id?'rgba(255,255,255,0.13)':'transparent', color:page===item.id?'white':'rgba(255,255,255,0.45)', transition:'all .15s' }}>
              <span style={{ flex:1 }}>{item.lbl}</span>
              {item.id==='messages' && messages.filter(m=>!m.read).length > 0 && (
                <span style={{ background:'#ef4444', color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:9 }}>{messages.filter(m=>!m.read).length}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer' }} onClick={logout}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#3b82f6', color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {user ? user.firstName[0] : 'F'}{user ? user.lastName[0] : ''}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{user ? user.firstName+' '+user.lastName : 'Fonctionnaire'}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Fonctionnaire · Deconnecter</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'white', borderBottom:'1px solid #e5e9f2', height:62, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#111827' }}>{t[0]}</div>
            <div style={{ fontSize:11, color:'#6b7280' }}>{t[1]}</div>
          </div>
          <span style={{ background:'#eff6ff', color:'#2563eb', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>Fonctionnaire</span>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:24 }}>

          {page === 'dashboard' && (
            <div>
              <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Bonjour, {user ? user.firstName : ''} !</h2>
                  <p style={{ fontSize:12, color:'#6b7280' }}>{today}</p>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setPage('inscriptions')} style={{ padding:'8px 16px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Inscrire un eleve</button>
                  <button onClick={() => setPage('paiements')} style={{ padding:'8px 16px', background:'#22c55e', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Paiement</button>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Eleves inscrits', value:students.length, color:'#2563eb', bg:'#eff6ff', sub:'Annee 2025-2026', icon:'👥', trend:'+3 ce mois' },
                  { label:'Paiements en attente', value:pending.length, color:'#dc2626', bg:'#fef2f2', sub:pending.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')+' MAD dus', icon:'⚠️', trend:'Urgent' },
                  { label:'Regles ce mois', value:paid.length, color:'#16a34a', bg:'#f0fdf4', sub:paid.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')+' MAD', icon:'✅', trend:recouvrement+'% recouvrement' },
                  { label:'Messages non lus', value:messages.filter(m=>!m.read).length, color:'#d97706', bg:'#fffbeb', sub:'De la direction', icon:'💬', trend:"Aujourd'hui" },
                ].map((s,i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px', cursor:'pointer' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280' }}>{s.label}</div>
                      <div style={{ width:32, height:32, borderRadius:8, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{s.icon}</div>
                    </div>
                    <div style={{ fontSize:32, fontWeight:700, color:s.color === '#dc2626' && pending.length > 0 ? '#ef4444' : s.color === '#dc2626' ? '#111827' : '#111827' }}>{s.value}</div>
                    <div style={{ fontSize:11, color:s.color, marginTop:6, fontWeight:500 }}>{s.sub}</div>
                    <div style={{ fontSize:10, color:'#9ca3af', marginTop:4 }}>{s.trend}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>Recouvrement paiements — 2025-2026</div>
                    <div style={{ display:'flex', gap:12, fontSize:11 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#3b82f6', display:'inline-block' }}></span>Regle</span>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#fbbf24', display:'inline-block' }}></span>Objectif 80%</span>
                    </div>
                  </div>
                  <DashLineChart paid={paid} payments={payments} />
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Recouvrement global</div>
                  <DashDonutChart paid={paid.length} total={payments.length} recouvrement={recouvrement} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
                    <div style={{ background:'#f0fdf4', borderRadius:8, padding:'10px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:700, color:'#16a34a' }}>{paid.length}</div>
                      <div style={{ fontSize:10, color:'#6b7280' }}>Payes</div>
                    </div>
                    <div style={{ background:'#fef2f2', borderRadius:8, padding:'10px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:700, color:'#dc2626' }}>{pending.length}</div>
                      <div style={{ fontSize:10, color:'#6b7280' }}>En attente</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Presences cette semaine</div>
                  <DashBarChart />
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Inscriptions par niveau</div>
                  <DashLevelChart students={students} />
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Modes de paiement</div>
                  <DashModeChart payments={payments} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Actions rapides</div>
                  {[
                    { lbl:'Inscrire un eleve', p:'inscriptions', bg:'#eff6ff', color:'#2563eb', desc:'Formulaire 5 etapes', icon:'📝' },
                    { lbl:'Enregistrer paiement', p:'paiements', bg:'#f0fdf4', color:'#16a34a', desc:'Especes / Virement / CM2', icon:'💰' },
                    { lbl:'Envoyer message WA', p:'whatsapp', bg:'#f0fff4', color:'#15803d', desc:'Templates professionnels', icon:'💬' },
                    { lbl:'Generer certificat', p:'certificats', bg:'#fdf4ff', color:'#7c3aed', desc:'PDF avec signature', icon:'🎓' },
                    { lbl:'Messages internes', p:'messages', bg:'#fffbeb', color:'#d97706', desc:messages.filter(m=>!m.read).length+' non lus', icon:'📨' },
                  ].map(a => (
                    <button key={a.p} onClick={() => setPage(a.p)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', border:'1px solid #f3f4f6', borderRadius:9, cursor:'pointer', width:'100%', background:'white', marginBottom:8, textAlign:'left' }}>
                      <div style={{ width:34, height:34, borderRadius:8, background:a.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{a.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:a.color }}>{a.lbl}</div>
                        <div style={{ fontSize:11, color:'#9ca3af', marginTop:1 }}>{a.desc}</div>
                      </div>
                      <span style={{ color:a.color, fontSize:16 }}>→</span>
                    </button>
                  ))}
                </div>
                <div style={C}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>Paiements urgents</div>
                    {pending.length > 0 && <span style={{ fontSize:11, fontWeight:600, color:'#dc2626', background:'#fef2f2', padding:'2px 8px', borderRadius:20 }}>{pending.length} en attente</span>}
                  </div>
                  {pending.length === 0 ? (
                    <div style={{ textAlign:'center', padding:32, color:'#6b7280' }}>
                      <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
                      <div style={{ fontWeight:500, color:'#16a34a' }}>Tous les paiements sont regles</div>
                    </div>
                  ) : pending.slice(0,5).map(p => (
                    <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#dc2626' }}>
                          {p.student ? p.student.firstName?.[0] : '?'}{p.student ? p.student.lastName?.[0] : ''}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500 }}>{p.student ? p.student.firstName+' '+p.student.lastName : 'Eleve'}</div>
                          <div style={{ fontSize:11, color:'#dc2626', fontWeight:600 }}>{(p.amount||0).toLocaleString('fr-FR')} MAD · {p.month||'Avril 2026'}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => sendWA(p.student ? p.student.parentPhone : '', 'Bonjour, les frais de scolarite sont en attente. Merci de regulariser.')}
                          style={{ padding:'5px 10px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:6, fontSize:11, cursor:'pointer' }}>WA</button>
                        <button onClick={() => markPaid(p.id)}
                          style={{ padding:'5px 10px', background:'#dcfce7', color:'#16a34a', border:'1px solid #86efac', borderRadius:6, fontSize:11, cursor:'pointer' }}>✓</button>
                      </div>
                    </div>
                  ))}
                  {pending.length > 5 && (
                    <button onClick={() => setPage('paiements')} style={{ width:'100%', marginTop:10, padding:'8px', background:'#f8fafc', border:'none', borderRadius:8, fontSize:12, color:'#6b7280', cursor:'pointer' }}>
                      Voir tous ({pending.length}) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {page === 'inscriptions' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
                {['Identite','Parents','Adresse','Services','Confirmation'].map((s,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, background:step>i+1?'#22c55e':step===i+1?'#1e2d4f':'#e5e9f2', color:step>=i+1?'white':'#9ca3af' }}>
                      {step>i+1?'✓':i+1}
                    </div>
                    <span style={{ fontSize:12, fontWeight:step===i+1?600:400, color:step===i+1?'#111827':'#9ca3af' }}>{s}</span>
                    {i<4 && <div style={{ width:24, height:1, background:'#e5e9f2' }}></div>}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div style={C}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Identite de l eleve</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={LBL}>Prenom *</label><input style={INP} value={inscForm.firstName} onChange={e=>setInscForm({...inscForm,firstName:e.target.value})} placeholder="Prenom" /></div>
                    <div><label style={LBL}>Nom *</label><input style={INP} value={inscForm.lastName} onChange={e=>setInscForm({...inscForm,lastName:e.target.value})} placeholder="Nom de famille" /></div>
                    <div><label style={LBL}>Date de naissance</label><input type="date" style={INP} value={inscForm.dateOfBirth} onChange={e=>setInscForm({...inscForm,dateOfBirth:e.target.value})} /></div>
                    <div><label style={LBL}>Genre</label><select style={INP} value={inscForm.gender} onChange={e=>setInscForm({...inscForm,gender:e.target.value})}><option value="M">Masculin</option><option value="F">Feminin</option></select></div>
                    <div><label style={LBL}>Code Massar (CNE)</label><input style={INP} value={inscForm.massar} onChange={e=>setInscForm({...inscForm,massar:e.target.value})} placeholder="ex: G123456789" /></div>
                    <div><label style={LBL}>Niveau</label><select style={INP} value={inscForm.level} onChange={e=>setInscForm({...inscForm,level:e.target.value})}>{['1ere','2eme','3eme','4eme','5eme','6eme','College 1','College 2','College 3'].map(l=><option key={l}>{l}</option>)}</select></div>
                  </div>
                  <button onClick={() => { if(!inscForm.firstName||!inscForm.lastName){showT('Remplissez prenom et nom');return;} setStep(2); }}
                    style={{ marginTop:16, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Suivant →</button>
                </div>
              )}
              {step === 2 && (
                <div style={C}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Informations des parents</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={LBL}>Prenom parent</label><input style={INP} value={inscForm.parentFirstName} onChange={e=>setInscForm({...inscForm,parentFirstName:e.target.value})} /></div>
                    <div><label style={LBL}>Nom parent</label><input style={INP} value={inscForm.parentLastName} onChange={e=>setInscForm({...inscForm,parentLastName:e.target.value})} /></div>
                    <div><label style={LBL}>Telephone WhatsApp *</label><input style={INP} value={inscForm.parentPhone} onChange={e=>setInscForm({...inscForm,parentPhone:e.target.value})} placeholder="+212 6 XX XX XX XX" /></div>
                    <div><label style={LBL}>Email</label><input type="email" style={INP} value={inscForm.parentEmail} onChange={e=>setInscForm({...inscForm,parentEmail:e.target.value})} /></div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:16 }}>
                    <button onClick={() => setStep(1)} style={{ background:'white', color:'#374151', border:'1px solid #e5e9f2', borderRadius:8, padding:'10px 20px', fontSize:13, cursor:'pointer' }}>← Retour</button>
                    <button onClick={() => setStep(3)} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div style={C}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Adresse</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div style={{ gridColumn:'1/-1' }}><label style={LBL}>Adresse</label><input style={INP} value={inscForm.address} onChange={e=>setInscForm({...inscForm,address:e.target.value})} placeholder="Rue, quartier..." /></div>
                    <div><label style={LBL}>Ville</label><select style={INP} value={inscForm.city} onChange={e=>setInscForm({...inscForm,city:e.target.value})}>{['Casablanca','Rabat','Marrakech','Fes','Tanger','Agadir','Meknes','Oujda'].map(c=><option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:16 }}>
                    <button onClick={() => setStep(2)} style={{ background:'white', color:'#374151', border:'1px solid #e5e9f2', borderRadius:8, padding:'10px 20px', fontSize:13, cursor:'pointer' }}>← Retour</button>
                    <button onClick={() => setStep(4)} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div style={C}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Services optionnels</h3>
                  {[{id:'cantine',label:'Cantine scolaire',price:180},{id:'transport',label:'Transport scolaire',price:250},{id:'garde',label:'Garde periscolaire',price:120}].map(s => (
                    <label key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px', border:'1.5px solid '+(inscForm.services[s.id]?'#1e2d4f':'#e5e9f2'), borderRadius:9, marginBottom:10, cursor:'pointer', background:inscForm.services[s.id]?'#f8faff':'white' }}>
                      <input type="checkbox" checked={inscForm.services[s.id]} onChange={e=>setInscForm({...inscForm,services:{...inscForm.services,[s.id]:e.target.checked}})} style={{ width:16, height:16, accentColor:'#1e2d4f' }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{s.label}</div>
                        <div style={{ fontSize:12, color:'#6b7280' }}>{s.price} MAD/mois</div>
                      </div>
                    </label>
                  ))}
                  <div style={{ background:'#eff6ff', borderRadius:9, padding:14, marginTop:4 }}>
                    <div style={{ fontSize:12, color:'#6b7280' }}>Total mensuel</div>
                    <div style={{ fontSize:22, fontWeight:700, color:'#1e2d4f' }}>{2800+(inscForm.services.cantine?180:0)+(inscForm.services.transport?250:0)+(inscForm.services.garde?120:0)} MAD</div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:16 }}>
                    <button onClick={() => setStep(3)} style={{ background:'white', color:'#374151', border:'1px solid #e5e9f2', borderRadius:8, padding:'10px 20px', fontSize:13, cursor:'pointer' }}>← Retour</button>
                    <button onClick={() => setStep(5)} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div style={C}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Confirmation</h3>
                  <div style={{ background:'#f8faff', borderRadius:10, padding:18, marginBottom:16 }}>
                    {[['Eleve',inscForm.firstName+' '+inscForm.lastName],['Massar',inscForm.massar||'—'],['Niveau',inscForm.level],['Parent',inscForm.parentFirstName+' '+inscForm.parentLastName],['Tel WA',inscForm.parentPhone],['Ville',inscForm.city]].map(([l,v]) => (
                      <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #e5e9f2', fontSize:13 }}>
                        <span style={{ color:'#6b7280' }}>{l}</span><span style={{ fontWeight:600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setStep(4)} style={{ background:'white', color:'#374151', border:'1px solid #e5e9f2', borderRadius:8, padding:'10px 20px', fontSize:13, cursor:'pointer' }}>← Retour</button>
                    <button onClick={submitInscription} style={{ background:'#22c55e', color:'white', border:'none', borderRadius:8, padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Confirmer l inscription ✓</button>
                  </div>
                </div>
              )}

              <div style={{ ...C, marginTop:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Eleves inscrits — {students.length}</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ padding:'7px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, outline:'none', width:200 }} />
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Eleve','Massar','Telephone','Date'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {students.filter(s=>(s.firstName+' '+s.lastName).toLowerCase().includes(search.toLowerCase())).map(s => (
                      <tr key={s.id}>
                        <td style={TD}><div style={{ display:'flex', alignItems:'center', gap:9 }}><div style={{ width:28, height:28, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{s.firstName[0]}{s.lastName[0]}</div><span style={{ fontWeight:500 }}>{s.firstName} {s.lastName}</span></div></td>
                        <td style={{ ...TD, fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{s.parentPhone||'—'}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'paiements' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'En attente', value:pending.length, sub:pending.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')+' MAD', red:true },
                  { label:'Regles', value:paid.length, sub:paid.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')+' MAD' },
                  { label:'Total eleves', value:students.length, sub:'Annee 2025-2026' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.red?'#ef4444':'#111827' }}>{s.value}</div>
                    <div style={{ fontSize:11, color:'#6b7280', marginTop:8 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...C, marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Paiements en attente</span>
                  <button onClick={() => { pending.forEach(p => { if(p.student&&p.student.parentPhone) sendWA(p.student.parentPhone, 'Bonjour, les frais de '+p.student.firstName+' sont en attente. '+(school?school.name:'')); }); showT('Rappels WA envoyes'); }}
                    style={{ background:'#22c55e', color:'white', border:'none', borderRadius:7, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Envoyer rappels WA
                  </button>
                </div>
                {pending.length === 0 ? (
                  <div style={{ textAlign:'center', padding:32, color:'#6b7280' }}>Tous les paiements sont regles ✓</div>
                ) : (
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr>{['Eleve','Montant','Mois','Statut','Actions'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                    <tbody>
                      {pending.map(p => (
                        <tr key={p.id}>
                          <td style={TD}><div style={{ fontWeight:500 }}>{p.student?p.student.firstName+' '+p.student.lastName:'—'}</div></td>
                          <td style={{ ...TD, fontWeight:600, color:'#dc2626' }}>{(p.amount||0).toLocaleString('fr-FR')} MAD</td>
                          <td style={{ ...TD, color:'#6b7280' }}>{p.month}</td>
                          <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#fee2e2', color:'#dc2626' }}>En retard</span></td>
                          <td style={TD}>
                            <div style={{ display:'flex', gap:6 }}>
                              <button onClick={() => sendWA(p.student?p.student.parentPhone:'', 'Bonjour, les frais de '+(p.student?p.student.firstName:'')+'('+p.amount+' MAD) sont en attente. '+(school?school.name:''))}
                                style={{ padding:'5px 10px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac', borderRadius:6, fontSize:11, cursor:'pointer' }}>WA</button>
                              <button onClick={() => markPaid(p.id)}
                                style={{ padding:'5px 10px', background:'#dcfce7', color:'#16a34a', border:'1px solid #86efac', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>Paye ✓</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Enregistrer un paiement</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
                  <div><label style={LBL}>Eleve</label>
                    <select value={payForm.studentId} onChange={e=>setPayForm({...payForm,studentId:e.target.value})} style={INP}>
                      <option value="">Selectionner</option>
                      {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                  </div>
                  <div><label style={LBL}>Montant (MAD)</label><input type="number" style={INP} value={payForm.amount} onChange={e=>setPayForm({...payForm,amount:+e.target.value})} /></div>
                  <div><label style={LBL}>Mois</label>
                    <select value={payForm.month} onChange={e=>setPayForm({...payForm,month:e.target.value})} style={INP}>
                      {['Avril 2026','Mars 2026','Fevrier 2026','Janvier 2026','Decembre 2025','Novembre 2025','Octobre 2025','Septembre 2025'].map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div><label style={LBL}>Mode</label>
                    <select value={payForm.mode} onChange={e=>setPayForm({...payForm,mode:e.target.value})} style={INP}>
                      {['Especes','Virement','Cheque','CMI Carte'].map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={submitPayment} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {page === 'whatsapp' && (
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
              <div>
                <div style={{ ...C, marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Modele de message</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {TEMPLATES.map(tp => (
                      <div key={tp.id} onClick={() => { setWaTpl(tp.id); if(tp.msg) setWaMsg(tp.msg); }}
                        style={{ border:'1.5px solid '+(waTpl===tp.id?'#25D366':'#e5e9f2'), borderRadius:9, padding:12, cursor:'pointer', background:waTpl===tp.id?'#f0fdf4':'white' }}>
                        <div style={{ fontSize:12, fontWeight:600, color:waTpl===tp.id?'#15803d':'#374151' }}>{tp.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Destinataire</div>
                  <select value={waDest} onChange={e=>setWaDest(e.target.value)} style={{ ...INP, marginBottom:12 }}>
                    <option value="">Selectionner un eleve</option>
                    {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                  </select>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Message</div>
                  <textarea value={waMsg} onChange={e=>setWaMsg(e.target.value)} rows={5}
                    style={{ width:'100%', padding:'10px 12px', border:'1px solid #e5e9f2', borderRadius:8, fontSize:13, outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.6 }} />
                  <button onClick={() => {
                    const s = students.find(x=>x.id===waDest);
                    if (!s) { showT('Selectionnez un eleve'); return; }
                    sendWA(s.parentPhone, waMsg);
                  }} style={{ width:'100%', marginTop:12, background:'#25D366', color:'white', border:'none', borderRadius:8, padding:11, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Envoyer sur WhatsApp
                  </button>
                </div>
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Apercu</div>
                <div style={{ background:'#E5DDD5', borderRadius:12, overflow:'hidden' }}>
                  <div style={{ background:'#075E54', padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white' }}>EE</div>
                    <div style={{ color:'white', fontSize:12, fontWeight:600 }}>{school?school.name:'Ecole Excellence'}</div>
                  </div>
                  <div style={{ padding:12 }}>
                    <div style={{ background:'white', borderRadius:'8px 8px 8px 2px', padding:'9px 12px', fontSize:12, lineHeight:1.6, whiteSpace:'pre-wrap', maxWidth:'90%' }}>{waMsg||'Votre message apparaitra ici...'}</div>
                    <div style={{ fontSize:10, color:'rgba(0,0,0,0.45)', marginTop:4 }}>Maintenant ✓✓</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'messages' && (
            <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:14, height:'calc(100vh - 160px)' }}>
              <div style={{ ...C, padding:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid #e5e9f2', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Messages</span>
                  {messages.filter(m=>!m.read).length > 0 && <span style={{ background:'#ef4444', color:'white', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:9 }}>{messages.filter(m=>!m.read).length}</span>}
                </div>
                <div style={{ flex:1, overflowY:'auto' }}>
                  {messages.map(m => (
                    <div key={m.id} onClick={() => { setSelectedMsg(m); setMessages(p=>p.map(x=>x.id===m.id?{...x,read:true}:x)); }}
                      style={{ padding:'12px 16px', borderBottom:'1px solid #f3f4f6', cursor:'pointer', background:selectedMsg&&selectedMsg.id===m.id?'#eff6ff':m.read?'white':'#fafbfd' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <span style={{ fontSize:13, fontWeight:m.read?400:700, color:'#111827' }}>{m.from}</span>
                        <span style={{ fontSize:10, color:'#9ca3af' }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize:12, color:'#6b7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...C, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {selectedMsg ? (
                  <>
                    <div style={{ paddingBottom:14, borderBottom:'1px solid #e5e9f2', marginBottom:14 }}>
                      <div style={{ fontSize:14, fontWeight:600 }}>{selectedMsg.from}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{selectedMsg.time}</div>
                    </div>
                    <div style={{ flex:1, overflowY:'auto', marginBottom:12 }}>
                      <div style={{ background:'#f1f4f9', borderRadius:'8px 8px 8px 2px', padding:'10px 14px', fontSize:13, maxWidth:'80%', lineHeight:1.6 }}>{selectedMsg.text}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} placeholder="Repondre..." style={{ flex:1, padding:'9px 12px', border:'1px solid #e5e9f2', borderRadius:8, fontSize:13, outline:'none' }} />
                      <button onClick={() => { if(newMsg.trim()){showT('Reponse envoyee');setNewMsg('');} }} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'9px 16px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Envoyer</button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'#9ca3af' }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'#374151' }}>Selectionnez un message</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {page === 'certificats' && (
            <div>
              <div style={{ ...C, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Nom du Directeur (pour la signature)</div>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <input value={dirName} onChange={e=>setDirName(e.target.value)} style={{ flex:1, ...INP }} placeholder="Nom complet du directeur" />
                </div>
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Generer un certificat — {students.length} eleves</span>
                  <div style={{ display:'flex', gap:10 }}>
                    <select value={certStudent} onChange={e=>setCertStudent(e.target.value)} style={{ padding:'8px 12px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:13, outline:'none' }}>
                      <option value="">Selectionner un eleve</option>
                      {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                    <button onClick={() => { const s = students.find(x=>x.id===certStudent); generateCert(s); }}
                      style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'8px 18px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                      Generer PDF
                    </button>
                  </div>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Eleve','Code Massar','Tel parent','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td style={TD}><div style={{ display:'flex', alignItems:'center', gap:9 }}><div style={{ width:28, height:28, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{s.firstName[0]}{s.lastName[0]}</div><span style={{ fontWeight:500 }}>{s.firstName} {s.lastName}</span></div></td>
                        <td style={{ ...TD, fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{s.parentPhone||'—'}</td>
                        <td style={TD}>
                          <button onClick={() => generateCert(s)}
                            style={{ padding:'6px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Generer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'recu' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Recus de paiement</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Generez des recus PDF officiels pour les parents</p>
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Paiements regles — {paid.length} recus disponibles</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Eleve','Montant','Mois','Mode','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {paid.map(p => (
                      <tr key={p.id}>
                        <td style={TD}><div style={{ display:'flex', alignItems:'center', gap:9 }}><div style={{ width:28, height:28, borderRadius:'50%', background:'#dcfce7', color:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{p.student?p.student.firstName[0]:''}{p.student?p.student.lastName[0]:''}</div><span style={{ fontWeight:500 }}>{p.student?p.student.firstName+' '+p.student.lastName:'—'}</span></div></td>
                        <td style={{ ...TD, fontWeight:600, color:'#16a34a' }}>{(p.amount||0).toLocaleString('fr-FR')} MAD</td>
                        <td style={{ ...TD, color:'#6b7280' }}>{p.month}</td>
                        <td style={{ ...TD, color:'#6b7280' }}>{p.mode||'Especes'}</td>
                        <td style={TD}>
                          <button onClick={() => {
                            const s = p.student;
                            const schoolName = school ? school.name : 'Ecole Excellence';
                            const dateStr = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
                            const refNum = 'REC-' + new Date().getFullYear() + '-' + String(p.id).padStart(4,'0');
                            const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Recu</title>'
                              + '<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;color:#111}'
                              + '.header{background:#1e2d4f;color:white;padding:20px 24px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center}'
                              + '.body{border:1px solid #e5e9f2;border-top:none;padding:24px;border-radius:0 0 10px 10px}'
                              + '.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px}'
                              + '.label{color:#6b7280}.value{font-weight:600}'
                              + '.total{background:#f0fdf4;padding:14px;border-radius:8px;margin-top:16px;display:flex;justify-content:space-between;align-items:center}'
                              + '.stamp{text-align:center;margin-top:24px;padding-top:24px;border-top:1px dashed #e5e9f2}'
                              + '</style></head><body>'
                              + '<div class="header"><div><div style="font-size:16px;font-weight:700">' + schoolName + '</div><div style="font-size:11px;opacity:.7">Recu de paiement</div></div><div style="text-align:right"><div style="font-size:13px;opacity:.8">' + refNum + '</div><div style="font-size:11px;opacity:.6">' + dateStr + '</div></div></div>'
                              + '<div class="body">'
                              + '<div class="row"><span class="label">Eleve</span><span class="value">' + (s?s.firstName+' '+s.lastName:'—') + '</span></div>'
                              + '<div class="row"><span class="label">Code Massar</span><span class="value" style="font-family:monospace">' + (s?s.massar:'—') + '</span></div>'
                              + '<div class="row"><span class="label">Mois</span><span class="value">' + (p.month||'—') + '</span></div>'
                              + '<div class="row"><span class="label">Mode de paiement</span><span class="value">' + (p.mode||'Especes') + '</span></div>'
                              + '<div class="row"><span class="label">Date de paiement</span><span class="value">' + dateStr + '</span></div>'
                              + '<div class="total"><span style="font-size:14px;font-weight:600;color:#16a34a">Montant regle</span><span style="font-size:22px;font-weight:700;color:#15803d">' + (p.amount||0).toLocaleString('fr-FR') + ' MAD</span></div>'
                              + '<div class="stamp"><div style="font-size:12px;color:#6b7280;margin-bottom:40px">Signature et cachet de l etablissement</div>'
                              + '<div style="font-size:11px;color:#9ca3af">Ce recu est genere electroniquement par LuxEdu · ' + schoolName + '</div></div>'
                              + '</div>'
                              + '<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Imprimer / PDF</button></div>'
                              + '</body></html>';
                            window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
                          }}
                            style={{ padding:'6px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            Recu PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'carte' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Carte eleve</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Imprimez les cartes d identite scolaire pour les eleves</p>
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>{students.length} cartes disponibles</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                  {students.map(s => (
                    <div key={s.id} style={{ border:'2px solid #1e2d4f', borderRadius:12, overflow:'hidden' }}>
                      <div style={{ background:'#1e2d4f', padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'white', color:'#1e2d4f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:'white' }}>{school?school.name:'Ecole Excellence'}</div>
                          <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>Annee 2025-2026</div>
                        </div>
                      </div>
                      <div style={{ padding:'12px 14px', background:'white' }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:4 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color:'#6b7280', marginBottom:2 }}>CNE: <span style={{ fontFamily:'monospace', fontWeight:600, color:'#1e2d4f' }}>{s.massar}</span></div>
                        <div style={{ fontSize:11, color:'#6b7280', marginBottom:8 }}>Inscrit le: {new Date(s.createdAt).toLocaleDateString('fr-FR')}</div>
                        <button onClick={() => {
                          const schoolName = school ? school.name : 'Ecole Excellence';
                          const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Carte Eleve</title>'
                            + '<style>body{font-family:Arial,sans-serif;padding:40px;display:flex;justify-content:center}'
                            + '.card{width:340px;height:200px;border:3px solid #1e2d4f;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)}'
                            + '.top{background:#1e2d4f;padding:12px 16px;display:flex;align-items:center;gap:10px;height:60px}'
                            + '.av{width:36px;height:36px;border-radius:50%;background:white;color:#1e2d4f;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0}'
                            + '.body{padding:14px 16px;background:white}'
                            + '</style></head><body>'
                            + '<div>'
                            + '<div class="card">'
                            + '<div class="top"><div class="av">' + s.firstName[0] + s.lastName[0] + '</div><div><div style="font-size:13px;font-weight:700;color:white">' + schoolName + '</div><div style="font-size:10px;color:rgba(255,255,255,0.5)">Carte eleve · 2025-2026</div></div></div>'
                            + '<div class="body"><div style="font-size:16px;font-weight:700;color:#111827;margin-bottom:5px">' + s.firstName + ' ' + s.lastName + '</div>'
                            + '<div style="font-size:11px;color:#6b7280;margin-bottom:2px">CNE: <span style="font-family:monospace;font-weight:700;color:#1e2d4f">' + s.massar + '</span></div>'
                            + '<div style="font-size:11px;color:#6b7280">Inscrit le: ' + new Date(s.createdAt).toLocaleDateString('fr-FR') + '</div></div>'
                            + '</div>'
                            + '<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Imprimer</button></div>'
                            + '</div></body></html>';
                          window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
                        }}
                          style={{ width:'100%', padding:'7px', background:'#f8faff', color:'#1e2d4f', border:'1px solid #bfdbfe', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                          Imprimer carte
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'historique' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Historique eleve</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Dossier complet de chaque eleve</p>
              </div>
              <div style={{ ...C, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Selectionner un eleve</div>
                <select onChange={e => {
                  const s = students.find(x=>x.id===e.target.value);
                  setSelectedMsg(s||null);
                }}
                  style={{ ...INP, maxWidth:400 }}>
                  <option value="">Choisir un eleve...</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.massar}</option>)}
                </select>
              </div>
              {selectedMsg && (
                <div>
                  <div style={{ background:'#1e2d4f', borderRadius:12, padding:20, marginBottom:14, display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:56, height:56, borderRadius:'50%', background:'#3b82f6', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700 }}>
                      {selectedMsg.firstName[0]}{selectedMsg.lastName[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:20, fontWeight:700, color:'white' }}>{selectedMsg.firstName} {selectedMsg.lastName}</div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>CNE: {selectedMsg.massar} · Inscrit le {new Date(selectedMsg.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => generateCert(selectedMsg)}
                        style={{ background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                        Certificat PDF
                      </button>
                      {selectedMsg.parentPhone && (
                        <button onClick={() => sendWA(selectedMsg.parentPhone, 'Bonjour, message de '+(school?school.name:''))}
                          style={{ background:'#25D366', color:'white', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                          WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div style={C}>
                      <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Informations personnelles</div>
                      {[
                        ['Prenom', selectedMsg.firstName],
                        ['Nom', selectedMsg.lastName],
                        ['Code Massar', selectedMsg.massar],
                        ['Telephone parent', selectedMsg.parentPhone||'—'],
                        ['Date inscription', new Date(selectedMsg.createdAt).toLocaleDateString('fr-FR')],
                      ].map(([l,v]) => (
                        <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f3f4f6', fontSize:13 }}>
                          <span style={{ color:'#6b7280' }}>{l}</span>
                          <span style={{ fontWeight:600 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={C}>
                      <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Historique paiements</div>
                      {payments.filter(p=>p.studentId===selectedMsg.id).length === 0 ? (
                        <div style={{ color:'#6b7280', fontSize:13 }}>Aucun paiement enregistre</div>
                      ) : payments.filter(p=>p.studentId===selectedMsg.id).map(p => (
                        <div key={p.id} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f3f4f6', fontSize:13 }}>
                          <span style={{ color:'#6b7280' }}>{p.month}</span>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontWeight:600 }}>{(p.amount||0).toLocaleString('fr-FR')} MAD</span>
                            <span style={{ padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:500, background:p.status==='PAID'?'#dcfce7':'#fee2e2', color:p.status==='PAID'?'#16a34a':'#dc2626' }}>{p.status==='PAID'?'Regle':'Attente'}</span>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop:12, background:'#f0fdf4', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize:12, color:'#6b7280' }}>Total paye</span>
                        <span style={{ fontSize:14, fontWeight:700, color:'#15803d' }}>
                          {payments.filter(p=>p.studentId===selectedMsg.id&&p.status==='PAID').reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {page === 'medical' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Fiche medicale</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Informations medicales des eleves — confidentielles</p>
              </div>
              <div style={{ ...C, marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Selectionner un eleve</div>
                <select onChange={e => { const s = students.find(x=>x.id===e.target.value); setSelectedMsg(s||null); }} style={{ ...INP, maxWidth:400 }}>
                  <option value="">Choisir un eleve...</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              {selectedMsg && (
                <div style={C}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:16, borderBottom:'1px solid #e5e9f2' }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:'#fee2e2', color:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>{selectedMsg.firstName[0]}{selectedMsg.lastName[0]}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{selectedMsg.firstName} {selectedMsg.lastName}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{selectedMsg.massar}</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:14 }}>Informations medicales</div>
                      {[
                        { lbl:'Groupe sanguin', placeholder:'ex: A+, O-, B+', type:'select', opts:['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
                        { lbl:'Assurance maladie', placeholder:'ex: AMO-2024-147', type:'text' },
                        { lbl:'Medecin traitant', placeholder:'ex: Dr. Karim Idrissi', type:'text' },
                        { lbl:'Tel medecin', placeholder:'ex: +212 5 22 XX XX XX', type:'text' },
                      ].map(f => (
                        <div key={f.lbl} style={{ marginBottom:12 }}>
                          <label style={LBL}>{f.lbl}</label>
                          {f.type==='select' ? (
                            <select style={INP}><option value="">Selectionner...</option>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
                          ) : (
                            <input style={INP} placeholder={f.placeholder} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:14 }}>Allergies & conditions</div>
                      <div style={{ marginBottom:12 }}>
                        <label style={LBL}>Allergies connues</label>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                          {['Arachides','Penicilline','Gluten','Lactose','Oeufs','Fruits de mer'].map(a => (
                            <label key={a} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', border:'1px solid #e5e9f2', borderRadius:20, cursor:'pointer', fontSize:12 }}>
                              <input type="checkbox" style={{ accentColor:'#dc2626' }} /> {a}
                            </label>
                          ))}
                        </div>
                        <input style={INP} placeholder="Autres allergies..." />
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <label style={LBL}>Conditions medicales</label>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                          {['Asthme','Diabete','Epilepsie','Hypertension'].map(a => (
                            <label key={a} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', border:'1px solid #e5e9f2', borderRadius:20, cursor:'pointer', fontSize:12 }}>
                              <input type="checkbox" style={{ accentColor:'#f59e0b' }} /> {a}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <label style={LBL}>Medicaments</label>
                        <input style={INP} placeholder="ex: Ventoline si crise d asthme" />
                      </div>
                      <div>
                        <label style={LBL}>Observations</label>
                        <textarea style={{ ...INP, resize:'vertical', minHeight:80 }} placeholder="Notes medicales importantes..." />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid #e5e9f2' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:12 }}>Contacts urgence</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div><label style={LBL}>Nom contact 1</label><input style={INP} placeholder="Nom et prenom" /></div>
                      <div><label style={LBL}>Tel contact 1</label><input style={INP} placeholder="+212 6 XX XX XX XX" /></div>
                      <div><label style={LBL}>Nom contact 2</label><input style={INP} placeholder="Nom et prenom" /></div>
                      <div><label style={LBL}>Tel contact 2</label><input style={INP} placeholder="+212 6 XX XX XX XX" /></div>
                    </div>
                  </div>
                  <button onClick={() => showT('Fiche medicale sauvegardee pour ' + selectedMsg.firstName)}
                    style={{ marginTop:16, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Sauvegarder la fiche
                  </button>
                </div>
              )}
            </div>
          )}

          {page === 'cantine' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Cantine scolaire</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Presence dejeuner et menu de la semaine</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Inscrits cantine', value:Math.round(students.length*0.6), color:'#2563eb' },
                  { label:'Presents aujourd hui', value:Math.round(students.length*0.55), color:'#16a34a' },
                  { label:'Absents cantine', value:Math.round(students.length*0.05), color:'#dc2626' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Menu de la semaine</div>
                  {['Lundi','Mardi','Mercredi','Jeudi','Vendredi'].map((j,i) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                      <div style={{ width:70, fontSize:12, fontWeight:600, color:'#374151' }}>{j}</div>
                      <input style={{ flex:1, padding:'7px 10px', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, outline:'none' }}
                        defaultValue={['Couscous aux legumes','Tajine poulet','Riz aux legumes','Spaghetti bolognaise','Harira + briouates'][i]} />
                    </div>
                  ))}
                  <button onClick={() => showT('Menu sauvegarde et envoye aux parents WA')}
                    style={{ marginTop:12, background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'9px 20px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Sauvegarder & Notifier parents
                  </button>
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Presence cantine aujourd hui</div>
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <button onClick={() => showT('Tous marques presents a la cantine')}
                      style={{ padding:'7px 14px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Tous presents
                    </button>
                    <button onClick={() => showT('Liste exportee')}
                      style={{ padding:'7px 14px', background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Exporter liste
                    </button>
                  </div>
                  {students.filter((_,i)=>i<6).map(s => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f3f4f6' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:600 }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <span style={{ fontSize:13 }}>{s.firstName} {s.lastName}</span>
                      </div>
                      <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor:'#16a34a', width:15, height:15 }} />
                        <span style={{ fontSize:12, color:'#16a34a', fontWeight:500 }}>Present</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'circulaires' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Circulaires parents</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Envoyez des annonces officielles a tous les parents</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Nouvelle circulaire</div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Titre</label>
                    <input style={INP} placeholder="ex: Reunion parents — Jeudi 25 avril" />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Destinataires</label>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {['Tous les parents ('+students.length+')', 'Classe 6eme', 'Classe 5eme', 'Classe 4eme', 'Classe 3eme', 'Parents retard paiement'].map(d => (
                        <label key={d} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', border:'1px solid #e5e9f2', borderRadius:8, cursor:'pointer', fontSize:12 }}>
                          <input type="checkbox" style={{ accentColor:'#1e2d4f' }} defaultChecked={d.includes('Tous')} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Message</label>
                    <textarea style={{ ...INP, resize:'vertical', minHeight:120 }}
                      defaultValue={"Chers parents, nous vous informons que... Cordialement, L Administration"} />
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={LBL}>Canal d envoi</label>
                    <div style={{ display:'flex', gap:10 }}>
                      {[{id:'wa', label:'WhatsApp', color:'#22c55e', bg:'#f0fdf4'}, {id:'sms', label:'SMS', color:'#2563eb', bg:'#eff6ff'}].map(ch => (
                        <label key={ch.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', border:'1.5px solid '+ch.color, borderRadius:9, cursor:'pointer', background:ch.bg, fontSize:13, fontWeight:600, color:ch.color }}>
                          <input type="checkbox" defaultChecked style={{ accentColor:ch.color }} />
                          {ch.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => showT('Circulaire envoyee a ' + students.length + ' parents')}
                    style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Envoyer la circulaire
                  </button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={C}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Historique des envois</div>
                    {[
                      { title:'Reunion parents S2', date:"Aujourd'hui 09:00", nb:students.length, ok:true },
                      { title:'Delai paiement avril', date:'Hier 14:00', nb:Math.round(students.length*0.3), ok:true },
                      { title:'Calendrier examens BAC', date:'Lundi 10:00', nb:students.length, ok:true },
                    ].map((h,i) => (
                      <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                        <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>{h.title}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontSize:11, color:'#9ca3af' }}>{h.date}</span>
                          <span style={{ fontSize:11, fontWeight:600, color:'#16a34a', background:'#dcfce7', padding:'2px 8px', borderRadius:20 }}>{h.nb} envoyes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'#1e2d4f', borderRadius:12, padding:16 }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Stats envois ce mois</div>
                    <div style={{ fontSize:28, fontWeight:700, color:'white' }}>1 847</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:4 }}>messages envoyes</div>
                    <div style={{ marginTop:12, display:'flex', justifyContent:'space-between' }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:18, fontWeight:700, color:'#22c55e' }}>91%</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Lu</div>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:18, fontWeight:700, color:'#f59e0b' }}>9%</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Non lu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'liste' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Listes de classe</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Imprimez les listes officielles par classe</p>
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Liste complete — {students.length} eleves</span>
                  <button onClick={() => {
                    const schoolName = school ? school.name : 'Ecole Excellence';
                    const rows = students.map((s,i) => '<tr><td>'+(i+1)+'</td><td>'+s.lastName.toUpperCase()+' '+s.firstName+'</td><td style="font-family:monospace">'+s.massar+'</td><td>'+(s.parentPhone||'—')+'</td><td>'+new Date(s.createdAt).toLocaleDateString('fr-FR')+'</td><td style="height:30px;border-bottom:1px solid #ddd"></td></tr>').join('');
                    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Liste de classe</title>'
                      + '<style>body{font-family:Arial,sans-serif;padding:30px;font-size:13px}'
                      + 'h2{color:#1e2d4f;text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}'
                      + 'th{background:#1e2d4f;color:white;padding:8px 10px;text-align:left;font-size:11px}'
                      + 'td{padding:8px 10px;border-bottom:1px solid #e5e9f2}tr:nth-child(even){background:#f9fafb}'
                      + '.header{text-align:center;margin-bottom:20px;border-bottom:2px solid #1e2d4f;padding-bottom:14px}'
                      + '</style></head><body>'
                      + '<div class="header"><div style="font-size:18px;font-weight:700;color:#1e2d4f">'+schoolName+'</div>'
                      + '<div style="font-size:13px;color:#6b7280;margin-top:4px">Liste des eleves — Annee scolaire 2025-2026</div>'
                      + '<div style="font-size:12px;color:#9ca3af;margin-top:2px">Imprime le '+new Date().toLocaleDateString('fr-FR')+'</div></div>'
                      + '<table><thead><tr><th>N°</th><th>Nom et Prenom</th><th>Code Massar</th><th>Tel Parent</th><th>Date inscription</th><th>Signature</th></tr></thead><tbody>'+rows+'</tbody></table>'
                      + '<div style="margin-top:30px;text-align:right;font-size:12px;color:#6b7280">Total: '+students.length+' eleves · '+schoolName+'</div>'
                      + '<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Imprimer</button></div>'
                      + '</body></html>';
                    window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
                  }}
                    style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Imprimer liste PDF
                  </button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['N°','Eleve','Code Massar','Tel Parent','Date inscription'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {students.map((s,i) => (
                      <tr key={s.id}>
                        <td style={{ ...TD, color:'#9ca3af', fontSize:11 }}>{i+1}</td>
                        <td style={TD}><div style={{ display:'flex', alignItems:'center', gap:9 }}><div style={{ width:26, height:26, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:600 }}>{s.firstName[0]}{s.lastName[0]}</div><span style={{ fontWeight:500 }}>{s.lastName.toUpperCase()} {s.firstName}</span></div></td>
                        <td style={{ ...TD, fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{s.parentPhone||'—'}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'reductions' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Reductions & frais speciaux</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Bourses, reductions fratrie, frais exceptionnels</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Appliquer une reduction</div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Eleve</label>
                    <select style={INP}>
                      <option value="">Selectionner un eleve</option>
                      {students.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Type de reduction</label>
                    <select style={INP}>
                      <option>Reduction fratrie (10%)</option>
                      <option>Bourse sociale (50%)</option>
                      <option>Bourse excellence (25%)</option>
                      <option>Reduction personnalisee</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Montant reduction (MAD)</label>
                    <input type="number" style={INP} placeholder="ex: 280" />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Motif</label>
                    <textarea style={{ ...INP, minHeight:70, resize:'vertical' }} placeholder="Justification de la reduction..." />
                  </div>
                  <button onClick={() => showT('Reduction appliquee et notifiee au directeur')}
                    style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Appliquer la reduction
                  </button>
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Reductions en cours</div>
                  {students.slice(0,4).map((s,i) => {
                    const types = ['Fratrie -10%','Bourse sociale -50%','Excellence -25%','Fratrie -10%'];
                    const montants = [280, 1400, 700, 280];
                    return (
                      <div key={s.id} style={{ padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:500 }}>{s.firstName} {s.lastName}</div>
                            <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{types[i]}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontSize:14, fontWeight:700, color:'#16a34a' }}>-{montants[i]} MAD</div>
                            <div style={{ fontSize:10, color:'#9ca3af' }}>par mois</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop:12, background:'#f0fdf4', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'#6b7280' }}>Total reductions mois</span>
                    <span style={{ fontSize:14, fontWeight:700, color:'#16a34a' }}>-2 660 MAD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'edt' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Emploi du temps</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Horaires par classe — Annee 2025-2026</p>
              </div>
              <div style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {Object.keys(EDT_DATA).map(cl => (
                      <button key={cl} onClick={() => setEdtClass(cl)}
                        style={{ padding:'7px 14px', background:edtClass===cl?'#1e2d4f':'white', color:edtClass===cl?'white':'#6b7280', border:'1px solid '+(edtClass===cl?'#1e2d4f':'#e5e9f2'), borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .15s' }}>
                        {cl}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => {
                    const schoolName = school ? school.name : 'Ecole Excellence';
                    const jours = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];
                    const edtRows = EDT_DATA[edtClass] || EDT_DATA['6eme Excellence'];
                    const tableRows = edtRows.map(row =>
                      '<tr><td style="padding:8px 12px;color:#6b7280;font-size:12px;background:#f8fafc;font-weight:600">'+row.h+'</td>' +
                      row.ms.map(m => {
                        const col = MAT_COLORS[m] || {bg:'#f9fafb',tc:'#d1d5db'};
                        return '<td style="padding:6px"><div style="background:'+col.bg+';color:'+col.tc+';padding:7px 8px;border-radius:6px;font-size:11px;font-weight:600;text-align:center">'+m+'</div></td>';
                      }).join('') + '</tr>'
                    ).join('');
                    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>EDT '+edtClass+'</title>'
                      + '<style>body{font-family:Arial,sans-serif;padding:30px}table{width:100%;border-collapse:collapse}th{background:#1e2d4f;color:white;padding:10px 12px;font-size:12px}td{border-bottom:1px solid #f3f4f6}</style>'
                      + '</head><body>'
                      + '<div style="text-align:center;margin-bottom:20px"><div style="font-size:18px;font-weight:700;color:#1e2d4f">'+schoolName+'</div>'
                      + '<div style="font-size:14px;color:#6b7280;margin-top:4px">Emploi du temps — '+edtClass+' — 2025-2026</div></div>'
                      + '<table><thead><tr><th>Heure</th>'+jours.map(j=>'<th>'+j+'</th>').join('')+'</tr></thead><tbody>'+tableRows+'</tbody></table>'
                      + '<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Imprimer</button></div>'
                      + '</body></html>';
                    window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
                  }}
                    style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Imprimer PDF
                  </button>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
                    <thead>
                      <tr>
                        <th style={{ padding:'10px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', background:'#1e2d4f', width:80 }}>Heure</th>
                        {['Lundi','Mardi','Mercredi','Jeudi','Vendredi'].map(j => (
                          <th key={j} style={{ padding:'10px 12px', textAlign:'center', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', background:'#1e2d4f' }}>{j}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(EDT_DATA[edtClass] || EDT_DATA['6eme Excellence']).map(row => (
                        <tr key={row.h} style={{ borderBottom:'1px solid #f3f4f6' }}>
                          <td style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:'#6b7280', background:'#f8fafc' }}>{row.h}</td>
                          {row.ms.map((m,i) => {
                            const col = MAT_COLORS[m] || {bg:'#f9fafb',tc:'#d1d5db'};
                            return (
                              <td key={i} style={{ padding:5 }}>
                                {m !== '—' ? (
                                  <div style={{ background:col.bg, color:col.tc, padding:'7px 8px', borderRadius:7, fontSize:11, fontWeight:600, textAlign:'center' }}>{m}</div>
                                ) : (
                                  <div style={{ height:34, borderRadius:7, border:'1px dashed #e5e9f2' }}></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {page === 'agenda' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Agenda</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Evenements et rappels — Annee scolaire 2025-2026</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Ajouter un evenement</div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Titre</label>
                    <input style={INP} placeholder="ex: Conseil de classe 5eme B" />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Date</label>
                    <input type="date" style={INP} />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Heure</label>
                    <input type="time" style={INP} />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={LBL}>Type</label>
                    <select style={INP}>
                      <option>Reunion</option>
                      <option>Examen</option>
                      <option>Evenement scolaire</option>
                      <option>Conge</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={LBL}>Description</label>
                    <textarea style={{ ...INP, minHeight:70, resize:'vertical' }} placeholder="Details de l evenement..." />
                  </div>
                  <button onClick={() => showT('Evenement ajoute a l agenda')}
                    style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    Ajouter
                  </button>
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Prochains evenements</div>
                  {[
                    { date:'05 Mai 2026', heure:'10h00', titre:'Conseil de classe 6eme Excellence', type:'Reunion', color:'#dbeafe', tc:'#1d4ed8' },
                    { date:'07 Mai 2026', heure:'08h30', titre:'Examens de mi-trimestre', type:'Examen', color:'#fee2e2', tc:'#dc2626' },
                    { date:'12 Mai 2026', heure:'14h00', titre:'Reunion parents-professeurs', type:'Reunion', color:'#dbeafe', tc:'#1d4ed8' },
                    { date:'15 Mai 2026', heure:'—', titre:'Fete de l etablissement', type:'Evenement scolaire', color:'#dcfce7', tc:'#15803d' },
                    { date:'20 Mai 2026', heure:'09h00', titre:'Conseil pedagogique', type:'Reunion', color:'#dbeafe', tc:'#1d4ed8' },
                    { date:'30 Mai 2026', heure:'—', titre:'Fin du 2eme trimestre', type:'Conge', color:'#fef3c7', tc:'#b45309' },
                  ].map((ev, idx) => (
                    <div key={idx} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
                      <div style={{ background:'#f1f4f9', borderRadius:8, padding:'6px 10px', textAlign:'center', minWidth:50, flexShrink:0 }}>
                        <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{ev.date.split(' ')[0]}</div>
                        <div style={{ fontSize:9, color:'#6b7280', textTransform:'uppercase' }}>{ev.date.split(' ')[1]}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:3 }}>{ev.titre}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontSize:11, color:'#6b7280' }}>{ev.heure !== '—' ? ev.heure : 'Journee entiere'}</span>
                          <span style={{ fontSize:10, fontWeight:600, background:ev.color, color:ev.tc, padding:'2px 8px', borderRadius:20 }}>{ev.type}</span>
                        </div>
                      </div>
                      <button onClick={() => showT('Evenement supprime')}
                        style={{ fontSize:11, color:'#dc2626', background:'none', border:'none', cursor:'pointer', padding:4, flexShrink:0 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Vue mensuelle — Mai 2026</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => showT('Mois precedent')} style={{ padding:'5px 12px', background:'white', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, cursor:'pointer' }}>← Precedent</button>
                    <button onClick={() => showT('Mois suivant')} style={{ padding:'5px 12px', background:'white', border:'1px solid #e5e9f2', borderRadius:7, fontSize:12, cursor:'pointer' }}>Suivant →</button>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
                  {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(j => (
                    <div key={j} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', padding:'6px 0', letterSpacing:'.05em' }}>{j}</div>
                  ))}
                  {Array.from({length:3}).map((_,idx2) => (
                    <div key={'empty'+idx2} style={{ height:60 }}></div>
                  ))}
                  {Array.from({length:31}).map((_,idx3) => {
                    const day = idx3+1;
                    const hasEvent = [5,7,12,15,20,30].includes(day);
                    const isToday = day === 3;
                    return (
                      <div key={day}
                        style={{ height:60, border:'1px solid #f3f4f6', borderRadius:8, padding:6, cursor:'pointer', background:isToday?'#eff6ff':hasEvent?'#f0fdf4':'white', position:'relative' }}>
                        <div style={{ fontSize:12, fontWeight:isToday?700:400, color:isToday?'#2563eb':hasEvent?'#15803d':'#374151' }}>{day}</div>
                        {hasEvent && <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', position:'absolute', bottom:6, right:6 }}></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {page === 'budget' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Budget & depenses</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Suivi financier de l etablissement</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Budget annuel', value:'540 000', sub:'MAD alloue 2025-2026', color:'#2563eb' },
                  { label:'Depenses ce mois', value:'28 450', sub:'MAD avril 2026', color:'#dc2626', red:true },
                  { label:'Recettes ce mois', value:paid.reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR'), sub:'MAD paiements', color:'#16a34a' },
                  { label:'Solde disponible', value:'184 320', sub:'MAD restant', color:'#16a34a' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
                    <div style={{ fontSize:24, fontWeight:700, color:s.red?'#ef4444':'#111827' }}>{s.value}</div>
                    <div style={{ fontSize:11, color:s.color, marginTop:6, fontWeight:500 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>Depenses recentes</span>
                    <button onClick={() => showT('Depense ajoutee')}
                      style={{ padding:'6px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      + Ajouter
                    </button>
                  </div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr>{['Description','Categorie','Montant','Date'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[
                        { desc:'Fournitures bureau', cat:'Administratif', montant:'1 200', date:'12 avr. 2026', color:'#2563eb', bg:'#eff6ff' },
                        { desc:'Salaires enseignants', cat:'RH', montant:'18 000', date:'01 avr. 2026', color:'#7c3aed', bg:'#f5f3ff' },
                        { desc:'Electricite', cat:'Charges', montant:'3 400', date:'05 avr. 2026', color:'#d97706', bg:'#fffbeb' },
                        { desc:'Entretien locaux', cat:'Infrastructure', montant:'2 850', date:'08 avr. 2026', color:'#16a34a', bg:'#f0fdf4' },
                        { desc:'Materiel pedagogique', cat:'Pedagogique', montant:'3 000', date:'10 avr. 2026', color:'#0891b2', bg:'#ecfeff' },
                      ].map((d,i) => (
                        <tr key={i}>
                          <td style={TD}><span style={{ fontWeight:500 }}>{d.desc}</span></td>
                          <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:d.bg, color:d.color }}>{d.cat}</span></td>
                          <td style={{ ...TD, fontWeight:600, color:'#dc2626' }}>{d.montant} MAD</td>
                          <td style={{ ...TD, color:'#6b7280', fontSize:12 }}>{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={C}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Repartition depenses</div>
                    {[
                      { label:'RH / Salaires', pct:63, color:'#7c3aed', montant:'18 000' },
                      { label:'Charges', pct:12, color:'#d97706', montant:'3 400' },
                      { label:'Infrastructure', pct:10, color:'#16a34a', montant:'2 850' },
                      { label:'Pedagogique', pct:11, color:'#0891b2', montant:'3 000' },
                      { label:'Administratif', pct:4, color:'#2563eb', montant:'1 200' },
                    ].map(r => (
                      <div key={r.label} style={{ marginBottom:10 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                          <span style={{ color:'#374151' }}>{r.label}</span>
                          <span style={{ fontWeight:600, color:r.color }}>{r.montant} MAD</span>
                        </div>
                        <div style={{ height:7, background:'#f1f4f9', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:4, background:r.color, width:r.pct+'%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'#1e2d4f', borderRadius:12, padding:16 }}>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:10 }}>Enregistrer depense</div>
                    <input style={{ width:'100%', padding:'8px', border:'none', borderRadius:7, fontSize:12, marginBottom:8, outline:'none' }} placeholder="Description..." />
                    <input type="number" style={{ width:'100%', padding:'8px', border:'none', borderRadius:7, fontSize:12, marginBottom:8, outline:'none' }} placeholder="Montant MAD" />
                    <select style={{ width:'100%', padding:'8px', border:'none', borderRadius:7, fontSize:12, marginBottom:8, outline:'none' }}>
                      {['Administratif','RH','Charges','Infrastructure','Pedagogique'].map(c=><option key={c}>{c}</option>)}
                    </select>
                    <button onClick={() => showT('Depense enregistree')}
                      style={{ width:'100%', background:'#3b82f6', color:'white', border:'none', borderRadius:8, padding:'9px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'rh' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>RH Enseignants</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Gestion du personnel enseignant et administratif</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Total personnel', value:'12', sub:'Enseignants actifs', color:'#2563eb' },
                  { label:'Masse salariale', value:'36 000', sub:'MAD ce mois', color:'#dc2626' },
                  { label:'Absences personnel', value:'2', sub:'Ce mois', color:'#d97706' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase', color:'#6b7280', marginBottom:12 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:'#111827' }}>{s.value}</div>
                    <div style={{ fontSize:11, color:s.color, marginTop:6, fontWeight:500 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...C, marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Personnel enseignant</span>
                  <button onClick={() => showT('Formulaire ajout enseignant ouvert')}
                    style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    + Ajouter
                  </button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Enseignant','Matiere','Type contrat','Salaire mensuel','Statut','Actions'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      { nom:'Mme. Fatima Alami', mat:'Mathematiques', contrat:'CDI', salaire:'4 500', actif:true },
                      { nom:'M. Karim Bennani', mat:'Francais', contrat:'CDI', salaire:'4 200', actif:true },
                      { nom:'Mme. Sara Idrissi', mat:'Sciences', contrat:'CDD', salaire:'3 800', actif:true },
                      { nom:'M. Omar Tazi', mat:'Arabe', contrat:'CDI', salaire:'4 100', actif:true },
                      { nom:'Mme. Nadia Chraibi', mat:'Anglais', contrat:'Vacataire', salaire:'2 800', actif:false },
                    ].map((e,i) => (
                      <tr key={i}>
                        <td style={TD}>
                          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'#eff6ff', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>
                              {e.nom.split(' ').map(n=>n[0]).filter(x=>x===x.toUpperCase()&&x!=='.').slice(0,2).join('')}
                            </div>
                            <span style={{ fontWeight:500 }}>{e.nom}</span>
                          </div>
                        </td>
                        <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#eff6ff', color:'#2563eb' }}>{e.mat}</span></td>
                        <td style={{ ...TD, color:'#6b7280' }}>{e.contrat}</td>
                        <td style={{ ...TD, fontWeight:600 }}>{e.salaire} MAD</td>
                        <td style={TD}><span style={{ padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:e.actif?'#dcfce7':'#fee2e2', color:e.actif?'#16a34a':'#dc2626' }}>{e.actif?'Actif':'Inactif'}</span></td>
                        <td style={TD}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => {
  const sn = school ? school.name : 'Ecole';
  const html = '<html><head><meta charset=UTF-8><title>Fiche</title>'
    + '<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto}'
    + '.h{background:#1e2d4f;color:white;padding:20px;border-radius:10px 10px 0 0}'
    + '.b{border:1px solid #ddd;border-top:none;padding:24px}'
    + '.r{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px}'
    + '.t{background:#f0fdf4;padding:14px;border-radius:8px;margin-top:16px;display:flex;justify-content:space-between}'
    + '</style></head><body>'
    + '<div class=h><div style="font-size:16px;font-weight:700">' + sn + '</div><div style="font-size:11px;opacity:.7">Fiche de paie - Avril 2026</div></div>'
    + '<div class=b>'
    + '<div class=r><span style="color:#6b7280">Employe</span><span style="font-weight:600">' + e.nom + '</span></div>'
    + '<div class=r><span style="color:#6b7280">Poste</span><span style="font-weight:600">' + e.mat + '</span></div>'
    + '<div class=r><span style="color:#6b7280">Type contrat</span><span style="font-weight:600">' + e.contrat + '</span></div>'
    + '<div class=r><span style="color:#6b7280">Salaire brut</span><span style="font-weight:600">' + e.salaire + ' MAD</span></div>'
    + '<div class=r><span style="color:#6b7280">CNSS 6%</span><span style="color:#dc2626;font-weight:600">-' + Math.round(parseInt(e.salaire.replace(/[^0-9]/g,''))*0.06) + ' MAD</span></div>'
    + '<div class=r><span style="color:#6b7280">IR 10%</span><span style="color:#d97706;font-weight:600">-' + Math.round(parseInt(e.salaire.replace(/[^0-9]/g,''))*0.10) + ' MAD</span></div>'
    + '<div class=t><span style="font-size:14px;font-weight:600;color:#16a34a">Salaire net</span><span style="font-size:20px;font-weight:700;color:#15803d">' + Math.round(parseInt(e.salaire.replace(/[^0-9]/g,''))*0.84) + ' MAD</span></div>'
    + '</div><div style="margin-top:30px;display:flex;justify-content:space-between;padding-top:20px;border-top:1px solid #ddd">'
    + '<div style="text-align:center;width:200px"><div style="height:50px;border-bottom:1px solid #1e2d4f;margin-bottom:6px"></div><div style="font-size:12px;color:#6b7280">Signature Directeur</div></div>'
    + '<div style="text-align:center;width:200px"><div style="height:50px;border-bottom:1px solid #1e2d4f;margin-bottom:6px"></div><div style="font-size:12px;color:#6b7280">Signature Employe</div></div>'
    + '</div><div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer">Imprimer</button></div>'
    + '</body></html>';
  window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
}}
                              style={{ padding:'5px 10px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac', borderRadius:6, fontSize:11, cursor:'pointer' }}>Fiche paie</button>
                            <button onClick={() => {
  const sn = school ? school.name : 'Ecole';
  const html = '<html><head><meta charset=UTF-8><title>Contrat</title>'
    + '<style>body{font-family:Arial,sans-serif;padding:40px;max-width:650px;margin:0 auto;line-height:1.8}'
    + 'h2{color:#1e2d4f;text-align:center;margin-bottom:6px}'
    + '.section{margin:20px 0;padding:16px;background:#f8fafc;border-radius:8px}'
    + '.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e9f2;font-size:14px}'
    + '.sig{display:flex;justify-content:space-between;margin-top:40px;padding-top:20px;border-top:1px solid #ddd}'
    + '.sig-block{text-align:center;width:220px}'
    + '.sig-line{height:60px;border-bottom:1px solid #1e2d4f;margin-bottom:8px}'
    + '</style></head><body>'
    + '<h2>' + sn + '</h2>'
    + '<div style="text-align:center;color:#6b7280;font-size:13px;margin-bottom:20px">Contrat de travail — Annee scolaire 2025-2026</div>'
    + '<div class=section>'
    + '<div class=row><span style="color:#6b7280">Employe</span><span style="font-weight:600">' + e.nom + '</span></div>'
    + '<div class=row><span style="color:#6b7280">Poste</span><span style="font-weight:600">Enseignant(e) - ' + e.mat + '</span></div>'
    + '<div class=row><span style="color:#6b7280">Type de contrat</span><span style="font-weight:600">' + e.contrat + '</span></div>'
    + '<div class=row><span style="color:#6b7280">Salaire mensuel brut</span><span style="font-weight:600">' + e.salaire + ' MAD</span></div>'
    + '<div class=row><span style="color:#6b7280">Date debut</span><span style="font-weight:600">01 Septembre 2025</span></div>'
    + '<div class=row><span style="color:#6b7280">Etablissement</span><span style="font-weight:600">' + sn + '</span></div>'
    + '</div>'
    + '<div style="font-size:13px;color:#374151;margin:20px 0">Les deux parties s engagent a respecter les termes du present contrat conformement au droit du travail marocain.</div>'
    + '<div class=sig>'
    + '<div class=sig-block><div class=sig-line></div><div style="font-size:12px;font-weight:700;color:#1e2d4f">Le Directeur</div></div>'
    + '<div class=sig-block><div class=sig-line></div><div style="font-size:12px;font-weight:700;color:#1e2d4f">' + e.nom + '</div></div>'
    + '</div><div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer">Imprimer</button></div>'
    + '</body></html>';
  window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
}}
                              style={{ padding:'5px 10px', background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:6, fontSize:11, cursor:'pointer' }}>Contrat</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Fiches de paie — Avril 2026</div>
                <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                  <button onClick={() => showT('Toutes les fiches de paie generees')}
                    style={{ padding:'8px 16px', background:'#1e2d4f', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Generer toutes les fiches
                  </button>
                  <button onClick={() => showT('Virements en cours...')}
                    style={{ padding:'8px 16px', background:'#22c55e', color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Virement en masse
                  </button>
                </div>
                <div style={{ background:'#f8fafc', borderRadius:9, padding:14 }}>
                  {[
                    { nom:'Mme. Fatima Alami', base:'4 500', cnss:'270', ir:'450', net:'3 780' },
                    { nom:'M. Karim Bennani', base:'4 200', cnss:'252', ir:'420', net:'3 528' },
                    { nom:'Mme. Sara Idrissi', base:'3 800', cnss:'228', ir:'380', net:'3 192' },
                  ].map((f,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #e5e9f2', fontSize:13 }}>
                      <span style={{ fontWeight:500, flex:2 }}>{f.nom}</span>
                      <span style={{ color:'#6b7280', flex:1, textAlign:'center' }}>Brut: {f.base} MAD</span>
                      <span style={{ color:'#dc2626', flex:1, textAlign:'center' }}>CNSS: -{f.cnss}</span>
                      <span style={{ color:'#d97706', flex:1, textAlign:'center' }}>IR: -{f.ir}</span>
                      <span style={{ fontWeight:700, color:'#16a34a', flex:1, textAlign:'right' }}>Net: {f.net} MAD</span>
                      <button onClick={() => {
  const sn = school ? school.name : 'Ecole';
  const html = '<html><head><meta charset=UTF-8><title>Fiche</title>'
    + '<style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto}'
    + '.h{background:#1e2d4f;color:white;padding:20px;border-radius:10px 10px 0 0}'
    + '.b{border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 10px 10px}'
    + '.r{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px}'
    + '.t{background:#f0fdf4;padding:14px;border-radius:8px;margin-top:16px;display:flex;justify-content:space-between}'
    + '</style></head><body>'
    + '<div class=h><div style="font-size:16px;font-weight:700">' + sn + '</div>'
    + '<div style="font-size:11px;opacity:.7">Fiche de paie Avril 2026</div></div>'
    + '<div class=b>'
    + '<div class=r><span style="color:#6b7280">Employe</span><span style="font-weight:600">' + f.nom + '</span></div>'
    + '<div class=r><span style="color:#6b7280">Salaire brut</span><span style="font-weight:600">' + f.base + ' MAD</span></div>'
    + '<div class=r><span style="color:#6b7280">CNSS 6%</span><span style="color:#dc2626;font-weight:600">-' + f.cnss + ' MAD</span></div>'
    + '<div class=r><span style="color:#6b7280">IR 10%</span><span style="color:#d97706;font-weight:600">-' + f.ir + ' MAD</span></div>'
    + '<div class=t><span style="font-size:14px;font-weight:600;color:#16a34a">Salaire net</span>'
    + '<span style="font-size:22px;font-weight:700;color:#15803d">' + f.net + ' MAD</span></div>'
    + '</div><div style="text-align:center;margin-top:20px">'
    + '<button onclick="window.print()" style="background:#1e2d4f;color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer">Imprimer</button>'
    + '</div></body></html>';
  window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
}}
                        style={{ marginLeft:12, padding:'5px 10px', background:'#1e2d4f', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>PDF</button>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', fontSize:14, fontWeight:700 }}>
                    <span>Total masse salariale nette</span>
                    <span style={{ color:'#16a34a' }}>10 500 MAD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'bulletins' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Bulletins PDF</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Generer et imprimer les bulletins de notes</p>
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Eleves — {students.length} inscrits</span>
                  <button onClick={() => showT('Tous les bulletins generes')} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Generer tous</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Eleve','Massar','Trimestre','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {students.map((s,i) => (
                      <tr key={s.id}>
                        <td style={TD}><span style={{ fontWeight:500 }}>{s.lastName.toUpperCase()} {s.firstName}</span></td>
                        <td style={{ ...TD, fontFamily:'monospace', fontSize:12 }}>{s.massar}</td>
                        <td style={TD}>
                          <select style={{ padding:'5px 10px', border:'1px solid #e5e9f2', borderRadius:6, fontSize:12 }}>
                            <option>Trimestre 1</option><option>Trimestre 2</option><option>Trimestre 3</option>
                          </select>
                        </td>
                        <td style={TD}>
                          <button onClick={() => showT('Bulletin PDF genere pour '+s.firstName)} style={{ padding:'5px 12px', background:'#1e2d4f', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>Telecharger PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'bibliotheque' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Bibliotheque</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Gestion des livres et emprunts</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                {[{label:'Livres total',val:'342',color:'#2563eb'},{label:'Empruntes',val:'87',color:'#d97706'},{label:'Disponibles',val:'255',color:'#16a34a'},{label:'En retard',val:'12',color:'#dc2626'}].map((s,i)=>(
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', color:'#6b7280', marginBottom:8 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Catalogue</span>
                  <button onClick={() => showT('Livre ajoute')} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>+ Ajouter livre</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Titre','Auteur','Categorie','Disponible','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      {titre:'Mathematiques 5eme',auteur:'Edition Nationale',cat:'Manuel',dispo:true},
                      {titre:'Grammaire Francaise',auteur:'Larousse',cat:'Reference',dispo:true},
                      {titre:'Histoire du Maroc',auteur:'Collectif',cat:'Histoire',dispo:false},
                      {titre:'Sciences de la Vie',auteur:'Edition Scolaire',cat:'Manuel',dispo:true},
                      {titre:'Anglais Niveau 3',auteur:'Oxford',cat:'Langue',dispo:false},
                    ].map((l,i)=>(
                      <tr key={i}>
                        <td style={{ ...TD, fontWeight:500 }}>{l.titre}</td>
                        <td style={{ ...TD, fontSize:12, color:'#6b7280' }}>{l.auteur}</td>
                        <td style={TD}><span style={{ fontSize:11, background:'#f1f5f9', padding:'2px 8px', borderRadius:20 }}>{l.cat}</span></td>
                        <td style={TD}><span style={{ fontSize:11, fontWeight:600, color:l.dispo?'#16a34a':'#dc2626' }}>{l.dispo?'Oui':'Emprunte'}</span></td>
                        <td style={TD}><button onClick={()=>showT(l.dispo?'Emprunt enregistre':'Deja emprunte')} style={{ padding:'4px 10px', background:l.dispo?'#f0fdf4':'#f1f5f9', color:l.dispo?'#16a34a':'#9ca3af', border:'1px solid '+(l.dispo?'#86efac':'#e5e9f2'), borderRadius:6, fontSize:11, cursor:'pointer' }}>{l.dispo?'Emprunter':'Indisponible'}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'transport' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Transport scolaire</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Gestion des circuits et des eleves transportes</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14 }}>
                {[{label:'Circuits actifs',val:'4',color:'#2563eb'},{label:'Eleves transportes',val:'68',color:'#16a34a'},{label:'Vehicules',val:'4',color:'#d97706'}].map((s,i)=>(
                  <div key={i} style={{ background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', color:'#6b7280', marginBottom:8 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Circuits de transport</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Circuit','Chauffeur','Vehicule','Eleves','Depart','Arrivee','Statut'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      {circuit:'Circuit Nord',chauffeur:'M. Hassan',vehicule:'Bus 01',eleves:18,depart:'07h30',arrivee:'17h00',actif:true},
                      {circuit:'Circuit Sud',chauffeur:'M. Khalid',vehicule:'Bus 02',eleves:22,depart:'07h15',arrivee:'17h15',actif:true},
                      {circuit:'Circuit Est',chauffeur:'M. Youssef',vehicule:'Bus 03',eleves:15,depart:'07h45',arrivee:'16h45',actif:true},
                      {circuit:'Circuit Ouest',chauffeur:'M. Amine',vehicule:'Bus 04',eleves:13,depart:'07h30',arrivee:'17h00',actif:false},
                    ].map((c,i)=>(
                      <tr key={i}>
                        <td style={{ ...TD, fontWeight:600 }}>{c.circuit}</td>
                        <td style={TD}>{c.chauffeur}</td>
                        <td style={TD}>{c.vehicule}</td>
                        <td style={{ ...TD, fontWeight:600, color:'#2563eb' }}>{c.eleves}</td>
                        <td style={{ ...TD, fontSize:12 }}>{c.depart}</td>
                        <td style={{ ...TD, fontSize:12 }}>{c.arrivee}</td>
                        <td style={TD}><span style={{ fontSize:11, fontWeight:600, color:c.actif?'#16a34a':'#dc2626', background:c.actif?'#dcfce7':'#fee2e2', padding:'3px 10px', borderRadius:20 }}>{c.actif?'Actif':'Inactif'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'inventaire' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Inventaire</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Gestion du materiel et des equipements</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Ajouter un article</div>
                  <div style={{ marginBottom:12 }}><label style={LBL}>Designation</label><input style={INP} placeholder="ex: Tableau blanc 120x80" /></div>
                  <div style={{ marginBottom:12 }}><label style={LBL}>Categorie</label>
                    <select style={INP}><option>Mobilier</option><option>Informatique</option><option>Fournitures</option><option>Sport</option><option>Autre</option></select>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                    <div><label style={LBL}>Quantite</label><input type="number" style={INP} placeholder="0" /></div>
                    <div><label style={LBL}>Etat</label><select style={INP}><option>Bon</option><option>Moyen</option><option>Mauvais</option></select></div>
                  </div>
                  <button onClick={()=>showT('Article ajoute a l inventaire')} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Ajouter</button>
                </div>
                <div style={C}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Resume inventaire</div>
                  {[{cat:'Mobilier',total:124,bon:98,pct:79},{cat:'Informatique',total:45,bon:38,pct:84},{cat:'Fournitures',total:312,bon:280,pct:90},{cat:'Sport',total:67,bon:52,pct:78}].map((c,i)=>(
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                        <span style={{ fontWeight:500 }}>{c.cat}</span>
                        <span style={{ color:'#6b7280' }}>{c.bon}/{c.total} en bon etat</span>
                      </div>
                      <div style={{ height:8, background:'#f1f4f9', borderRadius:4 }}>
                        <div style={{ height:8, background:c.pct>85?'#22c55e':'#f59e0b', borderRadius:4, width:c.pct+'%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={C}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Articles recents</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr>{['Designation','Categorie','Qte','Etat','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      {nom:'Ordinateur portable Dell',cat:'Informatique',qte:12,etat:'Bon'},
                      {nom:'Bureau enseignant',cat:'Mobilier',qte:8,etat:'Bon'},
                      {nom:'Tableau blanc',cat:'Mobilier',qte:15,etat:'Moyen'},
                      {nom:'Ballon football',cat:'Sport',qte:6,etat:'Bon'},
                      {nom:'Imprimante HP',cat:'Informatique',qte:3,etat:'Mauvais'},
                    ].map((a,i)=>(
                      <tr key={i}>
                        <td style={{ ...TD, fontWeight:500 }}>{a.nom}</td>
                        <td style={TD}><span style={{ fontSize:11, background:'#f1f5f9', padding:'2px 8px', borderRadius:20 }}>{a.cat}</span></td>
                        <td style={{ ...TD, fontWeight:600 }}>{a.qte}</td>
                        <td style={TD}><span style={{ fontSize:11, fontWeight:600, color:a.etat==='Bon'?'#16a34a':a.etat==='Moyen'?'#d97706':'#dc2626' }}>{a.etat}</span></td>
                        <td style={TD}><button onClick={()=>showT('Article modifie')} style={{ padding:'4px 10px', background:'#f1f5f9', border:'1px solid #e5e9f2', borderRadius:6, fontSize:11, cursor:'pointer' }}>Modifier</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'qrcode' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>QR Code eleves</h2>
                <p style={{ fontSize:12, color:'#6b7280' }}>Generer les QR codes d identification pour chaque eleve</p>
              </div>
              <div style={C}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{students.length} eleves inscrits</span>
                  <button onClick={()=>showT('Tous les QR codes imprimes')} style={{ background:'#1e2d4f', color:'white', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Imprimer tous</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                  {students.map(s=>(
                    <div key={s.id} style={{ border:'1px solid #e5e9f2', borderRadius:10, padding:16, textAlign:'center' }}>
                      <div style={{ width:80, height:80, background:'#f1f4f9', borderRadius:8, margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#6b7280', border:'2px dashed #e5e9f2' }}>
                        <div>QR<br/>{s.massar?.slice(-4)||'----'}</div>
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize:10, color:'#6b7280', fontFamily:'monospace', marginBottom:8 }}>{s.massar}</div>
                      <button onClick={()=>showT('QR Code imprime pour '+s.firstName)} style={{ width:'100%', padding:'6px 0', background:'#1e2d4f', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>Imprimer</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
