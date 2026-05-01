import { z } from 'zod';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    projectId: z.ZodString;
    dueDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    assigneeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    title: string;
    description?: string | undefined;
    dueDate?: string | undefined;
    assigneeId?: string | undefined;
}, {
    projectId: string;
    title: string;
    description?: string | undefined;
    dueDate?: string | undefined;
    assigneeId?: string | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"]>>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assigneeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    dueDate?: string | null | undefined;
    assigneeId?: string | null | undefined;
}, {
    status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    dueDate?: string | null | undefined;
    assigneeId?: string | null | undefined;
}>;
//# sourceMappingURL=task.schema.d.ts.map