"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const screens_controller_1 = require("../controllers/screens.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All screen routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/screens - Get all screens
router.get('/', screens_controller_1.ScreensController.getAllScreens);
// GET /api/screens/:id - Get screen by ID
router.get('/:id', screens_controller_1.ScreensController.getScreenById);
// POST /api/screens - Create new screen
router.post('/', screens_controller_1.ScreensController.createScreen);
// PUT /api/screens/:id - Update screen
router.put('/:id', screens_controller_1.ScreensController.updateScreen);
// DELETE /api/screens/:id - Delete screen
router.delete('/:id', screens_controller_1.ScreensController.deleteScreen);
exports.default = router;
