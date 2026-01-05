import {
  NotFoundError,
  BadRequestError,
  ForbiddenError
} from '../middlewares/errors/customError.js';
import { formatComment } from '../lib/util.js';

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  // 1. 조회 (페이지네이션 적용)
  // 컨트롤러가 호출하는 이름(findAllByTaskId)으로 통일했습니다.
  findAllByTaskId = async (taskId, userId, page, limit) => {
    const skip = (Number(page) - 1) * Number(limit); // skip 계산 추가

    // 레포지토리의 findAllByTaskId 호출
    const result = await this.commentRepository.findAllByTaskId(+taskId, skip, +limit);
    console.log('commnet.service의 결과값', result);
    // 데이터가 없을 때를 대비한 안전한 반환 구조
    return {
      data: (result.data || []).map((comment) => formatComment(comment)),
      total: result.total || 0
    };
  };

  // 2. 생성 (내용 검증 유지)
  createComment = async (taskId, projectId, userId, content) => {
    if (!content || content.trim() === '') {
      throw new BadRequestError('잘못된 요청 형식');
    }
    // 미들웨어가 이미 멤버십을 확인했으므로 바로 생성
    return formatComment(
      await this.commentRepository.createComment(+taskId, +projectId, +userId, content)
    );
  };

  // 3. 수정
  updateComment = async (commentId, userId, content) => {
    if (!content || content.trim() === '') {
      throw new BadRequestError('잘못된 요청 형식');
    }

    const comment = await this.commentRepository.findCommentById(+commentId);
    if (!comment) throw new NotFoundError('존재하지 않는 댓글입니다.');

    if (comment.authorId !== +userId) {
      throw new ForbiddenError('자신이 작성한 댓글만 수정할 수 있습니다');
    }

    return formatComment(await this.commentRepository.updateComment(+commentId, content));
  };

  // 4. 삭제
  deleteComment = async (commentId, userId) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundError('존재하지 않는 댓글입니다.');

    if (comment.authorId !== +userId) {
      throw new ForbiddenError('자신이 작성한 댓글만 수정할 수 있습니다');
    }

    await this.commentRepository.deleteComment(commentId);
  };
}
