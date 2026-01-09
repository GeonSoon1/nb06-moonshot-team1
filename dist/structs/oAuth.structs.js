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
exports.LoginUserBodyStruct = exports.CreateUserBodyStruct = void 0;
const s = __importStar(require("superstruct"));
const email = s.refine(s.string(), 'Email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
const Name = s.refine(s.string(), 'Name', (value) => /^[A-Za-z0-9가-힣]{2,12}$/.test(value));
const password = s.refine(s.string(), 'Password', (value) => value.length >= 8 && value.length <= 16);
exports.CreateUserBodyStruct = s.object({
    name: Name,
    email: email,
    password: password,
    profileImage: s.optional(s.nullable(s.string()))
});
exports.LoginUserBodyStruct = s.object({
    email: email,
    password: password
});
