"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTaskFile = exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = crypto_1.default.randomUUID();
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
    }
});
// 1. 회원가입시_프로필 이미지
const profileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('프로필은 이미지 파일만 업로드 가능합니다.'));
    }
};
// 2. 할 일 등록시_첨부파일 (모든 파일 허용: ZIP, Excel, PDF 등)
const taskFilter = (req, file, cb) => {
    cb(null, true);
};
exports.uploadProfile = (0, multer_1.default)({
    storage,
    fileFilter: profileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
exports.uploadTaskFile = (0, multer_1.default)({
    storage,
    fileFilter: taskFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
});
