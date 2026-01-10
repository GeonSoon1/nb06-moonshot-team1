import * as fileService from '../services/file.service.js';

export const uploadSingleFile = async (req, res) => {
  if (!req.file) {
    throw new Error('업로드할 파일이 없습니다.');
  }

  const result = fileService.getFileResponse(req, req.file);
  res.status(201).json(result);
};
