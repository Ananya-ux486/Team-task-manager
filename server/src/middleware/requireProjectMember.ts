import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const requireProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const projectId = req.params.id || req.params.projectId;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!membership) {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }

    req.projectMember = { role: membership.role };
    next();
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
