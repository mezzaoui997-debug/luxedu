const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const store = {};
const getStore = (sid) => {
  if (!store[sid]) store[sid] = [
    { id:'1', classId:'6exc', className:'6ème Excellence', subject:'Mathématiques', teacherName:'Sara Alami', type:'DEVOIR', title:'Exercices algèbre — chapitre 4', description:'Faire les exercices 1 à 8 page 67 du manuel. Attention aux exercices 5 et 6 qui nécessitent les formules du cours.', dueDate:'2026-05-22', assignedDate:'2026-05-18', done:false, attachments:[] },
    { id:'2', classId:'6exc', className:'6ème Excellence', subject:'Français', teacherName:'Mohamed Alami', type:'LECON', title:'Récitation — poème de Victor Hugo', description:'Apprendre par coeur les deux premières strophes du poème "Demain dès l\'aube". Interprétation devant la classe jeudi.', dueDate:'2026-05-21', assignedDate:'2026-05-18', done:false, attachments:[] },
    { id:'3', classId:'5a', className:'5ème A', subject:'Sciences', teacherName:'Khadija Tazi', type:'PROJET', title:'Exposé sur le système solaire', description:'Préparer un exposé de 10 minutes sur le système solaire. Travail en binôme. Supports visuels demandés.', dueDate:'2026-05-28', assignedDate:'2026-05-15', done:false, attachments:[] },
    { id:'4', classId:'6exc', className:'6ème Excellence', subject:'Mathématiques', teacherName:'Sara Alami', type:'DEVOIR', title:'Contrôle fractions — corrigé distribué', description:'Le corrigé du contrôle sur les fractions a été distribué. Réviser les erreurs avant le cours de vendredi.', dueDate:'2026-05-16', assignedDate:'2026-05-14', done:true, attachments:[] },
  ];
  return store[sid];
};

router.get('/', protect, (req, res) => {
  const items = getStore(req.schoolId);
  const { classId, subject } = req.query;
  let filtered = items;
  if (classId) filtered = filtered.filter(i => i.classId === classId);
  if (subject) filtered = filtered.filter(i => i.subject === subject);
  res.json(filtered);
});

router.post('/', protect, (req, res) => {
  const items = getStore(req.schoolId);
  const item = {
    id: Date.now().toString(),
    ...req.body,
    teacherName: `${req.firstName} ${req.lastName}`,
    assignedDate: new Date().toISOString().split('T')[0],
    done: false,
    attachments: [],
  };
  items.unshift(item);
  res.json(item);
});

router.put('/:id', protect, (req, res) => {
  const items = getStore(req.schoolId);
  const idx = items.findIndex(i => i.id === req.params.id);
  if (idx >= 0) items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

router.delete('/:id', protect, (req, res) => {
  const items = getStore(req.schoolId);
  const idx = items.findIndex(i => i.id === req.params.id);
  if (idx >= 0) items.splice(idx, 1);
  res.json({ ok: true });
});

module.exports = router;
