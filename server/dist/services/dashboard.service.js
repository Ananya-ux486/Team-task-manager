"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getDashboardStats = async (userId, projectId) => {
    const memberships = await client_1.default.projectMember.findMany({
        where: { userId },
        select: { projectId: true },
    });
    const projectIds = projectId
        ? [projectId]
        : memberships.map((m) => m.projectId);
    const now = new Date();
    const [tasks, overdueCount, assignedToMe] = await Promise.all([
        client_1.default.task.groupBy({
            by: ['status'],
            where: { projectId: { in: projectIds } },
            _count: { status: true },
        }),
        client_1.default.task.count({
            where: {
                projectId: { in: projectIds },
                dueDate: { lt: now },
                status: { not: 'COMPLETED' },
            },
        }),
        client_1.default.task.count({
            where: {
                projectId: { in: projectIds },
                assigneeId: userId,
            },
        }),
    ]);
    const tasksByStatus = {
        TODO: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        BLOCKED: 0,
    };
    tasks.forEach((t) => {
        tasksByStatus[t.status] += t._count.status;
    });
    const totalTasks = Object.values(tasksByStatus).reduce((a, b) => a + b, 0);
    const projects = await client_1.default.project.findMany({
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
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.service.js.map