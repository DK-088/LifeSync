const Tesseract = require('tesseract.js');
const aiConfig = require('../../config/ai.config');
const { classify } = require('../ai/expenseClassifier.service');

/**
 * Scan a bill image and extract expense data using OCR
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Object} Extracted expense data
 */
const scan = async (imagePath) => {
  try {
    const { data } = await Tesseract.recognize(imagePath, aiConfig.ocr.lang, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          // Progress callback - suppressed in production
        }
      },
    });

    const rawText = data.text;
    const amount = extractAmount(rawText);
    const merchant = extractMerchant(rawText);
    const date = extractDate(rawText);
    const confidence = data.confidence / 100;

    let category = 'Others';
    if (merchant && amount) {
      const classified = await classify(merchant, amount);
      category = classified.category;
    }

    return { rawText, amount, merchant, date, category, confidence };
  } catch (error) {
    console.error('OCR scan error:', error.message);
    throw new Error('Failed to scan bill. Please try again with a clearer image.');
  }
};

const extractAmount = (text) => {
  const match = text.match(/(?:total|amount|grand total|net amount|rs\.?|₹)[:\s]*(\d+(?:[.,]\d{1,2})?)/i);
  return match ? parseFloat(match[1].replace(',', '')) : null;
};

const extractMerchant = (text) => {
  const lines = text.split('\n').filter((l) => l.trim().length > 3);
  return lines[0]?.trim().substring(0, 40) || 'Unknown';
};

const extractDate = (text) => {
  const match = text.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/);
  return match ? match[0] : null;
};

module.exports = { scan };
