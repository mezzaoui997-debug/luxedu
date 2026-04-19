const express = require('express');
const router = express.Router();
const { register, login, registerTeacher, getTeachers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.post('/teacher', protect, registerTeacher);
router.get('/teachers', protect, getTeachers);
module.exports = router;
