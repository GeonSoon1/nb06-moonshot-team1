import * as s from 'superstruct';

export const CreateComment = s.object({
  content: s.size(s.string(), 2, 100), // 100자 이내로 지정됨?
  taskId: s.min(s.integer(), 1),
  projectId: s.min(s.integer(), 1),
  authorId: s.min(s.integer(), 1)
});

export const UpdateComment = s.partial(CreateComment);
