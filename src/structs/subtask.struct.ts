import { TaskStatus } from '@prisma/client';
import s from 'superstruct';

const enumTaskStatus = s.union([s.literal(TaskStatus.TODO), s.literal(TaskStatus.IN_PROGRESS), s.literal(TaskStatus.DONE)]);

export const CreateSubTask = s.object({
  taskId: s.min(s.integer(), 1),
  title: s.string(),
  status: enumTaskStatus
});

export const PatchSubTask = s.partial(CreateSubTask);
