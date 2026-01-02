import express from 'express';
import { TagController } from '../controllers/tag.control.js';
import { TagService } from '../services/tag.service.js';
import { TagRepository } from '../repositories/tag.repo.js';
import { prisma } from '../lib/prismaClient.js';
// import { authenticate } from '../middlewares/authenticate.js';
// import authorize from '../middlewares/authorize.js'; // 팀원의 authorize.js 적용
const tempAuth = (req, res, next) => {
  req.user = { id: 1 }; // DB에 존재하는 유저 ID 1번으로 가정
  next();
};

const router = express.Router();

const tagRepository = new TagRepository(prisma);
const tagService = new TagService(tagRepository);
const tagController = new TagController(tagService);

// 모든 태그 기능에 프로젝트 멤버 권한 미들웨어 적용
router.get('/:taskId/tags', tempAuth, tagController.getTags);
router.post('/:taskId/tags', tempAuth, tagController.createTag);
router.delete(
  '/:taskId/tags/:tagId',
  //   authenticate,
  //   authorize.projectMember,
  tagController.deleteTag
);

export default router;
