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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLIstQueryStruct = exports.PageParamsStruct = exports.IdParamsStruct = exports.UpdateInfoStruct = void 0;
const s = __importStar(require("superstruct"));
//이메일: 기본적인 이메일 형식 체크, 이름: 영어 + 숫자 + 한글, 2~12글자, 비밀번호: 8~16글자
const email = s.refine(s.string(), 'Email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
const Name = s.refine(s.string(), 'Name', (value) => /^[A-Za-z0-9가-힣]{2,12}$/.test(value));
const dateString = s.refine(s.string(), 'DateString', (value) => /^\d{4}-\d{2}-\d{2}$/.test(value));
const password = s.refine(s.string(), 'Password', (value) => value.length >= 8 && value.length <= 16);
exports.UpdateInfoStruct = s.object({
    email: s.optional(email),
    name: s.optional(Name),
    currentPassword: s.optional(password),
    newPassword: s.optional(password),
    profileImage: s.optional(s.nullable(s.string()))
});
//일단은 유저에서 사용
const integerString = s.coerce(s.integer(), s.string(), (value) => parseInt(value));
exports.IdParamsStruct = s.object({
    id: integerString
});
const Limit = s.defaulted(s.refine(integerString, 'Limit', (value) => value >= 1 && value <= 100), 10);
exports.PageParamsStruct = s.object({
    page: s.defaulted(integerString, 1),
    limit: Limit,
    order: s.defaulted(s.enums(['asc', 'desc']), 'desc'),
    order_by: s.defaulted(s.enums(['created_at', 'name']), 'created_at')
});
exports.TaskLIstQueryStruct = s.object({
    from: s.optional(dateString),
    to: s.optional(dateString),
    project_id: s.optional(integerString),
    status: s.optional(s.enums(['todo', 'in_progress', 'done'])),
    assignee_id: s.optional(integerString),
    keyword: s.optional(s.nonempty(s.string())) //빈문자열은 실패 undefined는 통과
});
