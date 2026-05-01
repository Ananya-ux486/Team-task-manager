import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if ((err as any).code === 'P2002') {
      res.status(409).json({ success: false, error: 'Resource already exists' });
      return;
    }
    if ((err as any).code === 'P2025') {
      res.status(404).json({ success: false, error: 'Resource not found' });
      return;
    }
  }

  res
    .status(500)
    .json({ success: false, error: 'Server error. Please try again later.' });
};
