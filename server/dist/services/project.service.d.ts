import { TaskStatus, UserRole } from '@prisma/client';
type TaskStats = Record<TaskStatus, number>;
export declare const getProjects: (userId: string) => Promise<{
    id: string;
    name: string;
    description: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    userRole: import(".prisma/client").$Enums.UserRole;
    memberCount: number;
    taskStats: TaskStats;
}[]>;
export declare const createProject: (name: string, description: string | undefined, creatorId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    createdBy: string;
}>;
export declare const getProjectById: (projectId: string, userId: string) => Promise<{
    id: string;
    name: string;
    description: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    userRole: import(".prisma/client").$Enums.UserRole;
    members: {
        id: string;
        userId: string;
        role: import(".prisma/client").$Enums.UserRole;
        name: string;
        email: string;
    }[];
    taskStats: TaskStats;
}>;
export declare const updateProject: (projectId: string, data: {
    name?: string;
    description?: string;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    createdBy: string;
}>;
export declare const deleteProject: (projectId: string) => Promise<void>;
export declare const addMember: (projectId: string, userId: string, role: UserRole) => Promise<{
    id: string;
    projectId: string;
    userId: string;
    role: import(".prisma/client").$Enums.UserRole;
    user: {
        id: string;
        email: string;
        name: string;
    };
}>;
export declare const removeMember: (projectId: string, userId: string) => Promise<void>;
export declare const getMembers: (projectId: string) => Promise<({
    user: {
        id: string;
        email: string;
        name: string;
    };
} & {
    id: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    userId: string;
    projectId: string;
})[]>;
export declare const getAllUsers: (search?: string) => Promise<{
    id: string;
    email: string;
    name: string;
    role: import(".prisma/client").$Enums.UserRole;
}[]>;
export {};
//# sourceMappingURL=project.service.d.ts.map