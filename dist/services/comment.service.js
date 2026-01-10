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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../lib/utils/util");
const customError_1 = require("../middlewares/errors/customError");
const comment_repo_1 = __importDefault(require("../repositories/comment.repo"));
// 1. 조회
function getComment(commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield comment_repo_1.default.findCommentById(commentId);
    });
}
// 2. 수정
function updateComment(commentId, commentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield comment_repo_1.default.findCommentById(commentId);
        if (!comment)
            throw new customError_1.NotFoundError('존재하지 않는 댓글입니다.');
        return (0, util_1.formatComment)(yield comment_repo_1.default.updateComment(commentId, commentData));
    });
}
// 4. 삭제
function deleteComment(commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield comment_repo_1.default.findCommentById(commentId);
        if (!comment)
            throw new customError_1.NotFoundError('존재하지 않는 댓글입니다.');
        yield comment_repo_1.default.deleteComment(commentId);
    });
}
exports.default = {
    getComment,
    updateComment,
    deleteComment
};
