const mongoose = require('mongoose');

const voiceCommandSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    audioFile: { type: String, default: null },
    transcription: { type: String, trim: true },
    intent: {
      type: String,
      enum: ['add_expense', 'check_balance', 'set_reminder', 'query_analytics', 'add_debt', 'unknown'],
      default: 'unknown',
    },
    entities: { type: mongoose.Schema.Types.Mixed, default: {} },
    processed: { type: Boolean, default: false },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    confidence: { type: Number, min: 0, max: 1, default: null },
    processingTime: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VoiceCommand', voiceCommandSchema);
