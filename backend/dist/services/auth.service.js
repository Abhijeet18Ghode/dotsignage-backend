"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
class AuthService {
    /**
     * Authenticate user with email and password
     */
    static async login(credentials) {
        const { email, password } = credentials;
        // Find user by email
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, env_1.config.jwt.secret, { expiresIn: '24h' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
    /**
     * Create a new admin user (for setup purposes)
     */
    static async createUser(email, password) {
        // Hash password
        const saltRounds = 10;
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        // Insert user
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .insert([{ email, password_hash }])
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
        return user;
    }
    /**
     * Verify JWT token
     */
    static verifyToken(token) {
        try {
            return jwt.verify(token, env_1.config.jwt.secret);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
