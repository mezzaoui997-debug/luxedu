const express = require('express');
const router = express.Router();
const { generateCertificat } = require('../controllers/certificatController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/certificat/:studentId', generateCertificat);
module.exports = router;
