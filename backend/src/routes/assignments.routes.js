const { Router } = require('express');
const { AssignmentsController } = require('../controllers/assignments.controller');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

// All assignment routes require authentication
router.use(authenticateToken);

// POST /api/assignments - Assign playlist to screen
router.post('/', AssignmentsController.assignPlaylistToScreen);

// GET /api/assignments/screen/:screenId - Get screen assignment
router.get('/screen/:screenId', AssignmentsController.getScreenAssignment);

// DELETE /api/assignments/screen/:screenId - Remove screen assignment
router.delete('/screen/:screenId', AssignmentsController.removeScreenAssignment);

module.exports = router;
