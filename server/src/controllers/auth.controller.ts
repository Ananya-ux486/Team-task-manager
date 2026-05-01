import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ok } from '../types/api';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.signup(email, password, name);
    res.status(201).json(ok(result));
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(ok(result));
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.json(ok(result));
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    res.json(ok({ message: 'Logged out successfully' }));
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(ok(result));
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.json(ok(result));
  } catch (err) {
    next(err);
  }
};
