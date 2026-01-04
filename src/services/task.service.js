import * as taskRepo from "../repositories/task.repo.js";
import { formatTask } from "../lib/util.js";
import { NotFoundError, BadRequestError, ForbiddenError } from "../middlewares/errors/customError.js";

export const createNewTask = async (projectId, userId, body, filePaths) => {
  
  // 데이터 형식이 숫자가 아니면 400 에러
  if (isNaN(body.startYear)) throw new BadRequestError('잘못된 요청 형식');

  const data = {
    title: body.title,
    description: body.description,
    status: body.status?.toUpperCase() || "TODO",

    // 프론트엔드에서 받은 날짜 데이터를 데이터베이스가 이해할 수 있는 표준 Date 객체로 변환하여 저장
    startDate: new Date(body.startYear, body.startMonth - 1, body.startDay),
    endDate: new Date(body.endYear, body.endMonth - 1, body.endDay),
    projectId,
    taskCreatorId: userId,
    assigneeProjectMemberId: userId,
    taskTags: { 
      create: body.tags?.map(name => ({ tag: { 
        connectOrCreate: { where: { name }, 
        create: { name } 
      } } 
    })) 
  },
    attachments: { create: filePaths.map(url => ({ url })) }
  };
  
  return formatTask(await taskRepo.createTask(data));
};


export const getTaskList = async (projectId, query) => {
  const { page = 1, limit = 10, status, assignee, keyword, order = 'desc', order_by = 'created_at' } = query;
  const where = {
    projectId,
    ...(status && { status: status.toUpperCase() }),
    ...(assignee && { assigneeProjectMemberId: Number(assignee) }),
    ...(keyword && { title: { contains: keyword, mode: 'insensitive' } }),
  };
  const orderBy = { created_at: { createdAt: order }, name: { title: order }, end_date: { endDate: order } }[order_by] || { createdAt: 'desc' };

  const [tasks, total] = await Promise.all([
    taskRepo.findMany(where, (Number(page) - 1) * Number(limit), Number(limit), orderBy),
    taskRepo.count(where)
  ]);
  return { data: tasks.map(t => formatTask(t)), total };
};


export const getTaskDetail = async (id) => {
  const task = await taskRepo.findById(id);
  if (!task) throw new NotFoundError();
  return formatTask(task);
};


export const updateTaskInfo = async (id, body, userId, newFilePaths) => {
  // 1. 먼저 기존 할 일을 조회해서 어떤 프로젝트에 속해 있는지 알아내기
  const task = await taskRepo.findById(id);
  if (!task) {
    throw new NotFoundError();
  }
  
  // userId를 사용하여 "수정하려는 나"가 멤버인지 서비스에서도 한 번 더 확인!
  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) {
    throw new ForbiddenError("프로젝트 멤버가 아닙니다");
  }

  // 2. 담당자를 바꾸려고 할때(assigneeId가 있을 때)만 검사 실행
  // 이 프로젝트id를 가지고 assigneeId가 projectMember인지 알아보기
  if (body.assigneeId) {
    const targetAssigneeId = Number(body.assigneeId)
    
    // repo에서 데이터를 가져온다.(찾으면 객체, 못 찾으면 null)
    const member = await taskRepo.findProjectMember(task.projectId, targetAssigneeId)

    if (!member) {
      // console.log('담당자 후보가 프로젝트 멤버가 아닙니다.')
      throw new ForbiddenError("프로젝트 멤버가 아닙니다");
    }
  }

  const updateData = {};
  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status) updateData.status = body.status.toUpperCase();
  if (body.startYear) updateData.startDate = new Date(body.startYear, body.startMonth - 1, body.startDay);
  if (body.endYear) updateData.endDate = new Date(body.endYear, body.endMonth - 1, body.endDay);
  if (body.assigneeId) updateData.assigneeProjectMemberId = Number(body.assigneeId);

  const updated = await taskRepo.updateWithTransaction(id, updateData, body.tags, newFilePaths);
  return formatTask(updated);
};

export const deleteTask = async (id) => await taskRepo.remove(id);