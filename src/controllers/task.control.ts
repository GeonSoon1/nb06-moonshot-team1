import * as taskService from '../services/task.service';
import * as TaskStruct from '../structs/task.structs';
import { CreateSubTask } from '../structs/subtask.struct';
import { assert } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { TaskInput } from '../dto/task';

// 생성
export const create = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const body = req.body;

  // 2. Multipart로 온 문자열 "A,B"를 진짜 배열 ["A", "B"]로 바꿉니다
  let tagList: string[] = [];
  if (Array.isArray(body.tags)) {
    // 1. 이미 배열로 들어왔다면 그대로 사용
    tagList = body.tags;
  } else if (typeof body.tags === 'string' && body.tags.trim() !== '') {
    // 2. 1개만 보내서 문자열로 왔다면 배열로 감싸줌 ['태그1']
    tagList = [body.tags.trim()];
  }

  const data: TaskInput = {
    ...body,
    tags: tagList
  };
  assert(body, TaskStruct.CreateTask);

  const result = await taskService.createNewTask(Number(projectId), userId, data);

  res.status(200).json(result);
};

// 목록 조회
export const getList = async (req: Request, res: Response) => {
  const queryData = { ...req.query };

  assert(queryData, TaskStruct.TaskQuery);

  const result = await taskService.getTaskList(
    Number(req.params.projectId),
    queryData // 검증된 쿼리 데이터를 전달
  );

  res.json(result);
};

// 할 일(task) 조회
export const getDetail = async (req: Request, res: Response) => {
  assert(req.params, TaskStruct.TaskIdParam);

  res.json(await taskService.getTaskDetail(Number(req.params.taskId)));
};

// // 수정
// export const update = async (req: Request, res: Response) => {
//   const data = { ...req.body };

//   // 수정 시에도 태그 문자열에서 [ ] 기호들을 제거합니다.
//   if (data.tags && typeof data.tags === 'string' && data.tags.trim() !== '') {
//     data.tags = (data.tags as string)
//       .replace(/[\[\]"]/g, '') // 불필요한 기호 제거
//       .split(',') // 콤마로 분리
//       .map((t: string) => t.trim()) // 앞뒤 공백 제거
//       .filter((t: string) => t !== ''); // 빈 문자열 제외
//   }

//   // 일부 수정(PATCH)이므로 UpdateTask(partial)로 검사
//   assert(data, TaskStruct.UpdateTask)

//   const result = await taskService.updateTaskInfo(Number(req.params.taskId), data, req.user.id);

//   res.json(result);
// };

// 삭제
export const remove = async (req: Request, res: Response) => {
  await taskService.deleteTask(Number(req.params.taskId));

  res.status(204).end();
};

/// 하위 할 일 ///

// 할 일(task) 조회
// export async function createSubTask(req: Request, res: Response, next: NextFunction) {
//   const { taskId } = req.params;
//   const { title } = req.body;
//   const subTaskData = { taskId: Number(taskId), title, status: 'TODO' };
//   assert(subTaskData, CreateSubTask);
//   const newSubTask = await taskService.createSubTask(subTaskData);

//   res.status(201).json(newSubTask);
// }

// 하위 할 일 (subtask) 목록 조회
export async function getSubTasks(req: Request, res: Response, next: NextFunction) {
  const { taskId } = req.params;
  const subTasks = await taskService.getSubTasks(Number(taskId));

  res.status(200).json(subTasks);
}
