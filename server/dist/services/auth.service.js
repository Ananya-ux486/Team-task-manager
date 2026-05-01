"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refresh = exports.login = exports.signup = void 0;
const uuid_1 = require("uuid");
const client_1 = __importDefault(require("../prisma/client"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const REFRESH_TOKEN_EXPIRES_DAYS = 7;
const signup = async (email, password, name) => {
    const existing = await client_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw new errorHandler_1.AppError(409, 'Email already registered');
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await client_1.default.user.create({
        data: { email, passwordHash, name, role: 'ADMIN' }, // New users are ADMIN by default so they can create projects
        select: { id: true, email: true, name: true, role: true },
    });
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id);
    return { user, accessToken, refreshToken };
};
exports.signup = signup;
const login = async (email, password) => {
    const user = await client_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new errorHandler_1.AppError(401, 'Invalid email or password');
    const valid = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!valid)
        throw new errorHandler_1.AppError(401, 'Invalid email or password');
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id);
    return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken,
        refreshToken,
    };
};
exports.login = login;
const refresh = async (token) => {
    const stored = await client_1.default.refreshToken.findUnique({ where: { token } });
    if (!stored)
        throw new errorHandler_1.AppError(401, 'Invalid refresh token');
    if (stored.expiresAt < new Date()) {
        await client_1.default.refreshToken.delete({ where: { id: stored.id } });
        throw new errorHandler_1.AppError(401, 'Refresh token expired');
    }
    const user = await client_1.default.user.findUnique({
        where: { id: stored.userId },
        select: { id: true, role: true },
    });
    if (!user)
        throw new errorHandler_1.AppError(401, 'User not found');
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
    return { accessToken };
};
exports.refresh = refresh;
const logout = async (token) => {
    await client_1.default.refreshToken.deleteMany({ where: { token } });
};
exports.logout = logout;
// ─── Forgot / Reset Password ────────────────────────────────────────────────
const RESET_TOKEN_EXPIRES_MINUTES = 30;
const forgotPassword = async (email) => {
    // Always return success to prevent email enumeration
    const user = await client_1.default.user.findUnique({ where: { email } });
    if (!user)
        return { message: 'If that email exists, a reset link has been generated.' };
    // Invalidate any existing unused tokens for this user
    await client_1.default.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
    });
    // Create new reset token
    const token = (0, uuid_1.v4)();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_EXPIRES_MINUTES);
    await client_1.default.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt },
    });
    // In a real app you'd send an email here.
    // For this demo we return the token directly so the frontend can show the reset link.
    return {
        message: 'Reset link generated successfully.',
        resetToken: token, // returned so the UI can display the link
        expiresInMinutes: RESET_TOKEN_EXPIRES_MINUTES,
    };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    const record = await client_1.default.passwordResetToken.findUnique({ where: { token } });
    if (!record)
        throw new errorHandler_1.AppError(400, 'Invalid or expired reset token');
    if (record.used)
        throw new errorHandler_1.AppError(400, 'This reset link has already been used');
    if (record.expiresAt < new Date())
        throw new errorHandler_1.AppError(400, 'Reset link has expired. Please request a new one.');
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    // Update password and mark token as used in a transaction
    await client_1.default.$transaction([
        client_1.default.user.update({
            where: { id: record.userId },
            data: { passwordHash },
        }),
        client_1.default.passwordResetToken.update({
            where: { id: record.id },
            data: { used: true },
        }),
        // Invalidate all refresh tokens so existing sessions are logged out
        client_1.default.refreshToken.deleteMany({ where: { userId: record.userId } }),
    ]);
    return { message: 'Password reset successfully. You can now sign in with your new password.' };
};
exports.resetPassword = resetPassword;
const createRefreshToken = async (userId) => {
    const token = (0, uuid_1.v4)();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
    await client_1.default.refreshToken.create({ data: { token, userId, expiresAt } });
    return token;
};
//# sourceMappingURL=auth.service.js.map