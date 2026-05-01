"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProjectAdmin = void 0;
const requireProjectAdmin = (req, res, next) => {
    if (req.projectMember?.role !== 'ADMIN') {
        res.status(403).json({ success: false, error: 'Insufficient permissions' });
        return;
    }
    next();
};
exports.requireProjectAdmin = requireProjectAdmin;
//# sourceMappingURL=requireProjectAdmin.js.map