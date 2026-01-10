import { PageParamsStruct, TaskLIstQueryStruct, UpdateInfoStruct } from '../structs/user.structs';
import { create } from 'superstruct';
import { stripPassword } from '../lib/utils/oAuth';
import { userService } from '../services/user.service';
import { NextFunction, Request, Response } from 'express';

//내 정보 조회
export async function myInfo(req: Request, res: Response, next: NextFunction) {
  const withoutPassword = stripPassword(req.user);
  return res.status(200).json(withoutPassword);
}

//내 정보 수정
export async function updateMyInfo(req: Request, res: Response, next: NextFunction) {
  const data = create(req.body, UpdateInfoStruct);
  const updated = await userService.updateMyInfo(req.user, data);
  return res.status(200).send(updated);
}

//참여 중인 프로젝트 조회
export async function getMyProjects(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.id;
  const { page, limit, order, order_by } = create(req.query, PageParamsStruct);
  const result = await userService.getMyProjects(userId, {
    page,
    limit,
    order,
    order_by
  });
  return res.status(200).json(result);
}

//참여 중인 모든 프로젝트의 할 일 목록 조회
export async function listMyTasks(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.id;
  const query = create(req.query, TaskLIstQueryStruct);
  const result = await userService.listMyTasks(userId, query);
  return res.status(200).json(result);
}
