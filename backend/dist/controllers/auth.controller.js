"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const helpers_1 = require("../utils/helpers");
class AuthController {
    /**
     * POST /api/auth/login
     * Admin login with email and password
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            if (!(0, helpers_1.isValidEmail)(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }
            // Authenticate user
            const result = await auth_service_1.AuthService.login({ email, password });
            res.json({
                message: 'Login successful',
                ...result
            });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
