import * as s from 'superstruct';

export const CreateComment = s.object({
  content: s.size(s.string(), 2, 100)
});

export const UpdateComment = s.partial(CreateComment);
