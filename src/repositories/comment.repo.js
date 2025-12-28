export class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 1. 중복되는 include 구문을 공통 상수로 관리 (가독성 & 유지보수 최적화)
  // 명세서에 정의된 author 정보를 한 곳에서 관리하여, 필드가 추가되어도 여기만 수정하면 됩니다.
  commentInclude = {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    },
  };

  // 댓글 생성 (author 정보 포함해서 반환)
  createComment = async (taskId, authorId, content) => {
    return await this.prisma.comment.create({
      data: {
        taskId: +taskId,
        authorId: +authorId,
        content,
      },
      include: this.commentInclude, //include 구문 공통 관리
    });
  };

  // 단일 댓글 조회 (작성자 정보 포함)
  findCommentById = async (commentId) => {
    return await this.prisma.comment.findUnique({
      where: { id: +commentId },
      include: this.commentInclude, //include 구문 공통 관리
    });
  };

  // 할 일별 댓글 목록 조회 (Pagination 반영)
  findAllByTaskId = async (taskId, skip, limit) => {
    // Promise.all로 병렬 처리
    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { taskId: +taskId },
        include: this.commentInclude,
        skip: +skip,
        take: +limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.comment.count({
        where: { taskId: +taskId },
      }),
    ]);

    return { data, total };
  };

  updateComment = async (commentId, content) => {
    return await this.prisma.comment.update({
      where: { id: +commentId },
      data: { content },
      include: this.commentInclude,
    });
  };

  deleteComment = async (commentId) => {
    // 삭제 작업도 일관성을 위해 + 연산자 사용 및 await 리턴
    return await this.prisma.comment.delete({
      where: { id: +commentId },
    });
  };
}
