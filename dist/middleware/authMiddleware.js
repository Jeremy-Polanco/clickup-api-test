"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (req, res, next) => {
    const accessToken = req.headers?.authorization;
    res.header('Authorization', `Bearer ${accessToken}`);
    next();
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map