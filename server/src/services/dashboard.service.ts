import prisma from '../prisma/client';

export const getDashboardStats = async (userId: string, projectId?: string) => {
  // Get all projects the user is a member of
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  });

  const projectIds = projectId
    ? [projectId]
    : memberships.map((m) => m.projectId);

  const now = new Date();

  const [tasks, overdueCount, assignedToMe] = await Promise.all([
    prisma.task.groupBy({
      by: ['status'],
      where: { projectId: { in: projectIds } },
      _count: { status: true },
    }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: now },
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        assigneeId: userId,
      },
    }),
  ]);

  const tasksByStatus = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0, BLOCKED: 0 };
  tasks.forEach((t) => {
    tasksByStatus[t.status] += t._count.status;
  });

  const totalTasks = Object.values(tasksByStatus).reduce((a, b) => a + b, 0);

  // Get project summaries
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: {
      id: true,
      name: true,
      _count: { select: { tasks: true } },
    },
  });

  return {
    tasksByStatus,
    overdueCount,
    assignedToMe,
    totalTasks,
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      taskCount: p._count.tasks,
    })),
  };
};
