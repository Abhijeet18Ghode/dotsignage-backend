require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { config } = require('./config/env');
const { logger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const screensRoutes = require('./routes/screens.routes');
const mediaRoutes = require('./routes/media.routes');
const playlistsRoutes = require('./routes/playlists.routes');
const assignmentsRoutes = require('./routes/assignments.routes');
const playerRoutes = require('./routes/player.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/screens', screensRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/player', playerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
