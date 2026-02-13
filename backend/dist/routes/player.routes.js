"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const player_controller_1 = require("../controllers/player.controller");
const router = (0, express_1.Router)();
// Player routes don't require authentication (device code is the auth)
// GET /api/player/playlist/:deviceCode - Get playlist for device
router.get('/playlist/:deviceCode', player_controller_1.PlayerController.getPlaylistByDeviceCode);
// POST /api/player/heartbeat/:deviceCode - Update device last seen
router.post('/heartbeat/:deviceCode', player_controller_1.PlayerController.updateHeartbeat);
// GET /api/player/status/:deviceCode - Get device status
router.get('/status/:deviceCode', player_controller_1.PlayerController.getDeviceStatus);
exports.default = router;
