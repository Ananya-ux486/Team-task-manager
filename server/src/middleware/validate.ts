import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message =
        result.error.errors[0]?.message ?? 'Validation error';
      res.status(400).json({ success: false, error: message });
      return;
    }
    req.body = result.data;
    next();
  };
