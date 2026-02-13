const { Router } = require('express');
const { ScreensController } = require('../controllers/screens.controller');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

// All screen routes require authentication
router.use(authenticateToken);

// GET /api/screens - Get all screens
router.get('/', ScreensController.getAllScreens);

// GET /api/screens/:id - Get screen by ID
router.get('/:id', ScreensController.getScreenById);

// POST /api/screens - Create new screen
router.post('/', ScreensController.createScreen);

// PUT /api/screens/:id - Update screen
router.put('/:id', ScreensController.updateScreen);

// DELETE /api/screens/:id - Delete screen
router.delete('/:id', ScreensController.deleteScreen);

module.exports = router;
