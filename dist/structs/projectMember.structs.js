"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectMember = void 0;
const superstruct_1 = __importDefault(require("superstruct"));
const is_uuid_1 = __importDefault(require("is-uuid"));
const UUID = superstruct_1.default.refine(superstruct_1.default.string(), 'uuid', (value) => is_uuid_1.default.anyNonNil(value));
const MemberRole = superstruct_1.default.union([superstruct_1.default.literal('OWNER'), superstruct_1.default.literal('MEMBER')]);
exports.CreateProjectMember = superstruct_1.default.object({
    projectId: superstruct_1.default.min(superstruct_1.default.integer(), 1),
    memberId: superstruct_1.default.min(superstruct_1.default.integer(), 1),
    invitationId: superstruct_1.default.optional(UUID),
    role: MemberRole
});
