import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters'),
  description: z.string().max(500).optional(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .optional(),
  description: z.string().max(500).optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});
