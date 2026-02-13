"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const media_service_1 = require("../services/media.service");
class MediaController {
    /**
     * GET /api/media
     * Get all media files
     */
    static async getAllMedia(req, res) {
        try {
            const media = await media_service_1.MediaService.getAllMedia();
            // Add public URLs to media
            const mediaWithUrls = await Promise.all(media.map(async (item) => ({
                ...item,
                url: await media_service_1.MediaService.getMediaUrl(item.file_path)
            })));
            res.json({ media: mediaWithUrls });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * GET /api/media/:id
     * Get media by ID
     */
    static async getMediaById(req, res) {
        try {
            const { id } = req.params;
            const media = await media_service_1.MediaService.getMediaById(id);
            // Add public URL
            const mediaWithUrl = {
                ...media,
                url: await media_service_1.MediaService.getMediaUrl(media.file_path)
            };
            res.json({ media: mediaWithUrl });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    /**
     * POST /api/media/upload
     * Upload new media file
     */
    static async uploadMedia(req, res) {
        try {
            const file = req.file;
            const { name, duration } = req.body;
            // Validate file
            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            // Validate name
            if (!name || name.trim().length === 0) {
                res.status(400).json({ error: 'Media name is required' });
                return;
            }
            // Parse duration if provided
            let parsedDuration;
            if (duration) {
                parsedDuration = parseInt(duration);
                if (isNaN(parsedDuration) || parsedDuration <= 0) {
                    res.status(400).json({ error: 'Duration must be a positive number' });
                    return;
                }
            }
            const media = await media_service_1.MediaService.uploadMedia(file, name.trim(), parsedDuration);
            // Add public URL
            const mediaWithUrl = {
                ...media,
                url: await media_service_1.MediaService.getMediaUrl(media.file_path)
            };
            res.status(201).json({
                message: 'Media uploaded successfully',
                media: mediaWithUrl
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * PUT /api/media/:id
     * Update media metadata
     */
    static async updateMedia(req, res) {
        try {
            const { id } = req.params;
            const { name, duration } = req.body;
            // Validate that we have something to update
            if (!name && !duration) {
                res.status(400).json({ error: 'No valid fields to update' });
                return;
            }
            const updates = {};
            if (name)
                updates.name = name.trim();
            if (duration) {
                const parsedDuration = parseInt(duration);
                if (isNaN(parsedDuration) || parsedDuration <= 0) {
                    res.status(400).json({ error: 'Duration must be a positive number' });
                    return;
                }
                updates.duration = parsedDuration;
            }
            const media = await media_service_1.MediaService.updateMedia(id, updates);
            // Add public URL
            const mediaWithUrl = {
                ...media,
                url: await media_service_1.MediaService.getMediaUrl(media.file_path)
            };
            res.json({
                message: 'Media updated successfully',
                media: mediaWithUrl
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * DELETE /api/media/:id
     * Delete media file
     */
    static async deleteMedia(req, res) {
        try {
            const { id } = req.params;
            await media_service_1.MediaService.deleteMedia(id);
            res.json({ message: 'Media deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.MediaController = MediaController;
