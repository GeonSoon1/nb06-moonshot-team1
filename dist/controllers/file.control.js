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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const customError_1 = require("../middlewares/errors/customError");
const fileService = __importStar(require("../services/file.service"));
// 이미지 하나(프로필)
const uploadSingle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new customError_1.BadRequestError("파일이 없습니다");
    }
    // req.get('host')는 undefined일 수도 있어서 '!'를 붙여 "확실히 있다"고 알려줍니다.
    const host = req.get('host');
    const protocol = req.protocol;
    const url = fileService.generateFileUrls(protocol, host, req.file);
    res.status(201).json({ url });
});
exports.uploadSingle = uploadSingle;
// 여러개 이미지(task 첨부파일)
const uploadMultiple = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!req.files || req.files.length === 0) {
        throw new customError_1.BadRequestError("파일이 없습니다");
    }
    const host = req.get('host');
    const protocol = req.protocol;
    const urls = fileService.generateFileUrls(protocol, host, files);
    res.status(201).json({ urls });
});
exports.uploadMultiple = uploadMultiple;
