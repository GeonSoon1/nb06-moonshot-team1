import { Request, Response } from 'express';
import * as fileService from '../services/file.service';
import { FileResponse } from '../dto/fileResponseDTO';
import { BadRequestError } from '../middlewares/errors/customError';

export const uploadSingleFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new Error("업로드할 파일이 없습니다.");
  }

  const result: FileResponse = fileService.getFileResponse(req, req.file);
  res.status(201).json(result);
};