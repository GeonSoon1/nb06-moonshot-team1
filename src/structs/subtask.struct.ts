import s from 'superstruct';

const TaskStatus = s.union([s.literal('TODO'), s.literal('IN_PROGRESS'), s.literal('DONE')]);

export const CreateSubTask = s.object({
  taskId: s.min(s.integer(), 1),
  title: s.string(),
  status: TaskStatus
});

export const PatchSubTask = s.partial(CreateSubTask);
