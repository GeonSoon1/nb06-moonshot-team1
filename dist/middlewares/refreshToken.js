"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRefresh = requireRefresh;
const customError_1 = require("./errors/customError");
function requireRefresh(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw new customError_1.BadRequestError();
    }
    const token = header.split(' ')[1];
    if (!token) {
        throw new customError_1.BadRequestError();
    }
    req.refreshToken = token;
    next();
}
