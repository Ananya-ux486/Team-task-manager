import prisma from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { TaskStatus, UserRole } from '@prisma/client';

interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: string;
  overdue?: boolean;
}

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  dueDate: true,
  projectId: true,
  assigneeId: true,
  createdAt: true,
  updatedAt: true,
  assignee: {
    select: { id: true, name: true, email: true },
  },
};

export const getTasks = async (projectId: string, filters: TaskFilters = {}) => {
  const where: Record<string, unknown> = { projectId };

  if (filters.status) where.status = filters.status;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters.overdue) {
    where.dueDate = { lt: new Date() };
    where.status = { not: 'COMPLETED' };
  }

  return prisma.task.findMany({
    where,
    select: taskSelect,
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });
};

export const getTaskById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  });
  if (!task) throw new AppError(404, 'Task not found');
  return task;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  projectId: string;
  dueDate?: string;
  assigneeId?: string;
  creatorId: string;
}) => {
  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) throw new AppError(404, 'Project not found');

  // Verify assignee is a project member
  if (data.assigneeId) {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: data.projectId, userId: data.assigneeId } },
    });
    if (!membership) throw new AppError(400, 'User is not a member of this project');
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      assigneeId: data.assigneeId,
    },
    select: taskSelect,
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  userRole: UserRole,
  projectMemberRole: UserRole,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string | null;
    assigneeId?: string | null;
  }
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(404, 'Task not found');

  // Members can only update status of their own tasks
  if (projectMemberRole === 'MEMBER') {
    if (task.assigneeId !== userId) {
      throw new AppError(403, 'You can only update your own tasks');
    }
    // Members can only change status
    const allowedKeys = ['status'];
    const attemptedKeys = Object.keys(data).filter((k) => data[k as keyof typeof data] !== undefined);
    const forbidden = attemptedKeys.filter((k) => !allowedKeys.includes(k));
    if (forbidden.length > 0) {
      throw new AppError(403, 'Insufficient permissions');
    }
  }

  // Verify new assignee is a project member
  if (data.assigneeId) {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: data.assigneeId } },
    });
    if (!membership) throw new AppError(400, 'User is not a member of this project');
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
      assigneeId: data.assigneeId === null ? null : data.assigneeId,
    },
    select: taskSelect,
  });
};

export const deleteTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(404, 'Task not found');

  await prisma.task.delete({ where: { id: taskId } });
};
