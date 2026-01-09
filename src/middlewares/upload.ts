import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  }
});

// 1. 회원가입시_프로필 이미지
const profileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('files/')) {
    cb(null, true);
  } else {
    cb(new Error('프로필은 이미지 파일만 업로드 가능합니다.'));
  }
};

// 2. 할 일 등록시_첨부파일 (모든 파일 허용: ZIP, Excel, PDF 등)
const taskFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  cb(null, true);
};

export const uploadProfile = multer({ 
  storage, 
  fileFilter: profileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

export const uploadTaskFile = multer({ 
  storage, 
  fileFilter: taskFilter, 
  limits: { fileSize: 20 * 1024 * 1024 } 
});