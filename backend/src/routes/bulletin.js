const express = require('express');
const router = express.Router();
const { generateBulletin } = require('../controllers/bulletinController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/:studentId/:semester', generateBulletin);
module.exports = router;
