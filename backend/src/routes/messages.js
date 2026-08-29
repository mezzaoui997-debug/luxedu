const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// In-memory per school (upgrade to DB later)
const store = {};
const threads = (sid) => {
  if (!store[sid]) store[sid] = [
    { id:'1', subject:'Réunion pédagogique vendredi', from:'Ahmed Benali', fromRole:'DIRECTOR', to:'all', body:'Bonjour à tous, je vous rappelle la réunion pédagogique vendredi 23 mai à 14h00 en salle de réunion. Présence obligatoire. Merci.', read:false, createdAt: new Date(Date.now()-3600000).toISOString(), replies:[] },
    { id:'2', subject:'Résultats contrôle Mathématiques — 6ème Exc.', from:'Sara Alami', fromRole:'TEACHER', to:'DIRECTOR', body:'Bonjour M. le Directeur, vous trouverez ci-joint les résultats du contrôle de mathématiques de la 6ème Excellence. Moyenne de classe : 14.8/20. 3 élèves en difficulté à surveiller.', read:true, createdAt: new Date(Date.now()-86400000).toISOString(), replies:[
      { id:'r1', from:'Ahmed Benali', fromRole:'DIRECTOR', body:'Merci Mme Alami. Pouvez-vous prévoir un soutien pour ces 3 élèves la semaine prochaine ?', createdAt: new Date(Date.now()-82800000).toISOString() }
    ]},
    { id:'3', subject:'Absence de Youssef Benjelloun', from:'Fatima Benali', fromRole:'FONCTIONNAIRE', to:'TEACHER', body:'Mme Alami, la famille Benjelloun a signalé que Youssef sera absent demain pour raison médicale. Un certificat sera fourni dès son retour.', read:true, createdAt: new Date(Date.now()-172800000).toISOString(), replies:[] },
  ];
  return store[sid];
};

// GET all messages for user
router.get('/', protect, (req, res) => {
  const msgs = threads(req.schoolId);
  const unread = msgs.filter(m => !m.read && m.to !== req.role.toLowerCase()).length;
  res.json({ messages: msgs, unread });
});

// GET single message + mark read
router.get('/:id', protect, (req, res) => {
  const msgs = threads(req.schoolId);
  const msg = msgs.find(m => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  msg.read = true;
  res.json(msg);
});

// POST new message
router.post('/', protect, (req, res) => {
  const msgs = threads(req.schoolId);
  const { subject, body, to } = req.body;
  const msg = {
    id: Date.now().toString(),
    subject, body, to,
    from: `${req.firstName} ${req.lastName}`,
    fromRole: req.role,
    read: false,
    createdAt: new Date().toISOString(),
    replies: [],
  };
  msgs.unshift(msg);
  res.json(msg);
});

// POST reply
router.post('/:id/reply', protect, (req, res) => {
  const msgs = threads(req.schoolId);
  const msg = msgs.find(m => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  const reply = {
    id: Date.now().toString(),
    from: `${req.firstName} ${req.lastName}`,
    fromRole: req.role,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };
  msg.replies.push(reply);
  res.json(reply);
});

// DELETE message
router.delete('/:id', protect, (req, res) => {
  const msgs = threads(req.schoolId);
  const idx = msgs.findIndex(m => m.id === req.params.id);
  if (idx >= 0) msgs.splice(idx, 1);
  res.json({ ok: true });
});

module.exports = router;
