const express = require('express');
const router = express.Router();
const { getGrades, saveGrade } = require('../controllers/gradeController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', getGrades);
router.post('/', saveGrade);
module.exports = router;
