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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const taskService = __importStar(require("../services/task.service"));
const api_1 = require("../types/api");
const getTasks = async (req, res, next) => {
    try {
        const { status, assigneeId, overdue } = req.query;
        const tasks = await taskService.getTasks(req.params.id, {
            status: status,
            assigneeId: assigneeId,
            overdue: overdue === 'true',
        });
        res.json((0, api_1.ok)(tasks));
    }
    catch (err) {
        next(err);
    }
};
exports.getTasks = getTasks;
const getTask = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.json((0, api_1.ok)(task));
    }
    catch (err) {
        next(err);
    }
};
exports.getTask = getTask;
const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask({
            ...req.body,
            creatorId: req.user.userId,
        });
        res.status(201).json((0, api_1.ok)(task));
    }
    catch (err) {
        next(err);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.user.userId, req.user.role, req.projectMember.role, req.body);
        res.json((0, api_1.ok)(task));
    }
    catch (err) {
        next(err);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json((0, api_1.ok)({ message: 'Task deleted successfully' }));
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTask = deleteTask;
exports.default = { getTasks: exports.getTasks, getTask: exports.getTask, createTask: exports.createTask, updateTask: exports.updateTask, deleteTask: exports.deleteTask };
//# sourceMappingURL=task.controller.js.map