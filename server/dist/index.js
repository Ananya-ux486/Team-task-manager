"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: true, // Allow all origins — frontend is served from same domain
    credentials: true,
}));
// Rate limiting
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', globalLimiter);
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Health check — responds immediately
app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});
// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    const clientDist = path_1.default.resolve(__dirname, '..', '..', 'client', 'dist');
    app.use(express_1.default.static(clientDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api'))
            return next();
        res.sendFile(path_1.default.join(clientDist, 'index.html'));
    });
}
// Global error handler
app.use(errorHandler_1.errorHandler);
// Start server immediately — don't block on migrations
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    // Run migrations AFTER server is listening (non-blocking)
    if (process.env.NODE_ENV === 'production') {
        const { execSync } = require('child_process');
        try {
            console.log('🔄 Running database migrations...');
            execSync('npx prisma migrate deploy', {
                cwd: path_1.default.join(__dirname, '..'),
                stdio: 'inherit',
            });
            console.log('✅ Migrations complete');
        }
        catch (err) {
            console.error('⚠️ Migration warning:', err);
        }
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map