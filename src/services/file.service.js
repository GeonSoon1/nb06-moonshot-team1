
export const generateFileUrls = (reqProtocol, reqHost, files) => {
  // 다중 파일인 경우 (req.files)
  if (Array.isArray(files)) {
    return files.map(file => `${reqProtocol}://${reqHost}/uploads/${file.filename}`);
  }
  // 단일 파일인 경우 (req.file)
  return `${reqProtocol}://${reqHost}/uploads/${files.filename}`;
};