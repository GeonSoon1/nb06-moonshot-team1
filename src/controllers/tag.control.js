export class TagController {
  constructor(tagService) {
    this.tagService = tagService;
  }

  // 1. 태그 생성 (POST /tasks/:taskId/tags)

  createTag = async (req, res, next) => {
    try {
      const { taskId } = req.params; // URL에서 taskId 추출
      const { tagName } = req.body; // 바디에서 tagName 추출
      const { userId } = req.user; // 인증 미들웨어에서 보낸 유저 정보

      if (!tagName) {
        return res.status(400).json({ message: '태그 이름을 입력해주세요.' });
      }

      const newTag = await this.tagService.createTag(userId, taskId, tagName);

      return res.status(201).json({
        message: '태그가 성공적으로 추가되었습니다.',
        data: newTag
      });
    } catch (error) {
      next(error); // 에러 처리 미들웨어로 전달
    }
  };

  // 2. 태그 삭제 (DELETE /tasks/:taskId/tags/:tagId)

  deleteTag = async (req, res, next) => {
    try {
      const { taskId, tagId } = req.params;
      const { userId } = req.user;

      await this.tagService.deleteTag(userId, taskId, tagId);

      return res.status(200).json({
        message: '태그가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  };

  // 3. 특정 할 일의 태그 목록 조회 (GET /tasks/:taskId/tags)

  getTags = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const tags = await this.tagService.getTagsByTaskId(taskId);

      return res.status(200).json({ data: tags });
    } catch (error) {
      next(error);
    }
  };
}
