const { AuthService } = require('../services/auth.service');
const { isValidEmail } = require('../utils/helpers');

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

      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      // Authenticate user
      const result = await AuthService.login({ email, password });

      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = { AuthController };
