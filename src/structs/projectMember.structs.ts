import s from 'superstruct';
import isUUID from 'is-uuid';

const UUID = s.refine(s.string(), 'uuid', (value) => isUUID.anyNonNil(value));

const MemberRole = s.union([s.literal('OWNER'), s.literal('MEMBER')]);

export const CreateProjectMember = s.object({
  projectId: s.min(s.integer(), 1),
  memberId: s.min(s.integer(), 1),
  invitationId: s.optional(UUID),
  role: MemberRole
});
