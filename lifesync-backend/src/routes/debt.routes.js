const express = require('express');
const router = express.Router();
const { addDebt, getDebts, payDebt, deleteDebt } = require('../controllers/debt.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getDebts).post(addDebt);
router.patch('/:id/pay', payDebt);
router.delete('/:id', deleteDebt);

module.exports = router;
