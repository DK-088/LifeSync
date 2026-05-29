const { OpenAI } = require('openai');
const aiConfig = require('../../config/ai.config');
const Expense = require('../../models/Expense');
const { getCurrentMonthRange } = require('../../utils/dateHelper');

const openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });

/**
 * Check if a user can afford a purchase based on spending history
 * @param {string} userId
 * @param {number} purchaseAmount
 * @param {string} purchaseDescription
 * @param {number} monthlyIncome
 * @returns {Object} affordability analysis
 */
const checkAffordability = async (userId, purchaseAmount, purchaseDescription, monthlyIncome) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const expenses = await Expense.aggregate([
      { $match: { userId, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
    ]);

    const totalSpent = expenses[0]?.totalSpent || 0;
    const remaining = monthlyIncome - totalSpent;
    const canAfford = remaining >= purchaseAmount;

    const prompt = `
You are a personal finance advisor for Indian users.
Monthly Income: ₹${monthlyIncome}
Already Spent This Month: ₹${totalSpent}
Remaining Budget: ₹${remaining}
Requested Purchase: "${purchaseDescription}" for ₹${purchaseAmount}

Give a brief, friendly affordability analysis in 2-3 sentences. End with a clear recommendation.
    `.trim();

    const response = await openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.4,
    });

    return {
      canAfford,
      totalSpent,
      remaining,
      purchaseAmount,
      adviceText: response.choices[0].message.content,
    };
  } catch (error) {
    console.error('Affordability check failed:', error.message);
    return { canAfford: null, error: 'Could not check affordability at this time.' };
  }
};

module.exports = { checkAffordability };
