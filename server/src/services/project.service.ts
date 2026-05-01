import prisma from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { UserRole } from '@prisma/client';

export const getProjects = async (userId: string) => {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          _count: { select: { members: true, tasks: true } },
          tasks: { select: { status: true } },
        },
      },
    },
  });

  return memberships.map((m) => {
    const taskStats = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0, BLOCKED: 0 };
    m.project.tasks.forEach((t) => {
      taskStats[t.status]++;
    });
    return {
      id: m.project.id,
      name: m.project.name,
      description: m.project.description,
      createdBy: m.project.createdBy,
      createdAt: m.project.createdAt,
      updatedAt: m.project.updatedAt,
      userRole: m.role,
      memberCount: m.project._count.members,
      taskStats,
    };
  });
};

export const createProject = async (
  name: string,
  description: string | undefined,
  creatorId: string
) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdBy: creatorId,
      members: {
        create: { userId: creatorId, role: 'ADMIN' },
      },
    },
  });
  return project;
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      tasks: { select: { status: true } },
    },
  });

  if (!project) throw new AppError(404, 'Project not found');

  const membership = project.members.find((m) => m.userId === userId);
  if (!membership) throw new AppError(403, 'Access denied');

  const taskStats = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0, BLOCKED: 0 };
  project.tasks.forEach((t) => { taskStats[t.status]++; });

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    createdBy: project.createdBy,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    userRole: membership.role,
    members: project.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      name: m.user.name,
      email: m.user.email,
    })),
    taskStats,
  };
};

export const updateProject = async (
  projectId: string,
  data: { name?: string; description?: string }
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, 'Project not found');

  return prisma.project.update({ where: { id: projectId }, data });
};

export const deleteProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError(404, 'Project not found');

  await prisma.project.delete({ where: { id: projectId } });
};

export const addMember = async (
  projectId: string,
  userId: string,
  role: UserRole
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) throw new AppError(404, 'User not found');

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (existing) throw new AppError(400, 'User is already a team member');

  const member = await prisma.projectMember.create({
    data: { projectId, userId, role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return {
    id: member.id,
    projectId: member.projectId,
    userId: member.userId,
    role: member.role,
    user: member.user,
  };
};

export const removeMember = async (projectId: string, userId: string) => {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership) throw new AppError(404, 'Member not found');

  // Unassign all tasks assigned to this user in the project
  await prisma.task.updateMany({
    where: { projectId, assigneeId: userId },
    data: { assigneeId: null },
  });

  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
};

export const getMembers = async (projectId: string) => {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const getAllUsers = async (search?: string) => {
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    select: { id: true, name: true, email: true, role: true },
    take: 20,
  });
};
