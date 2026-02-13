"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.getFileType = exports.generateUniqueFilename = exports.generateDeviceCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a unique device code for screens
 * Format: 3 letters + 3 numbers (e.g., ABC123)
 */
const generateDeviceCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    // Add 3 random letters
    for (let i = 0; i < 3; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Add 3 random numbers
    for (let i = 0; i < 3; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
};
exports.generateDeviceCode = generateDeviceCode;
/**
 * Generate a unique filename for uploaded media
 */
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const random = crypto_1.default.randomBytes(6).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
};
exports.generateUniqueFilename = generateUniqueFilename;
/**
 * Get file type from mimetype
 */
const getFileType = (mimetype) => {
    if (mimetype.startsWith('image/'))
        return 'image';
    if (mimetype.startsWith('video/'))
        return 'video';
    throw new Error('Unsupported file type');
};
exports.getFileType = getFileType;
/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
