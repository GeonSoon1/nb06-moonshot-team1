"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.sha256 = sha256;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = require("../middlewares/errors/customError");
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("./constants");
function generateAccessToken(userId) {
    if (!constants_1.ACCESS_TOKEN_SECRET)
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    try {
        return jsonwebtoken_1.default.sign({ userId }, constants_1.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }); //30m
    }
    catch (error) {
        throw new Error('Access 토큰 생성 실패');
    }
}
function generateRefreshToken(userId) {
    if (!constants_1.REFRESH_TOKEN_SECRET)
        throw new Error('Missing REFRESH_TOKEN_SECRET');
    try {
        return jsonwebtoken_1.default.sign({ userId }, constants_1.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
    catch (error) {
        throw new Error('Refresh 토큰 생성 실패');
    }
}
function verifyAccessToken(token) {
    if (!constants_1.ACCESS_TOKEN_SECRET)
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.ACCESS_TOKEN_SECRET);
        // decoded: string | JwtPayload 이라서 직접 가드
        if (typeof decoded !== 'object' ||
            decoded === null ||
            typeof decoded.userId !== 'number') {
            throw new customError_1.UnauthorizedError('Access 토큰 검증 실패');
        }
        return decoded;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new customError_1.UnauthorizedError('Access 토큰이 만료되었습니다');
        }
        throw new customError_1.UnauthorizedError('Access 토큰 검증 실패');
    }
}
function verifyRefreshToken(token) {
    if (!constants_1.REFRESH_TOKEN_SECRET)
        throw new Error('Missing REFRESH_TOKEN_SECRET');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.REFRESH_TOKEN_SECRET);
        if (typeof decoded !== 'object' ||
            decoded === null ||
            typeof decoded.userId !== 'number') {
            throw new customError_1.UnauthorizedError('Refresh 토큰 검증 실패');
        }
        return decoded;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new customError_1.UnauthorizedError('Refresh 토큰이 만료되었습니다');
        }
        throw new customError_1.UnauthorizedError('Refresh 토큰 검증 실패');
    }
}
function sha256(input) {
    return crypto_1.default.createHash('sha256').update(input).digest('hex');
}
