"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMembers = exports.removeMember = exports.addMember = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getProjects = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const errorHandler_1 = require("../middleware/errorHandler");
const emptyTaskStats = () => ({
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    BLOCKED: 0,
});
const getProjects = async (userId) => {
    const memberships = await client_1.default.projectMember.findMany({
        where: { userId },
        include: {
            project: {
                include: {
                    _count: { select: { members: true, tasks: true } },
                    tasks: { select: { status: true } },
                },
            },
        },
    });
    return memberships.map((m) => {
        const taskStats = emptyTaskStats();
        m.project.tasks.forEach((t) => {
            taskStats[t.status]++;
        });
        return {
            id: m.project.id,
            name: m.project.name,
            description: m.project.description,
            createdBy: m.project.createdBy,
            createdAt: m.project.createdAt,
            updatedAt: m.project.updatedAt,
            userRole: m.role,
            memberCount: m.project._count.members,
            taskStats,
        };
    });
};
exports.getProjects = getProjects;
const createProject = async (name, description, creatorId) => {
    const project = await client_1.default.project.create({
        data: {
            name,
            description,
            createdBy: creatorId,
            members: {
                create: { userId: creatorId, role: 'ADMIN' },
            },
        },
    });
    return project;
};
exports.createProject = createProject;
const getProjectById = async (projectId, userId) => {
    const project = await client_1.default.project.findUnique({
        where: { id: projectId },
        include: {
            members: {
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            },
            tasks: { select: { status: true } },
        },
    });
    if (!project)
        throw new errorHandler_1.AppError(404, 'Project not found');
    const membership = project.members.find((m) => m.userId === userId);
    if (!membership)
        throw new errorHandler_1.AppError(403, 'Access denied');
    const taskStats = emptyTaskStats();
    project.tasks.forEach((t) => {
        taskStats[t.status]++;
    });
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdBy: project.createdBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        userRole: membership.role,
        members: project.members.map((m) => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            name: m.user.name,
            email: m.user.email,
        })),
        taskStats,
    };
};
exports.getProjectById = getProjectById;
const updateProject = async (projectId, data) => {
    const project = await client_1.default.project.findUnique({ where: { id: projectId } });
    if (!project)
        throw new errorHandler_1.AppError(404, 'Project not found');
    return client_1.default.project.update({ where: { id: projectId }, data });
};
exports.updateProject = updateProject;
const deleteProject = async (projectId) => {
    const project = await client_1.default.project.findUnique({ where: { id: projectId } });
    if (!project)
        throw new errorHandler_1.AppError(404, 'Project not found');
    await client_1.default.project.delete({ where: { id: projectId } });
};
exports.deleteProject = deleteProject;
const addMember = async (projectId, userId, role) => {
    const user = await client_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
    });
    if (!user)
        throw new errorHandler_1.AppError(404, 'User not found');
    const existing = await client_1.default.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
    });
    if (existing)
        throw new errorHandler_1.AppError(400, 'User is already a team member');
    const member = await client_1.default.projectMember.create({
        data: { projectId, userId, role },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    return {
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role,
        user: member.user,
    };
};
exports.addMember = addMember;
const removeMember = async (projectId, userId) => {
    const membership = await client_1.default.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
    });
    if (!membership)
        throw new errorHandler_1.AppError(404, 'Member not found');
    await client_1.default.task.updateMany({
        where: { projectId, assigneeId: userId },
        data: { assigneeId: null },
    });
    await client_1.default.projectMember.delete({
        where: { projectId_userId: { projectId, userId } },
    });
};
exports.removeMember = removeMember;
const getMembers = async (projectId) => {
    return client_1.default.projectMember.findMany({
        where: { projectId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
};
exports.getMembers = getMembers;
const getAllUsers = async (search) => {
    return client_1.default.user.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : undefined,
        select: { id: true, name: true, email: true, role: true },
        take: 20,
    });
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=project.service.js.map