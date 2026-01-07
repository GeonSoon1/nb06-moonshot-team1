import { BadRequestError } from '../middlewares/errors/customError.js';
import * as fileService from '../services/file.service.js';

export const uploadSingle = async (req, res) => {
  if (!req.file) throw new BadRequestError("파일이 없습니다");
  console.log('file.control에서의 단일 파일 req.protocol: ', req.protocol)
  console.log('file.control에서의 단일 파일 req.host: ', req.host)
  console.log('file.control에서의 단일 파일 req.file: ', req.file)
  // 서비스에 프로토콜, 호스트명, 파일객체를 넘겨서 URL을 받아옴
  const url = fileService.generateFileUrls(req.protocol, req.get('host'), req.file);
  console.log('file.control에서의 단일 파일 url', url)
  res.status(201).json({ url });
};

export const uploadMultiple = async (req, res) => {
  if (!req.files || req.files.length === 0) throw new BadRequestError("파일이 없습니다");
  console.log('file.control에서의 다중 파일 req.protocol: ', req.protocol)
  console.log('file.control에서의 다중 파일 req.host: ', req.host)
  console.log('file.control에서의 다중 파일 req.files: ', req.files)

  const urls = fileService.generateFileUrls(req.protocol, req.get('host'), req.files);
  console.log('file.control에서의 다중 파일 urls', urls)
  res.status(201).json({ urls });
};