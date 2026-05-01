"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProjectMember = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const requireProjectMember = async (req, res, next) => {
    const projectId = req.params.id || req.params.projectId;
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
    }
    try {
        const membership = await client_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
        if (!membership) {
            res.status(403).json({ success: false, error: 'Access denied' });
            return;
        }
        req.projectMember = { role: membership.role };
        next();
    }
    catch {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
exports.requireProjectMember = requireProjectMember;
//# sourceMappingURL=requireProjectMember.js.map