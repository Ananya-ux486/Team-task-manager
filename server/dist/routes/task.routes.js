"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const auth_1 = require("../middleware/auth");
const requireProjectMember_1 = require("../middleware/requireProjectMember");
const requireProjectAdmin_1 = require("../middleware/requireProjectAdmin");
const validate_1 = require("../middleware/validate");
const task_schema_1 = require("../schemas/task.schema");
const client_1 = __importDefault(require("../prisma/client"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
// Middleware to load task and inject projectId into params
const loadTask = async (req, res, next) => {
    try {
        const task = await client_1.default.task.findUnique({ where: { id: req.params.id } });
        if (!task) {
            res.status(404).json({ success: false, error: 'Task not found' });
            return;
        }
        // Store original task id and set project id for membership check
        req.taskId = req.params.id;
        req.params.id = task.projectId;
        next();
    }
    catch (err) {
        next(err);
    }
};
// Restore task id after membership check
const restoreTaskId = (req, _res, next) => {
    if (req.taskId)
        req.params.id = req.taskId;
    next();
};
router.post('/', (0, validate_1.validate)(task_schema_1.createTaskSchema), task_controller_1.default.createTask);
router.get('/:id', task_controller_1.default.getTask);
router.put('/:id', loadTask, requireProjectMember_1.requireProjectMember, restoreTaskId, (0, validate_1.validate)(task_schema_1.updateTaskSchema), task_controller_1.default.updateTask);
router.delete('/:id', loadTask, requireProjectMember_1.requireProjectMember, requireProjectAdmin_1.requireProjectAdmin, restoreTaskId, task_controller_1.default.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map