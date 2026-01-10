"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileResponse = void 0;
//  파일 객체를 받아 접근 가능한 URL과 이름을 반환합니다.
const getFileResponse = (req, file) => {
    const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return {
        fileName: file.filename,
        url: url
    };
};
exports.getFileResponse = getFileResponse;
