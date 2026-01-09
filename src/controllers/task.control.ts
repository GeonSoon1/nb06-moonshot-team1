import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import * as TaskStruct from '../structs/task.structs';
import { CreateSubTask } from '../structs/subtask.struct';
import { create, assert } from 'superstruct';
import { TaskInput, TaskQueryInput } from '../types/task';
import { CreateSubTaskInput } from '../types/subtask';
import { FormattedSubTask } from '../dto/subTaskResponseDTO';
import projectRepo from '../repositories/project.repo';
import { findById } from '../repositories/task.repo';
import { BadRequestError } from '../middlewares/errors/customError';
import { CreateComment } from '../structs/comment.structs';

// 생성
export const createtask = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const body = req.body;

  let tagList: string[] = [];
  const rawTags = body.tags;

  if (Array.isArray(rawTags)) {
    tagList = rawTags;
  } else if (typeof rawTags === 'string' && rawTags.trim() !== '') {
    tagList = rawTags
      .replace(/[\[\]"]/g, '') // 기호 제거
      .split(',') // 쪼개기
      .map((t: string) => t.trim())
      .filter((t: string) => t !== '');
  }

  const data: TaskInput = {
    ...body,
    tags: tagList
  };

  assert(data, TaskStruct.CreateTask);

  const result = await taskService.createNewTask(Number(projectId), userId, data);
  res.status(200).json(result);
};

// 목록 조회
export const getList = async (req: Request, res: Response): Promise<void> => {
  const queryData: TaskQueryInput = { ...req.query };

  assert(queryData, TaskStruct.TaskQuery);

  const result = await taskService.getTaskList(Number(req.params.projectId), queryData);

  res.json(result);
};

// 할 일 조회
export const getDetail = async (req: Request, res: Response): Promise<void> => {
  assert(req.params, TaskStruct.TaskIdParam);

  res.json(await taskService.getTaskDetail(Number(req.params.taskId)));
};

// 할 일 수정
export const update = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const body = req.body;

  let tagList: string[] | undefined = undefined;

  if (body.tags !== undefined) {
    if (typeof body.tags === 'string' && body.tags.trim() !== '') {
      tagList = body.tags
        .replace(/[\[\]"]/g, '')
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t !== '');
    } else if (Array.isArray(body.tags)) {
      tagList = body.tags;
    } else {
      tagList = [];
    }
  }

  const data: TaskInput = {
    ...body,
    ...(tagList !== undefined && { tags: tagList })
  };

  assert(data, TaskStruct.UpdateTask);

  const result = await taskService.updateTaskInfo(Number(taskId), data, userId);

  res.status(200).json(result);
};

// 할 일 삭제
export const remove = async (req: Request, res: Response): Promise<void> => {
  await taskService.deleteTask(Number(req.params.taskId), req.user.id);
  res.status(204).end();
};

/// 하위 할 일 ///

// 할 일(task) 생성
export async function createSubTask(req: Request, res: Response, next: NextFunction) {
  const { taskId } = create(req.params, TaskStruct.TaskIdParam) as { taskId: number };

  const subTaskData: CreateSubTaskInput = {
    taskId,
    title: req.body.title,
    status: 'TODO'
  };

  assert(subTaskData, CreateSubTask);

  const newSubTask = await taskService.createSubTask(subTaskData);

  res.status(201).json(newSubTask);
}

// 하위 할 일 (subtask) 목록 조회
export async function getSubTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { taskId } = create(req.params, TaskStruct.TaskIdParam) as { taskId: number };

  const subTasks: FormattedSubTask[] = await taskService.getSubTasks(Number(taskId));

  res.status(200).json(subTasks);
}

// 할 일에 댓글 추가 (POST)
export async function createComment(req: Request, res: Response, next: NextFunction) {
  const { id: userId } = req.user;
  const { taskId } = req.params;
  const { content } = req.body;

  const task = await findById(Number(taskId));
  if (!task) {
    console.log('해당 테스크가 없습니다');
    throw new BadRequestError('잘못된 요청');
  }
  const member = await projectRepo.findMemberByIds(task.projectId, userId);
  if (!member) {
    console.log('해당 프로젝트-멤버가 없습니다');
    throw new BadRequestError('잘못된 요청');
  }
  const commentData = {
    content,
    projectId: task.projectId,
    taskId: Number(taskId),
    authorId: userId
  };
  const commentDataOk = create(commentData, CreateComment);
  const newComment = await taskService.createComment(commentDataOk);
  return res.status(200).json(newComment);
}

// 할 일에 달린 댓글 목록 조회 (GET / Pagination 반영)
export async function getComments(req: Request, res: Response, next: NextFunction) {
  const { taskId } = req.params;
  const { page = 1, limit = 10 } = req.query; // 쿼리 스트링에서 페이지 정보 추출
  const userId = req.user.id;

  const result = await taskService.findAllByTaskId(
    Number(taskId),
    userId,
    Number(page),
    Number(limit)
  );
  return res.status(200).json(result);
}
