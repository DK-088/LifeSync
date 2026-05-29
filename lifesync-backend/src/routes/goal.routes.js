const express = require('express');
const router = express.Router();
const { createGoal, getGoals, contributeToGoal, deleteGoal } = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getGoals).post(createGoal);
router.patch('/:id/contribute', contributeToGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
