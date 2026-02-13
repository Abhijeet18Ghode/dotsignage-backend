const { Router } = require('express');
const { PlaylistsController } = require('../controllers/playlists.controller');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

// All playlist routes require authentication
router.use(authenticateToken);

// GET /api/playlists - Get all playlists
router.get('/', PlaylistsController.getAllPlaylists);

// GET /api/playlists/:id - Get playlist by ID with media
router.get('/:id', PlaylistsController.getPlaylistById);

// POST /api/playlists - Create new playlist
router.post('/', PlaylistsController.createPlaylist);

// PUT /api/playlists/:id - Update playlist
router.put('/:id', PlaylistsController.updatePlaylist);

// PUT /api/playlists/:id/media - Update playlist media order
router.put('/:id/media', PlaylistsController.updatePlaylistMedia);

// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', PlaylistsController.deletePlaylist);

module.exports = router;
