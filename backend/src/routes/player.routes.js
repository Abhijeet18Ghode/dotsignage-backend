const { Router } = require('express');
const { PlayerController } = require('../controllers/player.controller');

const router = Router();

// Player routes don't require authentication (device code is the auth)

// GET /api/player/playlist/:deviceCode - Get playlist for device
router.get('/playlist/:deviceCode', PlayerController.getPlaylistByDeviceCode);

// POST /api/player/heartbeat/:deviceCode - Update device last seen
router.post('/heartbeat/:deviceCode', PlayerController.updateHeartbeat);

// GET /api/player/status/:deviceCode - Get device status
router.get('/status/:deviceCode', PlayerController.getDeviceStatus);

module.exports = router;
