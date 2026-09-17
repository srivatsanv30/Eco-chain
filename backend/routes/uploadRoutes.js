import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (or add protect middleware later)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Construct URL for the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: fileUrl,
      filename: req.file.filename
    }
  });
});

export default router;
