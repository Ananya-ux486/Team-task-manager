import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export const signup = async (email: string, password: string, name: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, 'Email already registered');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: 'ADMIN' }, // New users are ADMIN by default so they can create projects
    select: { id: true, email: true, name: true, role: true },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, 'Invalid email or password');

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid email or password');

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const refresh = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored) throw new AppError(401, 'Invalid refresh token');
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new AppError(401, 'Refresh token expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
    select: { id: true, role: true },
  });
  if (!user) throw new AppError(401, 'User not found');

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  return { accessToken };
};

export const logout = async (token: string) => {
  await prisma.refreshToken.deleteMany({ where: { token } });
};

// ─── Forgot / Reset Password ────────────────────────────────────────────────

const RESET_TOKEN_EXPIRES_MINUTES = 30;

export const forgotPassword = async (email: string) => {
  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If that email exists, a reset link has been generated.' };

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // Create new reset token
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_EXPIRES_MINUTES);

  await prisma.passwordResetToken.create({
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

export const resetPassword = async (token: string, newPassword: string) => {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record) throw new AppError(400, 'Invalid or expired reset token');
  if (record.used) throw new AppError(400, 'This reset link has already been used');
  if (record.expiresAt < new Date()) throw new AppError(400, 'Reset link has expired. Please request a new one.');

  const passwordHash = await hashPassword(newPassword);

  // Update password and mark token as used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    // Invalidate all refresh tokens so existing sessions are logged out
    prisma.refreshToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { message: 'Password reset successfully. You can now sign in with your new password.' };
};

const createRefreshToken = async (userId: string): Promise<string> => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
};
