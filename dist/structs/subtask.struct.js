"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchSubTask = exports.CreateSubTask = void 0;
const superstruct_1 = __importDefault(require("superstruct"));
const TaskStatus = superstruct_1.default.union([superstruct_1.default.literal('TODO'), superstruct_1.default.literal('IN_PROGRESS'), superstruct_1.default.literal('DONE')]);
exports.CreateSubTask = superstruct_1.default.object({
    taskId: superstruct_1.default.min(superstruct_1.default.integer(), 1),
    title: superstruct_1.default.string(),
    status: TaskStatus
});
exports.PatchSubTask = superstruct_1.default.partial(exports.CreateSubTask);
