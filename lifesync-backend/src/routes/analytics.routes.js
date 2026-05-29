const express = require('express');
const router = express.Router();
const { getDashboard, getSpendingAnalytics, getSavingsPrediction } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/dashboard', getDashboard);
router.get('/spending', getSpendingAnalytics);
router.get('/savings-prediction', getSavingsPrediction);

module.exports = router;
