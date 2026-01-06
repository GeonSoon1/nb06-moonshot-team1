import * as taskService from '../services/task.service.js';
import * as TaskStruct from '../structs/task.structs.js';
import { CreateSubTask } from '../structs/subtask.struct.js';

/**
 * 생성
 */
export const create = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;

  // 1. 가공할 데이터를 복사
  const data = { ...req.body };

  // 2. [태그 가공] Multipart로 온 문자열 "A,B"를 진짜 배열 ["A", "B"]로 바꿉니다
  if (typeof data.tags === 'string' && data.tags.trim() !== '') {
    data.tags = data.tags
      .replace(/[\[\]"]/g, '') // 정규식으로 [, ], " 기호를 모두 삭제
      .split(',') // 콤마로 분리
      .map((t) => t.trim()) // 앞뒤 공백 제거
      .filter((t) => t !== ''); // 빈 문자열 제외
  } else if (!data.tags) {
    data.tags = [];
  }

  // 3. [검문 실시] 이제 Struct가 "태그가 배열이 맞는지, 3개 이하인지" 검사합니다.
  TaskStruct.CreateTask.assert(data);

  // 4. [파일 처리] multer가 저장한 파일 경로들을 추출합니다.
  const filePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];

  // 5. 서비스 호출

  const result = await taskService.createNewTask(
    Number(projectId),
    userId,
    data, // 검증 완료된 데이터
    filePaths
  );

  res.status(200).json(result);
};

/**
 * 목록 조회
 */
export const getList = async (req, res) => {
  // 1. 주소창의 검색 조건(req.query)을 가져옵니다.
  const queryData = { ...req.query };

  // 2. [검문 실시]
  // page가 숫자인지, order_by가 허용된 단어인지 등을 검사합니다.
  TaskStruct.TaskQuery.assert(queryData);

  // 3. 검증 통과 후 서비스 호출
  const result = await taskService.getTaskList(
    Number(req.params.projectId),
    queryData // 검증된 쿼리 데이터를 전달
  );

  res.json(result);
};

/**
 * 할 일(task) 조회
 */
export const getDetail = async (req, res) => {
  // 1. URL 파라미터(:taskId) 검증
  // 만약 /tasks/abc 라고 들어오면 여기서 바로 에러가 납니다.
  TaskStruct.TaskIdParam.assert(req.params);

  res.json(await taskService.getTaskDetail(Number(req.params.taskId)));
};

/**
 * 수정
 */
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

  // 새롭게 업로드된 파일들 추출
  const newFilePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];

  const result = await taskService.updateTaskInfo(Number(req.params.taskId), data, req.user.id, newFilePaths);

  res.json(result);
};

/**
 * 삭제
 */
export const remove = async (req, res) => {
  await taskService.deleteTask(Number(req.params.taskId));
  res.status(204).end();
};

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
