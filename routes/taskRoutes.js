const express = require('express');
const multer = require('multer');
const path = require('path');
const { processTask } = require('../services/retrievalService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage });

router.post('/process-task', upload.array('documents', 10), async (req, res) => {
  const { task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ error: 'Task input is required.' });
  }

  const uploadedFiles = (req.files || []).map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`
  }));

  try {
    const result = await processTask(task.trim(), uploadedFiles);
    return res.json(result);
  } catch (error) {
    // Keep error output generic in API responses for hackathon safety.
    return res.status(500).json({
      error: 'Failed to process task.',
      details: error.message
    });
  }
});

module.exports = router;
