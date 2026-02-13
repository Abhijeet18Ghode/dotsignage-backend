"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlists_controller_1 = require("../controllers/playlists.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All playlist routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/playlists - Get all playlists
router.get('/', playlists_controller_1.PlaylistsController.getAllPlaylists);
// GET /api/playlists/:id - Get playlist by ID with media
router.get('/:id', playlists_controller_1.PlaylistsController.getPlaylistById);
// POST /api/playlists - Create new playlist
router.post('/', playlists_controller_1.PlaylistsController.createPlaylist);
// PUT /api/playlists/:id - Update playlist
router.put('/:id', playlists_controller_1.PlaylistsController.updatePlaylist);
// PUT /api/playlists/:id/media - Update playlist media order
router.put('/:id/media', playlists_controller_1.PlaylistsController.updatePlaylistMedia);
// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', playlists_controller_1.PlaylistsController.deletePlaylist);
exports.default = router;
