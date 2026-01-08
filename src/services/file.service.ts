

export const generateFileUrls = (
  protocol: string, 
  host: string, 
  fileData: Express.Multer.File | Express.Multer.File[]
): string | string[] => {
  
  // 배열인지 확인하여 타입 가드(Type Guard) 적용
  if (Array.isArray(fileData)) {
    return fileData.map(file => `${protocol}://${host}/uploads/${file.filename}`);
  }
  
  // 단일 파일인 경우
  return `${protocol}://${host}/uploads/${fileData.filename}`;
};