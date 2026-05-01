"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const message = result.error.errors[0]?.message ?? 'Validation error';
        res.status(400).json({ success: false, error: message });
        return;
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map