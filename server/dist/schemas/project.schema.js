"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberSchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Project name is required')
        .max(100, 'Project name must not exceed 100 characters'),
    description: zod_1.z.string().max(500).optional(),
});
exports.updateProjectSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Project name is required')
        .max(100, 'Project name must not exceed 100 characters')
        .optional(),
    description: zod_1.z.string().max(500).optional(),
});
exports.addMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    role: zod_1.z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});
//# sourceMappingURL=project.schema.js.map