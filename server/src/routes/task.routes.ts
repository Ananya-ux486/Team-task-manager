import { Router, Request, Response, NextFunction } from 'express';
import taskController from '../controllers/task.controller';
import { authenticateToken } from '../middleware/auth';
import { requireProjectMember } from '../middleware/requireProjectMember';
import { requireProjectAdmin } from '../middleware/requireProjectAdmin';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import prisma from '../prisma/client';

const router = Router();

router.use(authenticateToken);

// Middleware to load task and inject projectId into params
const loadTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    // Store original task id and set project id for membership check
    (req as any).taskId = req.params.id;
    req.params.id = task.projectId;
    next();
  } catch (err) {
    next(err);
  }
};

// Restore task id after membership check
const restoreTaskId = (req: Request, _res: Response, next: NextFunction) => {
  if ((req as any).taskId) req.params.id = (req as any).taskId;
  next();
};

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/:id', taskController.getTask);
router.put(
  '/:id',
  loadTask,
  requireProjectMember,
  restoreTaskId,
  validate(updateTaskSchema),
  taskController.updateTask
);
router.delete(
  '/:id',
  loadTask,
  requireProjectMember,
  requireProjectAdmin,
  restoreTaskId,
  taskController.deleteTask
);

export default router;
