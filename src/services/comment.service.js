export class CommentService {
  constructor(commentRepository, taskRepository, projectRepository) {
    this.commentRepository = commentRepository;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
  }

  // 1. 공통 로직: 프로젝트 멤버 여부 확인 (명세서 403 대응)
  async checkProjectMember(taskId, userId) {
    const task = await this.taskRepository.findTaskById(taskId); // 할일 담당자(건순님)와 조율 필요
    if (!task) throw { status: 404, message: "존재하지 않는 할 일입니다." };

    const member = await this.projectRepository.findMember(
      //프로젝트 담당자(지민님)와 조율 필요
      task.projectId,
      userId
    );
    if (!member) throw { status: 403, message: "프로젝트 멤버가 아닙니다" };
    return task;
  }

  // 2. 공통 로직: 댓글 존재 확인 및 작성자 권한 검증 (수정/삭제 시 사용)
  async getCommentAndVerifyAuthor(commentId, userId, errorMessage) {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) throw { status: 404 };

    // 프로젝트 멤버인지 먼저 확인
    await this.checkProjectMember(comment.taskId, userId);

    // 본인 작성 여부 확인 (명세서 403 대응)
    if (comment.authorId !== +userId) {
      throw { status: 403, message: errorMessage };
    }
    return comment;
  }

  createComment = async (taskId, userId, content) => {
    // 명세서 400: 요청 형식 검사
    if (!content || content.trim() === "") {
      throw { status: 400, message: "잘못된 요청 형식" };
    }

    await this.checkProjectMember(taskId, userId);
    return await this.commentRepository.createComment(taskId, userId, content);
  };

  // 할 일에 달린 댓글 목록 조회 (Service 추가)
  getCommentsByTaskId = async (taskId, userId, page, limit) => {
    await this.checkProjectMember(taskId, userId);

    const skip = (+page - 1) * +limit;
    return await this.commentRepository.findAllByTaskId(taskId, skip, limit);
  };

  updateComment = async (commentId, userId, content) => {
    if (!content || content.trim() === "") {
      throw { status: 400, message: "잘못된 요청 형식" };
    }

    // 권한 검증 로직을 한 줄로 축약
    await this.getCommentAndVerifyAuthor(
      commentId,
      userId,
      "자신이 작성한 댓글만 수정할 수 있습니다"
    );

    return await this.commentRepository.updateComment(commentId, content);
  };

  deleteComment = async (commentId, userId) => {
    // 권한 검증 로직을 한 줄로 축약
    await this.getCommentAndVerifyAuthor(
      commentId,
      userId,
      "자신이 작성한 댓글만 삭제할 수 있습니다"
    );

    return await this.commentRepository.deleteComment(commentId);
  };
}
