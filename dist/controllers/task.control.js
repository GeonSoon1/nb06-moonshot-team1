"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.remove = exports.update = exports.getDetail = exports.getList = exports.createtask = void 0;
exports.createSubTask = createSubTask;
exports.getSubTasks = getSubTasks;
exports.createComment = createComment;
exports.getComments = getComments;
const taskService = __importStar(require("../services/task.service"));
const TaskStruct = __importStar(require("../structs/task.structs"));
const subtask_struct_1 = require("../structs/subtask.struct");
const superstruct_1 = require("superstruct");
const project_repo_1 = __importDefault(require("../repositories/project.repo"));
const task_repo_1 = require("../repositories/task.repo");
const customError_1 = require("../middlewares/errors/customError");
const comment_structs_1 = require("../structs/comment.structs");
// 생성
const createtask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { projectId } = req.params;
    const body = req.body;
    let tagList = [];
    const rawTags = body.tags;
    if (Array.isArray(rawTags)) {
        tagList = rawTags;
    }
    else if (typeof rawTags === 'string' && rawTags.trim() !== '') {
        tagList = rawTags
            .replace(/[\[\]"]/g, '') // 기호 제거
            .split(',') // 쪼개기
            .map((t) => t.trim())
            .filter((t) => t !== '');
    }
    const data = Object.assign(Object.assign({}, body), { tags: tagList });
    (0, superstruct_1.assert)(data, TaskStruct.CreateTask);
    const result = yield taskService.createNewTask(Number(projectId), userId, data);
    res.status(200).json(result);
});
exports.createtask = createtask;
// 목록 조회
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryData = Object.assign({}, req.query);
    (0, superstruct_1.assert)(queryData, TaskStruct.TaskQuery);
    const result = yield taskService.getTaskList(Number(req.params.projectId), queryData);
    res.json(result);
});
exports.getList = getList;
// 할 일 조회
const getDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, superstruct_1.assert)(req.params, TaskStruct.TaskIdParam);
    res.json(yield taskService.getTaskDetail(Number(req.params.taskId)));
});
exports.getDetail = getDetail;
// 할 일 수정
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const userId = req.user.id;
    const body = req.body;
    let tagList = undefined;
    if (body.tags !== undefined) {
        if (typeof body.tags === 'string' && body.tags.trim() !== '') {
            tagList = body.tags
                .replace(/[\[\]"]/g, '')
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t !== '');
        }
        else if (Array.isArray(body.tags)) {
            tagList = body.tags;
        }
        else {
            tagList = [];
        }
    }
    const data = Object.assign(Object.assign({}, body), (tagList !== undefined && { tags: tagList }));
    (0, superstruct_1.assert)(data, TaskStruct.UpdateTask);
    const result = yield taskService.updateTaskInfo(Number(taskId), data, userId);
    res.status(200).json(result);
});
exports.update = update;
// 할 일 삭제
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield taskService.deleteTask(Number(req.params.taskId), req.user.id);
    res.status(204).end();
});
exports.remove = remove;
/// 하위 할 일 ///
// 할 일(task) 생성
function createSubTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId } = (0, superstruct_1.create)(req.params, TaskStruct.TaskIdParam);
        const subTaskData = {
            taskId,
            title: req.body.title,
            status: 'TODO'
        };
        (0, superstruct_1.assert)(subTaskData, subtask_struct_1.CreateSubTask);
        const newSubTask = yield taskService.createSubTask(subTaskData);
        res.status(201).json(newSubTask);
    });
}
// 하위 할 일 (subtask) 목록 조회
function getSubTasks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId } = (0, superstruct_1.create)(req.params, TaskStruct.TaskIdParam);
        const subTasks = yield taskService.getSubTasks(Number(taskId));
        res.status(200).json(subTasks);
    });
}
// 할 일에 댓글 추가 (POST)
function createComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = req.user;
        const { taskId } = req.params;
        const { content } = req.body;
        const task = yield (0, task_repo_1.findById)(Number(taskId));
        if (!task) {
            console.log('해당 테스크가 없습니다');
            throw new customError_1.BadRequestError('잘못된 요청');
        }
        const member = yield project_repo_1.default.findMemberByIds(task.projectId, userId);
        if (!member) {
            console.log('해당 프로젝트-멤버가 없습니다');
            throw new customError_1.BadRequestError('잘못된 요청');
        }
        const commentData = {
            content,
            projectId: task.projectId,
            taskId: Number(taskId),
            authorId: userId
        };
        const commentDataOk = (0, superstruct_1.create)(commentData, comment_structs_1.CreateComment);
        const newComment = yield taskService.createComment(commentDataOk);
        return res.status(200).json(newComment);
    });
}
// 할 일에 달린 댓글 목록 조회 (GET / Pagination 반영)
function getComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { taskId } = req.params;
        const { page = 1, limit = 10 } = req.query; // 쿼리 스트링에서 페이지 정보 추출
        const userId = req.user.id;
        const result = yield taskService.findAllByTaskId(Number(taskId), userId, Number(page), Number(limit));
        return res.status(200).json(result);
    });
}
