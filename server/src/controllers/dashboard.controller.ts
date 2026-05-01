import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { ok } from '../types/api';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const stats = await dashboardService.getDashboardStats(req.user!.userId, projectId);
    res.json(ok(stats));
  } catch (err) {
    next(err);
  }
};
