const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { processVoiceCommand, getVoiceHistory } = require('../controllers/voice.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

const storage = multer.diskStorage({
  destination: 'uploads/voice/',
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);
router.post('/command', aiLimiter, upload.single('audio'), processVoiceCommand);
router.get('/history', getVoiceHistory);

module.exports = router;
