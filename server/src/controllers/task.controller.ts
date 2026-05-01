import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { ok } from '../types/api';
import { TaskStatus } from '@prisma/client';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, assigneeId, overdue } = req.query;
    const tasks = await taskService.getTasks(req.params.id, {
      status: status as TaskStatus | undefined,
      assigneeId: assigneeId as string | undefined,
      overdue: overdue === 'true',
    });
    res.json(ok(tasks));
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(ok(task));
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      creatorId: req.user!.userId,
    });
    res.status(201).json(ok(task));
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user!.userId,
      req.user!.role,
      req.projectMember!.role,
      req.body
    );
    res.json(ok(task));
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json(ok({ message: 'Task deleted successfully' }));
  } catch (err) {
    next(err);
  }
};

export default { getTasks, getTask, createTask, updateTask, deleteTask };
