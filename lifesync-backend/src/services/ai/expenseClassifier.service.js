const { OpenAI } = require('openai');
const aiConfig = require('../../config/ai.config');
const { EXPENSE_CATEGORIES } = require('../../utils/constants');

const openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });

/**
 * Classify expense category using AI
 * @param {string} merchant - Merchant or description
 * @param {number} amount
 * @returns {{ category: string, confidence: number }}
 */
const classify = async (merchant, amount) => {
  try {
    const prompt = `
You are a financial expense classifier for Indian users.
Classify the following expense into one of these categories:
${EXPENSE_CATEGORIES.join(', ')}

Merchant/Description: "${merchant}"
Amount: ₹${amount}

Respond in JSON format: { "category": "<category>", "confidence": <0.0-1.0> }
    `.trim();

    const response = await openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      category: EXPENSE_CATEGORIES.includes(result.category) ? result.category : 'Others',
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('AI Classification failed:', error.message);
    return { category: 'Others', confidence: 0 };
  }
};

module.exports = { classify };
