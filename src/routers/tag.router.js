import express from 'express';
import { TagController } from '../controllers/tag.control.js';
import { TagService } from '../services/tag.service.js';
import { TagRepository } from '../repositories/tag.repo.js';
import { prisma } from '../lib/prismaClient.js'; // 인증 미들웨어와 동일한 경로 사용
// import authMiddleware from '../middlewares/authenticate.js'; // 에러방지 잠시 주석

const router = express.Router();

// 1. 의존성 주입 (리포지토리 -> 서비스 -> 컨트롤러 순서로 연결)
const tagRepository = new TagRepository(prisma);

// 수정 포인트: projectRepository와 taskRepository가 정의되지 않았으므로 null을 전달합니다.
// 이렇게 해야 ReferenceError를 피하고 서버를 띄울 수 있습니다.
const tagService = new TagService(tagRepository, null, null);
const tagController = new TagController(tagService);

// 모든 태그 관련 기능은 로그인이 필요하므로 authMiddleware를 공통 적용하거나 개별 라우터에 추가합니다.

// 2. 특정 할 일의 태그 목록 조회
// router.get('/:taskId/tags', authMiddleware, tagController.getTags); 원래 이거
router.get('/:taskId/tags', tagController.getTags); // authMiddleware 잠시 뺌

// 3. 할 일에 태그 추가 (엔터 입력 시 호출)
router.post('/:taskId/tags', tagController.createTag); // 얘도

// 4. 할 일에서 태그 삭제 (X 버튼 클릭 시 호출)
router.delete('/:taskId/tags/:tagId', tagController.deleteTag); // 얘도

export default router;
