"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// multer: 파일 업로드 처리 미들웨어
const multer_1 = __importDefault(require("multer"));
// 경로 관련 유틸 함수들
const path_1 = __importDefault(require("path"));
// 파일 시스템 (폴더 존재 확인, 폴더 생성 등)
const fs_1 = __importDefault(require("fs"));
// uploads 저장 폴더 절대경로 생성
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
// console.log(uploadDir)
// upload 폴더 없으면 자동으로 생성
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// 브라우저에서 데이터가 들어오면 multer가 임시 file객체를 만듦.
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const base = path_1.default.basename(file.originalname, ext);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});
// upload = 파일을 지정한 폴더에 저장해주는 “업로드 미들웨어를 만들어내는 객체(upload)”
//그래서 아래처럼 .single(), .array(), .fields() 같은 메서드를 호출할 수 있게 됨.
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB 제한
});
