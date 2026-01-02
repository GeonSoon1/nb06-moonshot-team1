export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  // 생성 (내용 검증 유지)
  createComment = async (taskId, userId, content) => {
    if (!content || content.trim() === '') {
      throw { status: 400, message: '잘못된 요청 형식' };
    }
    // 미들웨어가 이미 멤버십을 확인했으므로 바로 생성
    return await this.commentRepository.createComment(+taskId, null, +userId, content);
  };

  // 수정
  updateComment = async (commentId, userId, content) => {
    if (!content || content.trim() === '') {
      throw { status: 400, message: '잘못된 요청 형식' };
    }

    // [복구] 상세 에러 메시지를 위해 본인 확인 로직을 수행
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) throw { status: 404, message: '존재하지 않는 댓글입니다.' };

    if (comment.authorId !== +userId) {
      throw { status: 403, message: '자신이 작성한 댓글만 수정할 수 있습니다' };
    }

    return await this.commentRepository.updateComment(commentId, content);
  };

  // 삭제
  deleteComment = async (commentId, userId) => {
    // [복구] 상세 에러 메시지를 위해 본인 확인 로직을 수행
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) throw { status: 404, message: '존재하지 않는 댓글입니다.' };

    if (comment.authorId !== +userId) {
      throw { status: 403, message: '자신이 작성한 댓글만 삭제할 수 있습니다' };
    }

    await this.commentRepository.deleteComment(commentId);
  };
}
