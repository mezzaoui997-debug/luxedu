const express = require('express');
const router = express.Router();
const { getClasses, createClass } = require('../controllers/classController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', getClasses);
router.post('/', createClass);
module.exports = router;
