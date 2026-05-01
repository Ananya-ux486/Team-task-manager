"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Task title is required')
        .max(200, 'Task title must not exceed 200 characters'),
    description: zod_1.z.string().max(2000).optional(),
    projectId: zod_1.z.string().uuid('Invalid project ID'),
    dueDate: zod_1.z
        .string()
        .datetime({ message: 'Invalid date format' })
        .refine((d) => new Date(d) > new Date(), 'Due date must be in the future')
        .optional(),
    assigneeId: zod_1.z.string().uuid('Invalid assignee ID').optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Task title is required')
        .max(200, 'Task title must not exceed 200 characters')
        .optional(),
    description: zod_1.z.string().max(2000).optional(),
    status: zod_1.z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'], {
        errorMap: () => ({ message: 'Invalid status value' }),
    }).optional(),
    dueDate: zod_1.z.string().datetime({ message: 'Invalid date format' }).nullable().optional(),
    assigneeId: zod_1.z.string().uuid('Invalid assignee ID').nullable().optional(),
});
//# sourceMappingURL=task.schema.js.map