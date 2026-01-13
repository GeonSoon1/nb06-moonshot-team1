import { Request } from 'express';
import { FileResponse } from '../dto/fileResponseDTO';


//  파일 객체를 받아 접근 가능한 URL과 이름을 반환합니다.
export const getFileResponse = (req: Request, file: Express.Multer.File): FileResponse => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  
  return {
    fileName: file.filename, 
    url: url                    
  };
};
