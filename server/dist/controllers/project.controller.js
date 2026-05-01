"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getMembers = exports.removeMember = exports.addMember = exports.deleteProject = exports.updateProject = exports.getProject = exports.createProject = exports.getProjects = void 0;
const projectService = __importStar(require("../services/project.service"));
const api_1 = require("../types/api");
const getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getProjects(req.user.userId);
        res.json((0, api_1.ok)(projects));
    }
    catch (err) {
        next(err);
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res, next) => {
    try {
        // Any authenticated user can create a project.
        // They automatically become the ADMIN of that project.
        const { name, description } = req.body;
        const project = await projectService.createProject(name, description, req.user.userId);
        res.status(201).json((0, api_1.ok)(project));
    }
    catch (err) {
        next(err);
    }
};
exports.createProject = createProject;
const getProject = async (req, res, next) => {
    try {
        const project = await projectService.getProjectById(req.params.id, req.user.userId);
        res.json((0, api_1.ok)(project));
    }
    catch (err) {
        next(err);
    }
};
exports.getProject = getProject;
const updateProject = async (req, res, next) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json((0, api_1.ok)(project));
    }
    catch (err) {
        next(err);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        await projectService.deleteProject(req.params.id);
        res.json((0, api_1.ok)({ message: 'Project deleted successfully' }));
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProject = deleteProject;
const addMember = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const member = await projectService.addMember(req.params.id, userId, role);
        res.status(201).json((0, api_1.ok)(member));
    }
    catch (err) {
        next(err);
    }
};
exports.addMember = addMember;
const removeMember = async (req, res, next) => {
    try {
        await projectService.removeMember(req.params.id, req.params.userId);
        res.json((0, api_1.ok)({ message: 'Member removed successfully' }));
    }
    catch (err) {
        next(err);
    }
};
exports.removeMember = removeMember;
const getMembers = async (req, res, next) => {
    try {
        const members = await projectService.getMembers(req.params.id);
        res.json((0, api_1.ok)(members));
    }
    catch (err) {
        next(err);
    }
};
exports.getMembers = getMembers;
const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search;
        const users = await projectService.getAllUsers(search);
        res.json((0, api_1.ok)(users));
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=project.controller.js.map