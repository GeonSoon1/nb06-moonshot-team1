import express from 'express';
import { TagController } from '../controllers/tag.control.js';
import { TagService } from '../services/tag.service.js';
import { TagRepository } from '../repositories/tag.repo.js';
import { prisma } from '../lib/prisma.js'; // 프로젝트의 prisma 인스턴스 경로
import authMiddleware from '../middlewares/authenticate.js'; // 로그인 인증 미들웨어

const router = express.Router();

// 1. 의존성 주입 (리포지토리 -> 서비스 -> 컨트롤러 순서로 연결)
const tagRepository = new TagRepository(prisma);
// 주의: TagService는 인가 처리를 위해 Project, Task 리포지토리도 필요하므로 함께 주입합니다.
const tagService = new TagService(tagRepository, projectRepository, taskRepository);
const tagController = new TagController(tagService);

// 모든 태그 관련 기능은 로그인이 필요하므로 authMiddleware를 공통 적용하거나 개별 라우터에 추가합니다.

// 2. 특정 할 일의 태그 목록 조회
router.get('/:taskId/tags', authMiddleware, tagController.getTags);

// 3. 할 일에 태그 추가 (엔터 입력 시 호출)
router.post('/:taskId/tags', authMiddleware, tagController.createTag);

// 4. 할 일에서 태그 삭제 (X 버튼 클릭 시 호출)
router.delete('/:taskId/tags/:tagId', authMiddleware, tagController.deleteTag);

export default router;
