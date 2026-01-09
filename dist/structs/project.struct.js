"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchProject = exports.CreateProject = void 0;
const superstruct_1 = __importDefault(require("superstruct"));
exports.CreateProject = superstruct_1.default.object({
    name: superstruct_1.default.string(),
    description: superstruct_1.default.size(superstruct_1.default.string(), 1, 40),
    ownerId: superstruct_1.default.min(superstruct_1.default.integer(), 1)
});
exports.PatchProject = superstruct_1.default.partial(exports.CreateProject);
