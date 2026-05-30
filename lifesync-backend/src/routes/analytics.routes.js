const express = require('express');
const router = express.Router();
const { getDashboard, getSpendingAnalytics, getSavingsPrediction, getFinancialHealth, recalculateFinancialHealth, checkAffordabilityController, getSpendHabits } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/dashboard', getDashboard);
router.get('/spending', getSpendingAnalytics);
router.get('/savings-prediction', getSavingsPrediction);
router.get('/health', getFinancialHealth);
router.post('/health/recalculate', recalculateFinancialHealth);
router.post('/affordability', checkAffordabilityController);
router.get('/habits', getSpendHabits);

module.exports = router;
