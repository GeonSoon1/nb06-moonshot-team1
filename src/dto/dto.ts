import { ProjectMember } from '@prisma/client';

export type CreateMemberDto = Pick<
  ProjectMember,
  'projectId' | 'memberId' | 'invitationId' | 'role'
>;

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'QUIT';
