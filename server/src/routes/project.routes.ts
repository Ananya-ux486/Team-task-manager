import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticateToken } from '../middleware/auth';
import { requireProjectMember } from '../middleware/requireProjectMember';
import { requireProjectAdmin } from '../middleware/requireProjectAdmin';
import { validate } from '../middleware/validate';
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from '../schemas/project.schema';

const router = Router();

router.use(authenticateToken);

// Project CRUD
router.get('/', projectController.getProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/:id', requireProjectMember, projectController.getProject);
router.put(
  '/:id',
  requireProjectMember,
  requireProjectAdmin,
  validate(updateProjectSchema),
  projectController.updateProject
);
router.delete(
  '/:id',
  requireProjectMember,
  requireProjectAdmin,
  projectController.deleteProject
);

// Team management
router.get('/:id/members', requireProjectMember, projectController.getMembers);
router.post(
  '/:id/members',
  requireProjectMember,
  requireProjectAdmin,
  validate(addMemberSchema),
  projectController.addMember
);
router.delete(
  '/:id/members/:userId',
  requireProjectMember,
  requireProjectAdmin,
  projectController.removeMember
);

// Tasks for a project
import taskController from '../controllers/task.controller';
router.get('/:id/tasks', requireProjectMember, taskController.getTasks);

export default router;
