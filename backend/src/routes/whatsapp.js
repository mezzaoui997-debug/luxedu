const express = require('express');
const router = express.Router();
const { sendCustomMessage, sendPaymentReminders, sendAbsenceNotif } = require('../controllers/whatsappController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.post('/send', sendCustomMessage);
router.post('/payment-reminders', sendPaymentReminders);
router.post('/absence', sendAbsenceNotif);
module.exports = router;
