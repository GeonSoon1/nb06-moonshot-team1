import s from 'superstruct';

export const CreateProject = s.object({
  name: s.string(),
  description: s.size(s.string(), 1, 40),
  ownerId: s.min(s.integer(), 1)
});

export const PatchProject = s.partial(CreateProject);
