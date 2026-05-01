import { TaskStatus, UserRole } from '@prisma/client';
interface TaskFilters {
    status?: TaskStatus;
    assigneeId?: string;
    overdue?: boolean;
}
export declare const getTasks: (projectId: string, filters?: TaskFilters) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.TaskStatus;
    projectId: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
}[]>;
export declare const getTaskById: (taskId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.TaskStatus;
    projectId: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
}>;
export declare const createTask: (data: {
    title: string;
    description?: string;
    projectId: string;
    dueDate?: string;
    assigneeId?: string;
    creatorId: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.TaskStatus;
    projectId: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
}>;
export declare const updateTask: (taskId: string, userId: string, userRole: UserRole, projectMemberRole: UserRole, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string | null;
    assigneeId?: string | null;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.TaskStatus;
    projectId: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    assigneeId: string | null;
    assignee: {
        id: string;
        email: string;
        name: string;
    } | null;
}>;
export declare const deleteTask: (taskId: string) => Promise<void>;
export {};
//# sourceMappingURL=task.service.d.ts.map