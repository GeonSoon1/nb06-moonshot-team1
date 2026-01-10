"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const prismaClient_1 = require("../lib/prismaClient");
const token_1 = require("../lib/token");
const customError_1 = require("./errors/customError");
// 브라우저로부터 넘어온 토큰을 검사하고 유저 db에 있는지 확인 후 req.user = user로 다음 미들웨어에 넘겨줌.
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const header = req.headers.authorization;
        const token = (header === null || header === void 0 ? void 0 : header.startsWith('Bearer ')) ? header.split(' ')[1] : null;
        if (!token) {
            throw new customError_1.UnauthorizedError('로그인이 필요합니다');
        }
        const payload = (0, token_1.verifyAccessToken)(token);
        const userId = (_a = payload.userId) !== null && _a !== void 0 ? _a : payload.id;
        const user = yield prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new customError_1.UnauthorizedError('존재하지 않는 사용자입니다');
        }
        req.user = user;
        next();
    });
}
