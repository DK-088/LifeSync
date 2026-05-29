const { OPENAI_API_KEY, GEMINI_API_KEY } = require('./env');

const aiConfig = {
  openai: {
    apiKey: OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    maxTokens: 1024,
    temperature: 0.3,
  },
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    maxTokens: 1024,
  },
  whisper: {
    model: 'whisper-1',
    language: 'en',
  },
  ocr: {
    lang: 'eng',
    tessdataPath: './tessdata',
  },
};

module.exports = aiConfig;
