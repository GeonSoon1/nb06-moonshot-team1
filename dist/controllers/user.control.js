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
exports.myInfo = myInfo;
exports.updateMyInfo = updateMyInfo;
exports.getMyProjects = getMyProjects;
exports.listMyTasks = listMyTasks;
const user_structs_1 = require("../structs/user.structs");
const superstruct_1 = require("superstruct");
const oAuth_1 = require("../lib/utils/oAuth");
const user_service_1 = require("../services/user.service");
//내 정보 조회
function myInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const withoutPassword = (0, oAuth_1.stripPassword)(req.user);
        return res.status(200).json(withoutPassword);
    });
}
//내 정보 수정
function updateMyInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, user_structs_1.UpdateInfoStruct);
        const updated = yield user_service_1.userService.updateMyInfo(req.user, data);
        return res.status(200).send(updated);
    });
}
//참여 중인 프로젝트 조회
function getMyProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.id;
        const { page, limit, order, order_by } = (0, superstruct_1.create)(req.query, user_structs_1.PageParamsStruct);
        const result = yield user_service_1.userService.getMyProjects(userId, {
            page,
            limit,
            order,
            order_by
        });
        return res.status(200).json(result);
    });
}
//참여 중인 모든 프로젝트의 할 일 목록 조회
function listMyTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.id;
        const query = (0, superstruct_1.create)(req.query, user_structs_1.TaskLIstQueryStruct);
        const result = yield user_service_1.userService.listMyTasks(userId, query);
        return res.status(200).json(result);
    });
}
