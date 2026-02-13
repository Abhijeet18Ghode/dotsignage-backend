const { Router } = require('express');
const multer = require('multer');
const { MediaController } = require('../controllers/media.controller');
const { authenticateToken } = require('../middleware/auth');
const { config } = require('../config/env');

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// All media routes require authentication
router.use(authenticateToken);

// GET /api/media - Get all media
router.get('/', MediaController.getAllMedia);

// GET /api/media/:id - Get media by ID
router.get('/:id', MediaController.getMediaById);

// POST /api/media/upload - Upload new media
router.post('/upload', upload.single('file'), MediaController.uploadMedia);

// PUT /api/media/:id - Update media metadata
router.put('/:id', MediaController.updateMedia);

// DELETE /api/media/:id - Delete media
router.delete('/:id', MediaController.deleteMedia);

module.exports = router;
