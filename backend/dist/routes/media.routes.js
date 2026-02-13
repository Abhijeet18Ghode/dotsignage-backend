"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const media_controller_1 = require("../controllers/media.controller");
const auth_1 = require("../middleware/auth");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: env_1.config.upload.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        if (env_1.config.upload.allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only images and videos are allowed.'));
        }
    }
});
// All media routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/media - Get all media
router.get('/', media_controller_1.MediaController.getAllMedia);
// GET /api/media/:id - Get media by ID
router.get('/:id', media_controller_1.MediaController.getMediaById);
// POST /api/media/upload - Upload new media
router.post('/upload', upload.single('file'), media_controller_1.MediaController.uploadMedia);
// PUT /api/media/:id - Update media metadata
router.put('/:id', media_controller_1.MediaController.updateMedia);
// DELETE /api/media/:id - Delete media
router.delete('/:id', media_controller_1.MediaController.deleteMedia);
exports.default = router;
