const billScannerService = require('../services/ocr/billScanner.service');
const Expense = require('../models/Expense');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const fs = require('fs');

// @desc    Scan a bill image and extract expense data
// @route   POST /api/ocr/scan
// @access  Private
const scanBill = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'Please upload an image file.');

    const ocrResult = await billScannerService.scan(req.file.path);

    // Auto-create expense from OCR result if confident
    let savedExpense = null;
    if (ocrResult.amount && ocrResult.confidence > 0.7) {
      savedExpense = await Expense.create({
        userId: req.user._id,
        amount: ocrResult.amount,
        merchant: ocrResult.merchant || 'Unknown',
        category: ocrResult.category || 'Others',
        description: ocrResult.rawText?.substring(0, 200),
        source: 'ocr',
        receiptImage: req.file.filename,
        aiConfidence: ocrResult.confidence,
      });
    }

    return sendSuccess(res, 200, 'Bill scanned successfully.', { ocrResult, savedExpense });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(error);
  }
};

module.exports = { scanBill };
