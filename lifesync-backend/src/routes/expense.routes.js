const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createExpenseSchema } = require('../validators/expense.validator');

router.use(protect);

router.get('/summary', getExpenseSummary);
router.route('/').get(getExpenses).post(validate(createExpenseSchema), createExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
