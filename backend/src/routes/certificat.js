const express = require('express');
const router = express.Router();
const { generateCertificat, generateRecu } = require('../controllers/certificatController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/certificat/:studentId', generateCertificat);
router.get('/recu/:paymentId', generateRecu);
module.exports = router;
