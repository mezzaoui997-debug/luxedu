import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const API = import.meta.env.VITE_API_URL || 'https://luxedu-production.up.railway.app';


const DEMO_RECLAMATIONS = [
  { id: 1, parent: 'M. Rachidi Karim', eleve: 'Youssef Rachidi', sujet: 'Absence injustifiée', message: 'Mon fils était présent le 15 avril, il y a une erreur dans le système.', date: '2026-05-20', statut: 'en_attente', priorite: 'haute', reponse: null },
  { id: 2, parent: 'Mme Alaoui Fatima', eleve: 'Sara Alaoui', sujet: 'Note de contrôle', message: 'La note de 8/20 en mathématiques me semble incorrecte, pouvez-vous vérifier ?', date: '2026-05-18', statut: 'traitee', priorite: 'normale', reponse: 'Après vérification, la note est correcte. Nous vous invitons à un rendez-vous.' },
  { id: 3, parent: 'M. Benjelloun Omar', eleve: 'Youssef Benjelloun', sujet: 'Paiement non enregistré', message: 'J\'ai effectué le paiement de mai mais il n\'apparaît pas dans le système.', date: '2026-05-22', statut: 'en_cours', priorite: 'haute', reponse: null },
  { id: 4, parent: 'Mme Tazi Nadia', eleve: 'Adam Tazi', sujet: 'Comportement en classe', message: 'Mon fils se plaint d\'un problème avec un enseignant, j\'aimerais en discuter.', date: '2026-05-19', statut: 'traitee', priorite: 'normale', reponse: 'Nous avons discuté avec l\'enseignant concerné. La situation est résolue.' },
];

const STATUT_CONFIG = {
  en_attente: { label: 'En attente', color: '#d97706', bg: '#fefce8', border: '#fde68a' },
  en_cours: { label: 'En cours', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  traitee: { label: 'Traitée', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
};

const navy = '#1e2d4f';

export default function Reclamations() {
  const [reclamations, setReclamations] = useState(DEMO_RECLAMATIONS);
  const { token } = useAuthStore();

  useEffect(() => {
    fetch(API + '/api/reclamations', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setReclamations(data.map(r => ({ id: r.id, parent: r.parentPhone, eleve: r.studentId || 'Eleve', sujet: r.sujet, message: r.message, date: new Date(r.createdAt).toLocaleDateString('fr-FR'), statut: r.statut, priorite: 'normale', reponse: r.reponse }))); })
      .catch(() => {});
  }, [token]);
  const [selected, setSelected] = useState(null);
  const [reponse, setReponse] = useState('');
  const [filter, setFilter] = useState('toutes');
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = reclamations.filter(r => filter === 'toutes' ? true : r.statut === filter);

  function handleReponse(id) {
    if (!reponse.trim()) return;
    fetch(API + '/api/reclamations/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ statut: 'traitee', reponse }) }).catch(() => {});
    setReclamations(prev => prev.map(r => r.id === id ? { ...r, statut: 'traitee', reponse } : r));
    setSelected(prev => ({ ...prev, statut: 'traitee', reponse }));
    setReponse('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  function handleStatut(id, statut) {
    setReclamations(prev => prev.map(r => r.id === id ? { ...r, statut } : r));
    setSelected(prev => ({ ...prev, statut }));
  }

  const counts = {
    toutes: reclamations.length,
    en_attente: reclamations.filter(r => r.statut === 'en_attente').length,
    en_cours: reclamations.filter(r => r.statut === 'en_cours').length,
    traitee: reclamations.filter(r => r.statut === 'traitee').length,
  };

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 120px)', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Left panel */}
      <div style={{ width: 380, borderRight: '1px solid #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 16 }}>Réclamations Parents</div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'toutes', label: 'Toutes' },
              { key: 'en_attente', label: 'En attente' },
              { key: 'en_cours', label: 'En cours' },
              { key: 'traitee', label: 'Traitées' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: filter === f.key ? navy : '#f1f5f9', color: filter === f.key ? 'white' : '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                {f.label}
                <span style={{ background: filter === f.key ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: filter === f.key ? 'white' : '#64748b', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(r => {
            const s = STATUT_CONFIG[r.statut];
            return (
              <div key={r.id} onClick={() => setSelected(r)} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: selected?.id === r.id ? '#f8fafc' : 'white', borderLeft: selected?.id === r.id ? `3px solid ${navy}` : '3px solid transparent', transition: 'all .15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: navy }}>{r.parent}</div>
                  <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                    {s.label}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 4, fontWeight: 500 }}>{r.sujet}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{r.eleve}</span>
                  <span>{r.date}</span>
                </div>
                {r.priorite === 'haute' && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Priorité haute</div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 13 }}>
              Aucune réclamation
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 4 }}>{selected.sujet}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {selected.parent} · Élève : {selected.eleve} · {selected.date}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selected.statut !== 'en_cours' && selected.statut !== 'traitee' && (
                  <button onClick={() => handleStatut(selected.id, 'en_cours')} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Marquer en cours
                  </button>
                )}
                {selected.statut !== 'traitee' && (
                  <button onClick={() => handleStatut(selected.id, 'traitee')} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Marquer traitée
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {showSuccess && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#059669', fontWeight: 500 }}>
                  Réponse envoyée avec succès
                </div>
              )}

              {/* Message parent */}
              <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #f1f5f9', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Message du parent</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: navy, flexShrink: 0 }}>
                    {selected.parent.split(' ').slice(-1)[0][0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>{selected.parent}</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, background: '#f8fafc', padding: '12px 14px', borderRadius: 8 }}>{selected.message}</div>
                  </div>
                </div>
              </div>

              {/* Réponse existante */}
              {selected.reponse && (
                <div style={{ background: '#eff6ff', borderRadius: 12, padding: 20, border: '1px solid #bfdbfe', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Réponse de la direction</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      DIR
                    </div>
                    <div style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.6, background: 'white', padding: '12px 14px', borderRadius: 8, flex: 1 }}>{selected.reponse}</div>
                  </div>
                </div>
              )}

              {/* Zone réponse */}
              {selected.statut !== 'traitee' && (
                <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: navy, marginBottom: 12 }}>Répondre au parent</div>
                  <textarea value={reponse} onChange={e => setReponse(e.target.value)} placeholder="Rédigez votre réponse..." style={{ width: '100%', minHeight: 100, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor=navy} onBlur={e => e.target.style.borderColor='#e2e8f0'}/>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button onClick={() => handleReponse(selected.id)} style={{ padding: '9px 20px', borderRadius: 8, background: navy, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Envoyer la réponse
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Sélectionnez une réclamation</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
