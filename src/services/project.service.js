import { TaskStatus } from '@prisma/client';
import projectRepo from '../repositories/project.repo.js';

async function getList() {
  const projectList = await projectRepo.getList();
  const projectListWithCounts = projectList.map((p) => {
    const { id, name, description, projectMembers = [], tasks = [], ...rest } = p;

    const memberCount = projectMembers.length - 1 ?? 0; // owner 제외
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
  });
  return projectListWithCounts;
}

export default {
  getList
};
