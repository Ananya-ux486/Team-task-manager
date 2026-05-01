import { Request, Response, NextFunction } from 'express';

export const requireProjectAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.projectMember?.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Insufficient permissions' });
    return;
  }
  next();
};
