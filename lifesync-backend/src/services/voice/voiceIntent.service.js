const { OpenAI } = require('openai');
const aiConfig = require('../../config/ai.config');

const openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });

const INTENTS = ['add_expense', 'check_balance', 'set_reminder', 'query_analytics', 'add_debt', 'unknown'];

/**
 * Detect intent and entities from a voice transcription
 * @param {string} text - Transcribed voice input
 * @returns {{ intent: string, entities: Object, confidence: number }}
 */
const detectIntent = async (text) => {
  try {
    const prompt = `
Analyze this voice command from a personal finance app user:
"${text}"

Extract:
1. intent (one of: ${INTENTS.join(', ')})
2. entities (JSON with relevant fields like amount, category, merchant, date, personName etc.)
3. confidence (0.0-1.0)

Respond in JSON: { "intent": "...", "entities": {}, "confidence": 0.0 }
    `.trim();

    const response = await openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      intent: INTENTS.includes(result.intent) ? result.intent : 'unknown',
      entities: result.entities || {},
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('Intent detection failed:', error.message);
    return { intent: 'unknown', entities: {}, confidence: 0 };
  }
};

module.exports = { detectIntent };
