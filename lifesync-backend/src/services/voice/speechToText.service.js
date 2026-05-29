const { OpenAI } = require('openai');
const aiConfig = require('../../config/ai.config');
const fs = require('fs');

const openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });

/**
 * Transcribe an audio file using OpenAI Whisper
 * @param {string} filePath - Path to audio file (mp3, wav, m4a, etc.)
 * @returns {string} Transcription text
 */
const transcribe = async (filePath) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: aiConfig.whisper.model,
      language: aiConfig.whisper.language,
    });
    return response.text;
  } catch (error) {
    console.error('Speech-to-text error:', error.message);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

module.exports = { transcribe };
