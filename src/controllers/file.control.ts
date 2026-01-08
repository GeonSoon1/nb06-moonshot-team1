import { BadRequestError } from '../middlewares/errors/customError';
import { Request, Response } from 'express';
import * as fileService from '../services/file.service';

// 이미지 하나(프로필)
export const uploadSingle = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new BadRequestError("파일이 없습니다");
  }
  
  // req.get('host')는 undefined일 수도 있어서 '!'를 붙여 "확실히 있다"고 알려줍니다.
  const host = req.get('host')!
  const protocol = req.protocol

  const url = fileService.generateFileUrls(protocol, host, req.file);

  res.status(201).json({ url });
};

// 여러개 이미지(task 첨부파일)
export const uploadMultiple = async (req: Request, res: Response): Promise<void> => {
  
  const files = req.files as Express.Multer.File[]

  if (!req.files || req.files.length === 0) {
    throw new BadRequestError("파일이 없습니다");
  }

  const host = req.get('host')!
  const protocol = req.protocol;

  const urls = fileService.generateFileUrls(protocol, host, files);

  res.status(201).json({ urls });
};