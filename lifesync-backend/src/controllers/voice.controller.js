const speechToTextService = require('../services/voice/speechToText.service');
const voiceIntentService = require('../services/voice/voiceIntent.service');
const voiceExpenseParserService = require('../services/voice/voiceExpenseParser.service');
const VoiceCommand = require('../models/VoiceCommand');
const Expense = require('../models/Expense');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Process voice command (audio file or text)
// @route   POST /api/voice/command
// @access  Private
const processVoiceCommand = async (req, res, next) => {
  try {
    const start = Date.now();
    let transcription = req.body.text;

    // If audio file uploaded, transcribe first
    if (req.file) {
      transcription = await speechToTextService.transcribe(req.file.path);
    }

    if (!transcription) return sendError(res, 400, 'No voice input provided.');

    const { intent, entities, confidence } = await voiceIntentService.detectIntent(transcription);
    let result = null;

    if (intent === 'add_expense') {
      const expenseData = await voiceExpenseParserService.parseExpense(transcription, entities);
      result = await Expense.create({ ...expenseData, userId: req.user._id, source: 'voice' });
    }

    const voiceCommand = await VoiceCommand.create({
      userId: req.user._id,
      audioFile: req.file ? req.file.filename : null,
      transcription,
      intent,
      entities,
      confidence,
      processed: true,
      result,
      processingTime: Date.now() - start,
    });

    return sendSuccess(res, 200, `Voice command processed: ${intent}`, { voiceCommand, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get voice command history
// @route   GET /api/voice/history
// @access  Private
const getVoiceHistory = async (req, res, next) => {
  try {
    const history = await VoiceCommand.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return sendSuccess(res, 200, 'Voice history fetched.', history);
  } catch (error) {
    next(error);
  }
};

module.exports = { processVoiceCommand, getVoiceHistory };
