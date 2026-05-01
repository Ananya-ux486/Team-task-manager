"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const errorHandler_1 = require("../middleware/errorHandler");
const taskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    dueDate: true,
    projectId: true,
    assigneeId: true,
    createdAt: true,
    updatedAt: true,
    assignee: {
        select: { id: true, name: true, email: true },
    },
};
const getTasks = async (projectId, filters = {}) => {
    const where = { projectId };
    if (filters.status)
        where.status = filters.status;
    if (filters.assigneeId)
        where.assigneeId = filters.assigneeId;
    if (filters.overdue) {
        where.dueDate = { lt: new Date() };
        where.status = { not: 'COMPLETED' };
    }
    return client_1.default.task.findMany({
        where,
        select: taskSelect,
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
};
exports.getTasks = getTasks;
const getTaskById = async (taskId) => {
    const task = await client_1.default.task.findUnique({
        where: { id: taskId },
        select: taskSelect,
    });
    if (!task)
        throw new errorHandler_1.AppError(404, 'Task not found');
    return task;
};
exports.getTaskById = getTaskById;
const createTask = async (data) => {
    // Verify project exists
    const project = await client_1.default.project.findUnique({ where: { id: data.projectId } });
    if (!project)
        throw new errorHandler_1.AppError(404, 'Project not found');
    // Verify assignee is a project member
    if (data.assigneeId) {
        const membership = await client_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId: data.projectId, userId: data.assigneeId } },
        });
        if (!membership)
            throw new errorHandler_1.AppError(400, 'User is not a member of this project');
    }
    return client_1.default.task.create({
        data: {
            title: data.title,
            description: data.description,
            projectId: data.projectId,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            assigneeId: data.assigneeId,
        },
        select: taskSelect,
    });
};
exports.createTask = createTask;
const updateTask = async (taskId, userId, userRole, projectMemberRole, data) => {
    const task = await client_1.default.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw new errorHandler_1.AppError(404, 'Task not found');
    // Members can only update status of their own tasks
    if (projectMemberRole === 'MEMBER') {
        if (task.assigneeId !== userId) {
            throw new errorHandler_1.AppError(403, 'You can only update your own tasks');
        }
        // Members can only change status
        const allowedKeys = ['status'];
        const attemptedKeys = Object.keys(data).filter((k) => data[k] !== undefined);
        const forbidden = attemptedKeys.filter((k) => !allowedKeys.includes(k));
        if (forbidden.length > 0) {
            throw new errorHandler_1.AppError(403, 'Insufficient permissions');
        }
    }
    // Verify new assignee is a project member
    if (data.assigneeId) {
        const membership = await client_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId: task.projectId, userId: data.assigneeId } },
        });
        if (!membership)
            throw new errorHandler_1.AppError(400, 'User is not a member of this project');
    }
    return client_1.default.task.update({
        where: { id: taskId },
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
            assigneeId: data.assigneeId === null ? null : data.assigneeId,
        },
        select: taskSelect,
    });
};
exports.updateTask = updateTask;
const deleteTask = async (taskId) => {
    const task = await client_1.default.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw new errorHandler_1.AppError(404, 'Task not found');
    await client_1.default.task.delete({ where: { id: taskId } });
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.service.js.map