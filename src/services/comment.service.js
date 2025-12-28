export class CommentService {
  constructor(commentRepository, prisma) {
    this.commentRepository = commentRepository;
    this.prisma = prisma; // 직접 조회를 위해 prisma 주입
  }

  // 공통 로직: 직접 DB를 조회하여 프로젝트 멤버 여부 확인
  async checkProjectMember(taskId, userId) {
    // 1. Task 존재 여부 직접 확인
    const task = await this.prisma.task.findUnique({
      where: { id: +taskId },
    });

    if (!task) {
      throw { status: 404, message: "존재하지 않는 할 일입니다." };
    }

    // 2. 해당 프로젝트의 멤버인지 직접 확인 (schema 명칭 반영: memberId)
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_memberId: {
          projectId: task.projectId,
          memberId: +userId,
        },
      },
    });

    if (!member) {
      throw { status: 403, message: "프로젝트 멤버가 아닙니다" };
    }

    return task; // taskId뿐만 아니라 projectId 정보가 포함된 task 객체 반환
  }

  // 권한 검증 로직 (수정/삭제 시 사용)
  async getCommentAndVerifyAuthor(commentId, userId, errorMessage) {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) throw { status: 404 };

    // 프로젝트 멤버인지 확인
    await this.checkProjectMember(comment.taskId, userId);

    // 본인 작성 여부 확인
    if (comment.authorId !== +userId) {
      throw { status: 403, message: errorMessage };
    }
    return comment;
  }

  createComment = async (taskId, userId, content) => {
    if (!content || content.trim() === "") {
      throw { status: 400, message: "잘못된 요청 형식" };
    }

    // task 정보를 가져와서 projectId를 확보해야 함 (schema 요구사항)
    const task = await this.checkProjectMember(taskId, userId);

    return await this.commentRepository.createComment(
      +taskId,
      +task.projectId, // schema상 필수 필드
      +userId,
      content
    );
  };

  getCommentsByTaskId = async (taskId, userId, page, limit) => {
    await this.checkProjectMember(taskId, userId);
    const skip = (+page - 1) * +limit;
    return await this.commentRepository.findAllByTaskId(taskId, skip, limit);
  };

  updateComment = async (commentId, userId, content) => {
    if (!content || content.trim() === "") {
      throw { status: 400, message: "잘못된 요청 형식" };
    }
    await this.getCommentAndVerifyAuthor(
      commentId,
      userId,
      "자신이 작성한 댓글만 수정할 수 있습니다"
    );
    return await this.commentRepository.updateComment(commentId, content);
  };

  deleteComment = async (commentId, userId) => {
    await this.getCommentAndVerifyAuthor(
      commentId,
      userId,
      "자신이 작성한 댓글만 삭제할 수 있습니다"
    );
    await this.commentRepository.deleteComment(commentId);
  };
}
