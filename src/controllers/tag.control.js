export class TagController {
  constructor(tagService) {
    this.tagService = tagService;
  }

  // 1. 태그 생성 (POST /tasks/:taskId/tags)

  createTag = async (req, res, next) => {
    try {
      const { taskId } = req.params; // URL에서 taskId 추출
      const { tagName } = req.body; // 바디에서 tagName 추출

      // [임시 수정] 현재 인증 미들웨어를 껐으므로 req.user가 없어 에러가 발생합니다.
      // const { userId } = req.user; // 원래 코드
      const userId = 1; // 테스트를 위해 유저 ID를 1로 고정하여 undefined 에러를 방지합니다.

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

      // [임시 수정] 위와 동일하게 인증 미들웨어 부재로 인한 에러를 방지합니다.
      // const { userId } = req.user;
      const userId = 1; // 테스트용 임시 유저 ID 고정

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
