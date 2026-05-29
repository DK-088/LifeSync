const express = require('express');
const router = express.Router();
const { createReminder, getReminders, completeReminder, deleteReminder, getSmartSuggestions } = require('../controllers/reminder.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/smart-suggestions', getSmartSuggestions);
router.route('/').get(getReminders).post(createReminder);
router.patch('/:id/complete', completeReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
