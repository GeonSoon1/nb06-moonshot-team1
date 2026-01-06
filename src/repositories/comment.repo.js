export class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  commentInclude = {
    author: {
      select: {
        member: {
          // ProjectMember를 거쳐 User 정보를 가져와야 함
          select: { id: true, name: true, email: true, profileImage: true }
        }
      }
    }
  };

  createComment = async (taskId, projectId, authorId, content) => {
    return await this.prisma.comment.create({
      data: {
        taskId: +taskId,
        projectId: +projectId, // 추가됨
        authorId: +authorId,
        content
      },
      include: this.commentInclude
    });
  };

  findCommentById = async (commentId) => {
    return await this.prisma.comment.findUnique({
      where: { id: +commentId },
      include: this.commentInclude
    });
  };

  findAllByTaskId = async (taskId, skip, limit) => {
    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { taskId: +taskId },
        include: this.commentInclude,
        skip: +skip,
        take: +limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.comment.count({ where: { taskId: +taskId } })
    ]);
    return { data, total };
  };

  updateComment = async (commentId, content) => {
    return await this.prisma.comment.update({
      where: { id: +commentId },
      data: { content },
      include: this.commentInclude
    });
  };

  deleteComment = async (commentId) => {
    return await this.prisma.comment.delete({ where: { id: +commentId } });
  };
}
