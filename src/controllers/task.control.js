import * as taskService from '../services/task.service2.js';
import * as TaskStruct from '../structs/task.structs.js';
import { CreateSubTask } from '../structs/subtask.struct.js';
import { assert } from 'superstruct';

// 생성
export const create = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const data = { ...req.body };

  if (typeof data.tags === 'string' && data.tags.trim() !== '') {
    data.tags = data.tags
      .replace(/[\[\]"]/g, '') // 정규식으로 [, ], " 기호를 모두 삭제
      .split(',') // 콤마로 분리
      .map((t) => t.trim()) // 앞뒤 공백 제거
      .filter((t) => t !== ''); // 빈 문자열 제외
  } else if (!data.tags) {
    data.tags = [];
  }

  TaskStruct.CreateTask.assert(data);

  const result = await taskService.createNewTask(
    Number(projectId),
    userId,
    data, // 검증 완료된 데이터
  );

  res.status(200).json(result);
};


// 목록 조회
export const getList = async (req, res) => {
  const queryData = { ...req.query };  
  
  TaskStruct.TaskQuery.assert(queryData);

  const result = await taskService.getTaskList(
    Number(req.params.projectId),
    queryData // 검증된 쿼리 데이터를 전달
  );

  res.json(result);
};

// 할 일 조회
export const getDetail = async (req, res) => {
  TaskStruct.TaskIdParam.assert(req.params);

  res.json(await taskService.getTaskDetail(Number(req.params.taskId)));
};

// 할 일 수정
export const update = async (req, res) => {
  const data = { ...req.body };

  // 수정 시에도 태그 문자열에서 [ ] " 기호들을 제거합니다.
  if (data.tags && typeof data.tags === 'string' && data.tags.trim() !== '') {
    data.tags = data.tags
      .replace(/[\[\]"]/g, '') // 불필요한 기호 제거
      .split(',') // 콤마로 분리
      .map((t) => t.trim()) // 앞뒤 공백 제거
      .filter((t) => t !== ''); // 빈 문자열 제외
  }

  // 일부 수정(PATCH)이므로 UpdateTask(partial)로 검사
  TaskStruct.UpdateTask.assert(data);

  const result = await taskService.updateTaskInfo(Number(req.params.taskId), data, req.user.id);

  res.json(result);
};


// 할 일 삭제
export const remove = async (req, res) => {
  await taskService.deleteTask(Number(req.params.taskId));
  res.status(204).end();
};


/// 하위 할 일 ///

// 할 일(task) 조회
export async function createSubTask(req, res, next) {
  const { taskId } = req.params;
  const { title } = req.body;
  const subTaskData = { taskId: Number(taskId), title, status: 'TODO' };
  assert(subTaskData, CreateSubTask);
  const newSubTask = await taskService.createSubTask(subTaskData);

  res.status(201).json(newSubTask);
}

// 하위 할 일 (subtask) 목록 조회
export async function getSubTasks(req, res, next) {
  const { taskId } = req.params;
  const subTasks = await taskService.getSubTasks(Number(taskId));

  res.status(200).json(subTasks);
}
