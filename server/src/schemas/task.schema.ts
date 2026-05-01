import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must not exceed 200 characters'),
  description: z.string().max(2000).optional(),
  projectId: z.string().uuid('Invalid project ID'),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .refine((d) => new Date(d) > new Date(), 'Due date must be in the future')
    .optional(),
  assigneeId: z.string().uuid('Invalid assignee ID').optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must not exceed 200 characters')
    .optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'], {
    errorMap: () => ({ message: 'Invalid status value' }),
  }).optional(),
  dueDate: z.string().datetime({ message: 'Invalid date format' }).nullable().optional(),
  assigneeId: z.string().uuid('Invalid assignee ID').nullable().optional(),
});
