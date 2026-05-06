import { useRef, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const C = { background:'white', border:'1px solid #e5e9f2', borderRadius:12, padding:20, marginBottom:14 };
const TH = { textAlign:'left', fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#6b7280', padding:'10px 12px', borderBottom:'1px solid #e5e9f2', background:'#fafbfd' };

function exportExcel(data, filename, sheetName) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename + '.xlsx');
}

export default function Rapports() {
  const [tab, setTab] = useState('paiements');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const { school } = useAuthStore();

  const DEMO_STUDENTS = [
    { massar:'B903751842', nom:'Benjelloun Youssef', classe:'6eme Excellence', taux_presence:95, moy_s1:16.4, moy_s2:17.1 },
    { massar:'G412252321', nom:'Moussa Omar', classe:'5eme A', taux_presence:88, moy_s1:13.8, moy_s2:14.2 },
    { massar:'K234567891', nom:'Alami Kenza', classe:'4eme A', taux_presence:97, moy_s1:18.2, moy_s2:18.5 },
    { massar:'L345678912', nom:'Tazi Leila', classe:'3eme Bac', taux_presence:91, moy_s1:15.1, moy_s2:15.8 },
    { massar:'M456789123', nom:'Idrissi Mehdi', classe:'6eme Excellence', taux_presence:72, moy_s1:11.3, moy_s2:12.1 },
  ];

  const DEMO_PAYMENTS = [
    { nom:'Benjelloun Youssef', classe:'6eme Excellence', mois:'Avril 2026', montant:2800, statut:'PAID', date:'01/04/2026', mode:'Especes' },
    { nom:'Moussa Omar', classe:'5eme A', mois:'Avril 2026', montant:2500, statut:'PENDING', date:'—', mode:'—' },
    { nom:'Alami Kenza', classe:'4eme A', mois:'Avril 2026', montant:2800, statut:'PAID', date:'03/04/2026', mode:'Virement' },
    { nom:'Tazi Leila', classe:'3eme Bac', mois:'Avril 2026', montant:3000, statut:'PAID', date:'02/04/2026', mode:'Cheque' },
    { nom:'Idrissi Mehdi', classe:'6eme Excellence', mois:'Avril 2026', montant:2800, statut:'PENDING', date:'—', mode:'—' },
  ];

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => setStudents(DEMO_STUDENTS));
    api.get('/payments').then(r => setPayments(r.data)).catch(() => setPayments(DEMO_PAYMENTS));
  }, []);

  const TABS = [
    { id:'paiements', lbl:'Paiements', icon:'' },
    { id:'presences', lbl:'Presences', icon:'' },
    { id:'notes', lbl:'Notes', icon:'' },
    { id:'recouvrement', lbl:'Recouvrement', icon:'' },
  ];

  const exportPaiements = () => {
    const data = DEMO_PAYMENTS.map(p => ({
      'Eleve': p.nom,
      'Classe': p.classe,
      'Mois': p.mois,
      'Montant (MAD)': p.montant,
      'Statut': p.statut === 'PAID' ? 'Regle' : 'En attente',
      'Date paiement': p.date,
      'Mode': p.mode,
    }));
    exportExcel(data, `Rapport_Paiements_${new Date().toLocaleDateString('fr-FR').replace(/\//g,'-')}`, 'Paiements');
  };

  const exportPresences = () => {
    const data = DEMO_STUDENTS.map(s => ({
      'Code Massar': s.massar,
      'Eleve': s.nom,
      'Classe': s.classe,
      'Taux presence (%)': s.taux_presence,
      'Nb absences': Math.round((100 - s.taux_presence) * 0.3),
    }));
    exportExcel(data, `Rapport_Presences_${new Date().toLocaleDateString('fr-FR').replace(/\//g,'-')}`, 'Presences');
  };

  const exportNotes = () => {
    const data = DEMO_STUDENTS.map(s => ({
      'Code Massar': s.massar,
      'Eleve': s.nom,
      'Classe': s.classe,
      'Moyenne S1': s.moy_s1,
      'Moyenne S2': s.moy_s2,
      'Moyenne annuelle': ((s.moy_s1 + s.moy_s2) / 2).toFixed(2),
      'Appreciation': s.moy_s1 >= 16 ? 'Tres Bien' : s.moy_s1 >= 14 ? 'Bien' : s.moy_s1 >= 12 ? 'Assez Bien' : 'Passable',
    }));
    exportExcel(data, `Rapport_Notes_${new Date().toLocaleDateString('fr-FR').replace(/\//g,'-')}`, 'Notes');
  };

  const paid = DEMO_PAYMENTS.filter(p => p.statut === 'PAID');
  const pending = DEMO_PAYMENTS.filter(p => p.statut === 'PENDING');
  const totalPaid = paid.reduce((a, p) => a + p.montant, 0);
  const totalPending = pending.reduce((a, p) => a + p.montant, 0);
  const recouvrement = Math.round(paid.length / DEMO_PAYMENTS.length * 100);

  return (
    <div>
      <div style={{ marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:3 }}>Rapports & Exports</h2>
          <p style={{ fontSize:12, color:'#6b7280' }}>Analyse complète — Export Excel en 1 clic</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={exportPaiements} style={{ padding:'9px 18px', background:'#16a34a', color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            Exporter Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          { lbl:'Total regle', val:totalPaid.toLocaleString('fr-FR')+' MAD', color:'#16a34a', bg:'#f0fdf4', icon:'' },
          { lbl:'En attente', val:totalPending.toLocaleString('fr-FR')+' MAD', color:'#dc2626', bg:'#fef2f2', icon:'' },
          { lbl:'Taux recouvrement', val:recouvrement+'%', color:'#2563eb', bg:'#eff6ff', icon:'' },
          { lbl:'Moy. presence', val:'89%', color:'#d97706', bg:'#fffbeb', icon:'' },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, border:'1px solid #e5e9f2', borderRadius:12, padding:'16px 18px' }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'#6b7280', marginTop:4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'#f3f4f6', borderRadius:10, padding:4, marginBottom:16, width:'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'8px 18px', borderRadius:8, border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
              background:tab===t.id?'white':'transparent', color:tab===t.id?'#111827':'#6b7280',
              boxShadow:tab===t.id?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
            {t.lbl}
          </button>
        ))}
      </div>

      {/* PAIEMENTS */}
      {tab === 'paiements' && (
        <div style={C}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>Rapport paiements — Avril 2026</div>
            <button onClick={exportPaiements} style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              Exporter Excel
            </button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Eleve','Classe','Mois','Montant','Statut','Date','Mode'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {DEMO_PAYMENTS.map((p,i) => (
                <tr key={i}>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600 }}>{p.nom}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{p.classe}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12 }}>{p.mois}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:700 }}>{p.montant.toLocaleString('fr-FR')} MAD</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                    <span style={{ background:p.statut==='PAID'?'#dcfce7':'#fee2e2', color:p.statut==='PAID'?'#16a34a':'#dc2626', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
                      {p.statut==='PAID'?'Regle':'En attente'}
                    </span>
                  </td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{p.date}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{p.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop:14, padding:'12px 16px', background:'#f8fafc', borderRadius:8, display:'flex', justifyContent:'space-between', fontSize:13 }}>
            <span>Total réglé : <strong style={{color:'#16a34a'}}>{totalPaid.toLocaleString('fr-FR')} MAD</strong></span>
            <span>En attente : <strong style={{color:'#dc2626'}}>{totalPending.toLocaleString('fr-FR')} MAD</strong></span>
            <span>Recouvrement : <strong style={{color:'#2563eb'}}>{recouvrement}%</strong></span>
          </div>
        </div>
      )}

      {/* PRESENCES */}
      {tab === 'presences' && (
        <div style={C}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>Rapport présences — Mai 2026</div>
            <button onClick={exportPresences} style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Exporter Excel
            </button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Massar','Eleve','Classe','Taux presence','Nb absences','Statut'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {DEMO_STUDENTS.map((s,i) => (
                <tr key={i}>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, fontFamily:'monospace', color:'#374151' }}>{s.massar}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600 }}>{s.nom}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{s.classe}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:6, background:'#e5e9f2', borderRadius:3 }}>
                        <div style={{ width:s.taux_presence+'%', height:6, borderRadius:3, background:s.taux_presence>=90?'#16a34a':s.taux_presence>=75?'#d97706':'#dc2626' }}></div>
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:s.taux_presence>=90?'#16a34a':s.taux_presence>=75?'#d97706':'#dc2626' }}>{s.taux_presence}%</span>
                    </div>
                  </td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600, textAlign:'center', color:'#dc2626' }}>{Math.round((100-s.taux_presence)*0.3)}</td>
                  <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20,
                      background:s.taux_presence>=90?'#dcfce7':s.taux_presence>=75?'#fef3c7':'#fee2e2',
                      color:s.taux_presence>=90?'#16a34a':s.taux_presence>=75?'#d97706':'#dc2626' }}>
                      {s.taux_presence>=90?'Excellent':s.taux_presence>=75?'Attention':'Critique'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NOTES */}
      {tab === 'notes' && (
        <div style={C}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>Rapport notes — S1 vs S2</div>
            <button onClick={exportNotes} style={{ padding:'7px 14px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Exporter Excel
            </button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Massar','Eleve','Classe','Moy. S1','Moy. S2','Evolution','Moy. Annuelle','Appreciation'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {DEMO_STUDENTS.map((s,i) => {
                const diff = (s.moy_s2 - s.moy_s1).toFixed(1);
                const moy = ((s.moy_s1 + s.moy_s2) / 2).toFixed(2);
                const app = s.moy_s1 >= 16 ? 'Tres Bien' : s.moy_s1 >= 14 ? 'Bien' : s.moy_s1 >= 12 ? 'Assez Bien' : 'Passable';
                return (
                  <tr key={i}>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, fontFamily:'monospace' }}>{s.massar}</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600 }}>{s.nom}</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:12, color:'#6b7280' }}>{s.classe}</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600, color:'#2563eb' }}>{s.moy_s1}/20</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600, color:'#16a34a' }}>{s.moy_s2}/20</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:700, color:diff>=0?'#16a34a':'#dc2626' }}>
                      {diff >= 0 ? '↑ +' : '↓ '}{diff}
                    </td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6', fontSize:14, fontWeight:700, color:'#111827' }}>{moy}/20</td>
                    <td style={{ padding:'11px 12px', borderBottom:'1px solid #f3f4f6' }}>
                      <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20,
                        background:s.moy_s1>=16?'#dcfce7':s.moy_s1>=14?'#dbeafe':s.moy_s1>=12?'#fef3c7':'#fee2e2',
                        color:s.moy_s1>=16?'#16a34a':s.moy_s1>=14?'#2563eb':s.moy_s1>=12?'#d97706':'#dc2626' }}>{app}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* RECOUVREMENT */}
      {tab === 'recouvrement' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div style={C}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Recouvrement par classe</div>
              {[['6eme Excellence',95,3],['5eme A',78,5],['4eme A',88,3],['3eme Bac',72,7]].map(([cls,pct,retard]) => (
                <div key={cls} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:500 }}>{cls}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:pct>=90?'#16a34a':pct>=75?'#d97706':'#dc2626' }}>{pct}%</span>
                  </div>
                  <div style={{ height:8, background:'#f3f4f6', borderRadius:4 }}>
                    <div style={{ width:pct+'%', height:8, borderRadius:4, background:pct>=90?'#16a34a':pct>=75?'#d97706':'#dc2626' }}></div>
                  </div>
                  <div style={{ fontSize:10, color:'#6b7280', marginTop:3 }}>{retard} impayés en retard</div>
                </div>
              ))}
            </div>
            <div style={C}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Evolution mensuelle 2025-2026</div>
              {[['Sep',45],['Oct',52],['Nov',61],['Dec',68],['Jan',74],['Fev',78],['Mar',82],['Avr',86],['Mai',89]].map(([m,v]) => (
                <div key={m} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'#6b7280', width:28 }}>{m}</span>
                  <div style={{ flex:1, height:16, background:'#f3f4f6', borderRadius:4, position:'relative' }}>
                    <div style={{ width:v+'%', height:16, borderRadius:4, background:'#1e2d4f', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6 }}>
                      <span style={{ fontSize:10, fontWeight:600, color:'white' }}>{v}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const data = [['Sep',45],['Oct',52],['Nov',61],['Dec',68],['Jan',74],['Fev',78],['Mar',82],['Avr',86],['Mai',89]]
                  .map(([m,v]) => ({ Mois:m, 'Recouvrement (%)':v }));
                exportExcel(data, 'Recouvrement_2025-2026', 'Recouvrement');
              }} style={{ marginTop:10, width:'100%', padding:'8px', background:'#1e2d4f', color:'white', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Exporter Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
