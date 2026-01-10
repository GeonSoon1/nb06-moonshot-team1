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
const superstruct_1 = require("superstruct");
const comment_structs_1 = require("../structs/comment.structs");
const comment_service_1 = __importDefault(require("../services/comment.service"));
// 1. 댓글 조회 (GET)
function getCommentById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        const comment = yield comment_service_1.default.getComment(Number(commentId));
        return res.status(200).json(comment);
    });
}
// 4. 댓글 수정 (PATCH)
function updateComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        const commentData = (0, superstruct_1.create)(req.body, comment_structs_1.UpdateComment);
        const updatedComment = yield comment_service_1.default.updateComment(Number(commentId), commentData);
        return res.status(200).json(updatedComment);
    });
}
// 5. 댓글 삭제 (DELETE)
function deleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        const userId = req.user.id;
        yield comment_service_1.default.deleteComment(Number(commentId));
        // 명세서에 따라 성공 시 204 No Content 반환
        return res.status(204).end();
    });
}
exports.default = {
    getCommentById,
    updateComment,
    deleteComment
};
