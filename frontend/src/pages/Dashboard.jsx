import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Dashboard({ setPage }) {
  const { user, school } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
    api.get('/classes').then(r => setClasses(r.data)).catch(() => {});
    api.get('/payments').then(r => setPayments(r.data)).catch(() => {});
  }, []);

  const pending = payments.filter(p => p.status === 'PENDING');

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:21, fontWeight:700, color:'var(--navy)', marginBottom:2 }}>
          Bonjour, {user?.firstName} 👋
        </div>
        <div style={{ fontSize:13, color:'var(--g2)' }}>
          Bienvenue sur votre tableau de bord · {school?.name}
        </div>
      </div>

      <div className="metrics">
        <div className="metric" onClick={() => setPage('eleves')}>
          <div className="mic" style={{ background:'#E6F1FB' }}>👥</div>
          <div className="mlbl">Eleves inscrits</div>
          <div className="mval">{students.length}</div>
          <div className="msub" style={{ color:'var(--green)' }}>actifs cette annee</div>
        </div>
        <div className="metric" onClick={() => setPage('presences')}>
          <div className="mic" style={{ background:'#EAF3DE' }}>✅</div>
          <div className="mlbl">Presence</div>
          <div className="mval">94<span style={{ fontSize:16, color:'var(--g2)' }}>%</span></div>
          <div className="msub" style={{ color:'var(--green)' }}>vs hier</div>
        </div>
        <div className="metric" onClick={() => setPage('notes')}>
          <div className="mic" style={{ background:'#FAEEDA' }}>📊</div>
          <div className="mlbl">Moyenne generale</div>
          <div className="mval">14<span style={{ fontSize:16, color:'var(--g2)' }}>.7</span></div>
          <div className="msub" style={{ color:'var(--red)' }}>vs S1</div>
        </div>
        <div className="metric" onClick={() => setPage('paiements')}>
          <div className="mic" style={{ background:'#FCEBEB' }}>💰</div>
          <div className="mlbl">Paiements en attente</div>
          <div className="mval">{pending.length}</div>
          <div className="msub" style={{ color:'var(--amber)' }}>
            {pending.reduce((a,p) => a + p.amount, 0).toLocaleString('fr-FR')} MAD
          </div>
        </div>
      </div>

      <div className="g3">
        <div className="card cp">
          <div className="ch">
            <div className="ct">Eleves recents</div>
            <button className="btn btn-out btn-sm" onClick={() => setPage('eleves')}>Voir tous</button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Eleve</th>
                <th>Code Massar</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0,5).map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="tav">
                      <div className="av" style={{ width:30, height:30, fontSize:10, background:'#E6F1FB', color:'#0C447C' }}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize:11, color:'var(--g2)' }}>{s.parentPhone || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--navy)' }}>{s.massar}</td>
                  <td><span className="badge b-g">Actif</span></td>
                  <td>
                    <button className="btn btn-out btn-sm" onClick={() => setPage('eleves')}>Profil</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={4} style={{ padding:20, textAlign:'center', color:'var(--g2)' }}>
                  Aucun eleve
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card cp">
          <div className="ch"><div className="ct">Actions rapides</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button className="btn btn-navy" style={{ justifyContent:'flex-start', width:'100%' }} onClick={() => setPage('eleves')}>
              + Ajouter un eleve
            </button>
            <button className="btn btn-out" style={{ justifyContent:'flex-start', width:'100%' }} onClick={() => setPage('presences')}>
              ✅ Faire appel
            </button>
            <button className="btn btn-out" style={{ justifyContent:'flex-start', width:'100%' }} onClick={() => setPage('notes')}>
              📊 Saisir les notes
            </button>
            <button className="btn btn-out" style={{ justifyContent:'flex-start', width:'100%' }} onClick={() => setPage('bulletins')}>
              📄 Generer bulletins
            </button>
            <button className="btn btn-wa" style={{ justifyContent:'flex-start', width:'100%' }}>
              💬 Message WhatsApp groupe
            </button>
          </div>

          {pending.length > 0 && (
            <div style={{ marginTop:14, padding:12, background:'#FCEBEB', borderRadius:8 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--red)', marginBottom:4 }}>
                {pending.length} paiement(s) en attente
              </div>
              <div style={{ fontSize:11, color:'var(--g2)' }}>
                {pending.reduce((a,p) => a + p.amount, 0).toLocaleString('fr-FR')} MAD non recouvres
              </div>
              <button className="btn btn-out btn-sm" style={{ marginTop:8 }} onClick={() => setPage('paiements')}>
                Voir les paiements
              </button>
            </div>
          )}

          <div style={{ marginTop:14, padding:12, background:'var(--bl)', borderRadius:8 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>
              Statistiques
            </div>
            <div className="br-row" style={{ marginBottom:6 }}>
              <div className="br-lbl">Classes</div>
              <div className="br-track"><div className="br-fill" style={{ width: Math.min(classes.length * 10, 100) + '%', background:'var(--blue)' }}></div></div>
              <div className="br-val">{classes.length}</div>
            </div>
            <div className="br-row" style={{ marginBottom:6 }}>
              <div className="br-lbl">Eleves</div>
              <div className="br-track"><div className="br-fill" style={{ width: Math.min(students.length * 2, 100) + '%', background:'var(--green)' }}></div></div>
              <div className="br-val">{students.length}</div>
            </div>
            <div className="br-row">
              <div className="br-lbl">Paiements</div>
              <div className="br-track"><div className="br-fill" style={{ width: payments.length > 0 ? Math.round((payments.filter(p=>p.status==='PAID').length/payments.length)*100) + '%' : '0%', background:'var(--gold)' }}></div></div>
              <div className="br-val">{payments.length > 0 ? Math.round((payments.filter(p=>p.status==='PAID').length/payments.length)*100) : 0}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
