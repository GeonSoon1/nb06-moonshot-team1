export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  /** 1. 할 일에 댓글 추가 (POST) */
  createComment = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // 인증 미들웨어(Bearer token)에서 가져온 정보

      const newComment = await this.commentService.createComment(
        taskId,
        userId,
        content
      );

      // 성공 시 명세서에 정의된 200 OK 응답
      return res.status(200).json(newComment);
    } catch (error) {
      // 에러 발생 시 공통 에러 핸들러로 전달
      next(error);
    }
  };

  /** 2. 할 일에 달린 댓글 조회 (GET / Pagination 반영) */
  getComments = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { page = 1, limit = 10 } = req.query; // 쿼리 스트링에서 페이지 정보 추출
      const userId = req.user.id;

      const result = await this.commentService.getCommentsByTaskId(
        taskId,
        userId,
        page,
        limit
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /** 3. 단일 댓글 조회 (GET) */
  getCommentById = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      // 댓글 상세 조회를 위해 서비스 호출 (여기서 멤버 체크 등 수행)
      const comment = await this.commentService.getCommentDetail(
        commentId,
        userId
      );

      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  /** 4. 댓글 수정 (PATCH) */
  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const updatedComment = await this.commentService.updateComment(
        commentId,
        userId,
        content
      );

      return res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  /** 5. 댓글 삭제 (DELETE) */
  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      await this.commentService.deleteComment(commentId, userId);

      // 명세서에 따라 성공 시 204 No Content 반환
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
