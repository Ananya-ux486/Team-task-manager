import { TaskStatus } from '@prisma/client';
type TaskStats = Record<TaskStatus, number>;
export declare const getDashboardStats: (userId: string, projectId?: string) => Promise<{
    tasksByStatus: TaskStats;
    overdueCount: number;
    assignedToMe: number;
    totalTasks: number;
    projects: {
        id: string;
        name: string;
        taskCount: number;
    }[];
}>;
export {};
//# sourceMappingURL=dashboard.service.d.ts.map