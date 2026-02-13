"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreensController = void 0;
const screens_service_1 = require("../services/screens.service");
class ScreensController {
    /**
     * GET /api/screens
     * Get all screens
     */
    static async getAllScreens(req, res) {
        try {
            const screens = await screens_service_1.ScreensService.getAllScreens();
            res.json({ screens });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * GET /api/screens/:id
     * Get screen by ID
     */
    static async getScreenById(req, res) {
        try {
            const { id } = req.params;
            const screen = await screens_service_1.ScreensService.getScreenById(id);
            res.json({ screen });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    /**
     * POST /api/screens
     * Create new screen with auto-generated device code
     */
    static async createScreen(req, res) {
        try {
            const { name, location } = req.body;
            // Validate input
            if (!name || name.trim().length === 0) {
                res.status(400).json({ error: 'Screen name is required' });
                return;
            }
            const screenData = {
                name: name.trim(),
                location: location?.trim()
            };
            const screen = await screens_service_1.ScreensService.createScreen(screenData);
            res.status(201).json({
                message: 'Screen created successfully',
                screen
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * PUT /api/screens/:id
     * Update screen
     */
    static async updateScreen(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            // Validate that we have something to update
            if (!updates.name && !updates.location && updates.is_active === undefined) {
                res.status(400).json({ error: 'No valid fields to update' });
                return;
            }
            const screen = await screens_service_1.ScreensService.updateScreen(id, updates);
            res.json({
                message: 'Screen updated successfully',
                screen
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * DELETE /api/screens/:id
     * Delete screen
     */
    static async deleteScreen(req, res) {
        try {
            const { id } = req.params;
            await screens_service_1.ScreensService.deleteScreen(id);
            res.json({ message: 'Screen deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ScreensController = ScreensController;
