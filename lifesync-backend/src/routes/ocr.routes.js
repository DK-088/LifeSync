const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { scanBill } = require('../controllers/ocr.controller');
const { protect } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: 'uploads/bills/',
  filename: (req, file, cb) => cb(null, `bill-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only image files and PDFs are allowed.'));
  },
});

router.use(protect);
router.post('/scan', upload.single('bill'), scanBill);

module.exports = router;
