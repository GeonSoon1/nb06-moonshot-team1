import { Project, ProjectMember } from '@prisma/client';

export type CreateMemberDto = Pick<
  ProjectMember,
  'projectId' | 'memberId' | 'invitationId' | 'role'
>;

export type CreateProjectDto = Pick<Project, 'name' | 'description' | 'ownerId'>;

export type UpdateProjectDto = Pick<Project, 'name' | 'description'>;
