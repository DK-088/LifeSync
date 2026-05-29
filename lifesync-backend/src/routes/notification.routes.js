const express = require('express');
const router = express.Router();
const { parseNotification, getTransactions } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/parse', parseNotification);
router.get('/transactions', getTransactions);

module.exports = router;
