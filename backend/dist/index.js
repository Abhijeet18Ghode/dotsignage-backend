"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import middleware
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const screens_routes_1 = __importDefault(require("./routes/screens.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const playlists_routes_1 = __importDefault(require("./routes/playlists.routes"));
const assignments_routes_1 = __importDefault(require("./routes/assignments.routes"));
const player_routes_1 = __importDefault(require("./routes/player.routes"));
// Import config
const env_1 = require("./config/env");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(logger_1.logger);
// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        message: "Digital Signage API Server running",
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/screens", screens_routes_1.default);
app.use("/api/media", media_routes_1.default);
app.use("/api/playlists", playlists_routes_1.default);
app.use("/api/assignments", assignments_routes_1.default);
app.use("/api/player", player_routes_1.default);
// 404 handler
app.use("*", (_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
const PORT = env_1.config.port;
app.listen(PORT, () => {
    console.log(`🚀 Digital Signage API Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});
