const express = require('express');
const router = express.Router();
const { createSubscription, getSubscriptions, toggleSubscriptionActive, deleteSubscription } = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getSubscriptions).post(createSubscription);
router.patch('/:id/toggle', toggleSubscriptionActive);
router.delete('/:id', deleteSubscription);

module.exports = router;
