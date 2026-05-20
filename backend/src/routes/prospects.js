const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');

const store = {};
const getStore = (sid) => {
  if (!store[sid]) store[sid] = [
    { id:'1', name:'Famille Rachidi',    phone:'0661234567', email:'rachidi@gmail.com', child:'Nour Rachidi',    level:'6ème', status:'NOUVEAU',   source:'WhatsApp', notes:'Intéressé par la filière excellence', createdAt:'2026-04-15' },
    { id:'2', name:'Famille Tazi',       phone:'0672345678', email:'tazi@gmail.com',    child:'Mehdi Tazi',      level:'5ème', status:'CONTACTE',  source:'Bouche à oreille', notes:'RDV fixé le 20 mai', createdAt:'2026-04-18' },
    { id:'3', name:'Famille Alaoui',     phone:'0683456789', email:'alaoui@gmail.com',  child:'Sara Alaoui',     level:'3ème', status:'VISITE',    source:'Site web', notes:'Visite effectuée, très intéressé', createdAt:'2026-04-20' },
    { id:'4', name:'Famille Bensouda',   phone:'0694567890', email:'bensouda@gmail.com',child:'Yassine Bensouda',level:'4ème', status:'INSCRIT',   source:'Facebook', notes:'Inscription confirmée', createdAt:'2026-04-22' },
    { id:'5', name:'Famille Ouazzani',   phone:'0605678901', email:'ouazzani@gmail.com',child:'Lina Ouazzani',   level:'6ème', status:'NOUVEAU',   source:'Instagram', notes:'', createdAt:'2026-05-01' },
  ];
  return store[sid];
};

router.get('/', protect, (req,res) => res.json(getStore(req.user.schoolId)));

router.post('/', protect, (req,res) => {
  const prospects = getStore(req.user.schoolId);
  const p = { id: Date.now().toString(), ...req.body, status:'NOUVEAU', createdAt: new Date().toISOString().split('T')[0] };
  prospects.unshift(p);
  res.json(p);
});

router.put('/:id', protect, (req,res) => {
  const prospects = getStore(req.user.schoolId);
  const idx = prospects.findIndex(p=>p.id===req.params.id);
  if (idx >= 0) prospects[idx] = { ...prospects[idx], ...req.body };
  res.json(prospects[idx]);
});

router.delete('/:id', protect, (req,res) => {
  const prospects = getStore(req.user.schoolId);
  const idx = prospects.findIndex(p=>p.id===req.params.id);
  if (idx >= 0) prospects.splice(idx,1);
  res.json({ ok:true });
});

module.exports = router;
