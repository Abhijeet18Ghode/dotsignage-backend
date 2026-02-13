const crypto = require('crypto');

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

/**
 * Generate a unique filename for uploaded media
 */
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString('hex');
  const extension = originalName.split('.').pop();
  
  return `${timestamp}-${random}.${extension}`;
};

/**
 * Get file type from mimetype
 */
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  throw new Error('Unsupported file type');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  generateDeviceCode,
  generateUniqueFilename,
  getFileType,
  isValidEmail
};
