const express = require('express');
const router = express.Router();
const { getPayments, createPayment, markPaid } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', getPayments);
router.post('/', createPayment);
router.put('/:id/pay', markPaid);
module.exports = router;
