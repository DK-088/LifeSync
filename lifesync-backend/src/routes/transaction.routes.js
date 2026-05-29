const express = require('express');
const router = express.Router();
const { getTransactions, getTransactionById, deleteTransaction } = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.delete('/:id', deleteTransaction);

module.exports = router;
