export const getFileResponse = (req, file) => {
  // 브라우저에서 접근 가능한 전체 URL 생성
  const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

  return {
    fileName: file.filename,
    url: url
  };
};

//민수 추가
// export const getFileUrl = (req, file) => {
//   return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
// };
