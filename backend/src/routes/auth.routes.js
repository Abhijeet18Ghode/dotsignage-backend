const { Router } = require('express');
const { AuthController } = require('../controllers/auth.controller');

const router = Router();

// POST /api/auth/login - Admin login
router.post('/login', AuthController.login);

module.exports = router;
