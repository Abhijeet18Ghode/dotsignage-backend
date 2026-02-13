"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistsController = void 0;
const playlists_service_1 = require("../services/playlists.service");
class PlaylistsController {
    /**
     * GET /api/playlists
     * Get all playlists
     */
    static async getAllPlaylists(req, res) {
        try {
            const playlists = await playlists_service_1.PlaylistsService.getAllPlaylists();
            res.json({ playlists });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * GET /api/playlists/:id
     * Get playlist by ID with media
     */
    static async getPlaylistById(req, res) {
        try {
            const { id } = req.params;
            const playlist = await playlists_service_1.PlaylistsService.getPlaylistById(id);
            res.json({ playlist });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    /**
     * POST /api/playlists
     * Create new playlist
     */
    static async createPlaylist(req, res) {
        try {
            const { name, description, media_ids } = req.body;
            // Validate input
            if (!name || name.trim().length === 0) {
                res.status(400).json({ error: 'Playlist name is required' });
                return;
            }
            // Validate media_ids if provided
            if (media_ids && !Array.isArray(media_ids)) {
                res.status(400).json({ error: 'media_ids must be an array' });
                return;
            }
            const playlistData = {
                name: name.trim(),
                description: description?.trim(),
                media_ids: media_ids || []
            };
            const playlist = await playlists_service_1.PlaylistsService.createPlaylist(playlistData);
            res.status(201).json({
                message: 'Playlist created successfully',
                playlist
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * PUT /api/playlists/:id
     * Update playlist details
     */
    static async updatePlaylist(req, res) {
        try {
            const { id } = req.params;
            const { name, description, is_active } = req.body;
            // Validate that we have something to update
            if (!name && !description && is_active === undefined) {
                res.status(400).json({ error: 'No valid fields to update' });
                return;
            }
            const updates = {};
            if (name)
                updates.name = name.trim();
            if (description !== undefined)
                updates.description = description?.trim();
            if (is_active !== undefined)
                updates.is_active = Boolean(is_active);
            const playlist = await playlists_service_1.PlaylistsService.updatePlaylist(id, updates);
            res.json({
                message: 'Playlist updated successfully',
                playlist
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * PUT /api/playlists/:id/media
     * Update playlist media order
     */
    static async updatePlaylistMedia(req, res) {
        try {
            const { id } = req.params;
            const { media_ids } = req.body;
            // Validate media_ids
            if (!Array.isArray(media_ids)) {
                res.status(400).json({ error: 'media_ids must be an array' });
                return;
            }
            await playlists_service_1.PlaylistsService.updatePlaylistMedia(id, media_ids);
            res.json({ message: 'Playlist media updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * DELETE /api/playlists/:id
     * Delete playlist
     */
    static async deletePlaylist(req, res) {
        try {
            const { id } = req.params;
            await playlists_service_1.PlaylistsService.deletePlaylist(id);
            res.json({ message: 'Playlist deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PlaylistsController = PlaylistsController;
