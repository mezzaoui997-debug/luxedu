const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const prisma = require('../utils/prisma');

// In-memory store per school (replace with DB in production)
const notifStore = {};

const getNotifs = (schoolId) => {
  if (!notifStore[schoolId]) {
    notifStore[schoolId] = [
      { id:'1', type:'payment', title:'Paiement en retard', message:'Youssef Benjelloun — 2 800 MAD — Avril 2026', read:false, createdAt: new Date(Date.now()-3600000).toISOString() },
      { id:'2', type:'absence', title:'Absence signalée', message:'Omar Moussa absent aujourd\'hui — 5ème A', read:false, createdAt: new Date(Date.now()-7200000).toISOString() },
      { id:'3', type:'system', title:'Sauvegarde effectuée', message:'Données sauvegardées automatiquement', read:true, createdAt: new Date(Date.now()-86400000).toISOString() },
      { id:'4', type:'payment', title:'Paiement reçu', message:'Kenza Alami — 2 800 MAD reçus', read:true, createdAt: new Date(Date.now()-172800000).toISOString() },
    ];
  }
  return notifStore[schoolId];
};

router.get('/', protect, async (req, res) => {
  const notifs = getNotifs(req.user.schoolId);
  res.json({ notifications: notifs, unread: notifs.filter(n=>!n.read).length });
});

router.put('/:id/read', protect, async (req, res) => {
  const notifs = getNotifs(req.user.schoolId);
  const n = notifs.find(n => n.id === req.params.id);
  if (n) n.read = true;
  res.json({ ok: true });
});

router.put('/read-all', protect, async (req, res) => {
  const notifs = getNotifs(req.user.schoolId);
  notifs.forEach(n => n.read = true);
  res.json({ ok: true });
});

router.post('/', protect, async (req, res) => {
  const notifs = getNotifs(req.user.schoolId);
  const { type, title, message } = req.body;
  const newNotif = { id: Date.now().toString(), type, title, message, read: false, createdAt: new Date().toISOString() };
  notifs.unshift(newNotif);
  res.json(newNotif);
});

module.exports = router;
