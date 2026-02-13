"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignments_controller_1 = require("../controllers/assignments.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All assignment routes require authentication
router.use(auth_1.authenticateToken);
// POST /api/assignments - Assign playlist to screen
router.post('/', assignments_controller_1.AssignmentsController.assignPlaylistToScreen);
// GET /api/assignments/screen/:screenId - Get screen assignment
router.get('/screen/:screenId', assignments_controller_1.AssignmentsController.getScreenAssignment);
// DELETE /api/assignments/screen/:screenId - Remove screen assignment
router.delete('/screen/:screenId', assignments_controller_1.AssignmentsController.removeScreenAssignment);
exports.default = router;
