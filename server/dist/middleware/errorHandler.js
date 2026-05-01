"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const library_1 = require("@prisma/client/runtime/library");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ success: false, error: err.message });
        return;
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({ success: false, error: 'Resource already exists' });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({ success: false, error: 'Resource not found' });
            return;
        }
    }
    res
        .status(500)
        .json({ success: false, error: 'Server error. Please try again later.' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map