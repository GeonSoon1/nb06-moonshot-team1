import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ✅ 전제: userId=2가 이미 DB에 존재해야 함
  const u2 = await prisma.user.findUnique({ where: { id: 2 } });
  if (!u2) {
    throw new Error('userId=2 유저가 DB에 없습니다. 먼저 user 2번을 만들어주세요.');
  }

  // ✅ 더미 유저들
  const u3 = await prisma.user.upsert({
    where: { email: 'mock3@example.com' },
    update: { name: 'mock3' },
    create: { email: 'mock3@example.com', name: 'mock3', passwordHashed: 'hashed' }
  });
  const u4 = await prisma.user.upsert({
    where: { email: 'mock4@example.com' },
    update: { name: 'mock4' },
    create: { email: 'mock4@example.com', name: 'mock4', passwordHashed: 'hashed' }
  });
  const u5 = await prisma.user.upsert({
    where: { email: 'mock5@example.com' },
    update: { name: 'mock5' },
    create: { email: 'mock5@example.com', name: 'mock5', passwordHashed: 'hashed' }
  });

  // ✅ (추천) seed 재실행 시 중복 방지: MOCK_ 프로젝트 전부 삭제
  await prisma.project.deleteMany({ where: { name: { startsWith: 'MOCK_' } } });

  // -------------------------
  // 프로젝트 생성
  // -------------------------
  const p1 = await prisma.project.create({
    data: { name: 'MOCK_캘린더 연동 프로젝트', description: '구글 캘린더 연동 실험', ownerId: 2 }
  });
  const p2 = await prisma.project.create({
    data: { name: 'MOCK_디자인 시스템', description: '컴포넌트/가이드 정리', ownerId: 2 }
  });
  const p3 = await prisma.project.create({
    data: { name: 'MOCK_타사 협업', description: '외부 파트너 협업', ownerId: u5.id }
  });
  const p4 = await prisma.project.create({
    data: { name: 'MOCK_이벤트 운영', description: '프로모션/이벤트 운영', ownerId: u3.id }
  });

  // -------------------------
  // 멤버 생성
  // -------------------------
  await prisma.projectMember.createMany({
    data: [
      // p1
      { projectId: p1.id, memberId: 2, role: 'OWNER' },
      { projectId: p1.id, memberId: u3.id, role: 'MEMBER' },
      { projectId: p1.id, memberId: u4.id, role: 'MEMBER' },

      // p2
      { projectId: p2.id, memberId: 2, role: 'OWNER' },
      { projectId: p2.id, memberId: u4.id, role: 'MEMBER' },

      // p3
      { projectId: p3.id, memberId: u5.id, role: 'OWNER' },
      { projectId: p3.id, memberId: 2, role: 'MEMBER' },
      { projectId: p3.id, memberId: u3.id, role: 'MEMBER' },

      // p4
      { projectId: p4.id, memberId: u3.id, role: 'OWNER' },
      { projectId: p4.id, memberId: 2, role: 'MEMBER' }
    ],
    skipDuplicates: true
  });

  // -------------------------
  // 태스크 생성 (날짜/상태/키워드 분산)
  // -------------------------
  const now = new Date();
  const plus3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const plus7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const minus10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const minus3 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      // p1
      {
        title: 'p1 - 캘린더 TODO 1',
        description: 'calendar keyword',
        status: 'TODO',
        startDate: now,
        endDate: plus7,
        projectId: p1.id,
        taskCreatorId: 2,
        assigneeProjectMemberId: u3.id
      },
      {
        title: 'p1 - 캘린더 TODO 2',
        description: 'calendar keyword',
        status: 'TODO',
        startDate: now,
        endDate: plus7,
        projectId: p1.id,
        taskCreatorId: 2,
        assigneeProjectMemberId: u4.id
      },
      {
        title: 'p1 - 캘린더 진행중',
        description: 'calendar keyword',
        status: 'IN_PROGRESS',
        startDate: now,
        endDate: plus3,
        projectId: p1.id,
        taskCreatorId: u3.id,
        assigneeProjectMemberId: u3.id
      },
      {
        title: 'p1 - 캘린더 완료',
        description: 'calendar keyword',
        status: 'DONE',
        startDate: minus3,
        endDate: now,
        projectId: p1.id,
        taskCreatorId: u4.id,
        assigneeProjectMemberId: u4.id
      },

      // p2
      {
        title: 'p2 - 디자인 TODO',
        status: 'TODO',
        startDate: now,
        endDate: plus7,
        projectId: p2.id,
        taskCreatorId: 2,
        assigneeProjectMemberId: u4.id
      },
      {
        title: 'p2 - 디자인 완료 1',
        status: 'DONE',
        startDate: minus10,
        endDate: minus3,
        projectId: p2.id,
        taskCreatorId: u4.id,
        assigneeProjectMemberId: 2
      },
      {
        title: 'p2 - 디자인 완료 2',
        status: 'DONE',
        startDate: minus3,
        endDate: now,
        projectId: p2.id,
        taskCreatorId: 2,
        assigneeProjectMemberId: 2
      },

      // p3
      {
        title: 'p3 - 협업 진행중 1',
        status: 'IN_PROGRESS',
        startDate: now,
        endDate: plus7,
        projectId: p3.id,
        taskCreatorId: u5.id,
        assigneeProjectMemberId: 2
      },
      {
        title: 'p3 - 협업 진행중 2',
        status: 'IN_PROGRESS',
        startDate: now,
        endDate: plus3,
        projectId: p3.id,
        taskCreatorId: 2,
        assigneeProjectMemberId: u3.id
      },

      // p4
      {
        title: 'p4 - 이벤트 TODO',
        status: 'TODO',
        startDate: now,
        endDate: plus7,
        projectId: p4.id,
        taskCreatorId: u3.id,
        assigneeProjectMemberId: 2
      },
      {
        title: 'p4 - 이벤트 완료',
        status: 'DONE',
        startDate: minus10,
        endDate: minus3,
        projectId: p4.id,
        taskCreatorId: u3.id,
        assigneeProjectMemberId: 2
      }
    ]
  });

  // -------------------------
  // 태그 생성 (upsert)
  // -------------------------
  const tagCalendar = await prisma.tag.upsert({
    where: { name: 'calendar' },
    update: {},
    create: { name: 'calendar' }
  });
  const tagDesign = await prisma.tag.upsert({
    where: { name: 'design' },
    update: {},
    create: { name: 'design' }
  });
  const tagUrgent = await prisma.tag.upsert({
    where: { name: 'urgent' },
    update: {},
    create: { name: 'urgent' }
  });
  const tagPartner = await prisma.tag.upsert({
    where: { name: 'partner' },
    update: {},
    create: { name: 'partner' }
  });

  // -------------------------
  // 방금 만든 task id들 다시 조회 (createMany는 ids를 안 줌)
  // -------------------------
  const tasks = await prisma.task.findMany({
    where: { projectId: { in: [p1.id, p2.id, p3.id, p4.id] } },
    select: { id: true, title: true, projectId: true }
  });

  const byTitle = new Map(tasks.map((t) => [t.title, t.id]));

  // -------------------------
  // TaskTag(태그 연결) + Attachment(첨부파일) 생성
  // -------------------------
  const taskTagsData = [
    // p1 캘린더
    { taskId: byTitle.get('p1 - 캘린더 TODO 1'), tagId: tagCalendar.id },
    { taskId: byTitle.get('p1 - 캘린더 TODO 1'), tagId: tagUrgent.id },
    { taskId: byTitle.get('p1 - 캘린더 진행중'), tagId: tagCalendar.id },
    { taskId: byTitle.get('p1 - 캘린더 완료'), tagId: tagCalendar.id },

    // p2 디자인
    { taskId: byTitle.get('p2 - 디자인 TODO'), tagId: tagDesign.id },
    { taskId: byTitle.get('p2 - 디자인 완료 1'), tagId: tagDesign.id },
    { taskId: byTitle.get('p2 - 디자인 완료 2'), tagId: tagDesign.id },
    { taskId: byTitle.get('p2 - 디자인 완료 2'), tagId: tagUrgent.id },

    // p3 협업
    { taskId: byTitle.get('p3 - 협업 진행중 1'), tagId: tagPartner.id },
    { taskId: byTitle.get('p3 - 협업 진행중 2'), tagId: tagPartner.id }
  ].filter((x) => x.taskId); // 혹시 title 못 찾았을 때 방어

  await prisma.taskTag.createMany({
    data: taskTagsData,
    skipDuplicates: true
  });

  const attachmentsData = [
    {
      taskId: byTitle.get('p1 - 캘린더 TODO 1'),
      url: 'https://example.com/mock/calendar-spec.pdf'
    },
    { taskId: byTitle.get('p1 - 캘린더 진행중'), url: 'https://example.com/mock/oauth-flow.png' },

    { taskId: byTitle.get('p2 - 디자인 TODO'), url: 'https://example.com/mock/ui-guide.fig' },
    {
      taskId: byTitle.get('p2 - 디자인 완료 2'),
      url: 'https://example.com/mock/component-list.xlsx'
    },

    {
      taskId: byTitle.get('p3 - 협업 진행중 1'),
      url: 'https://example.com/mock/partner-brief.docx'
    },

    { taskId: byTitle.get('p4 - 이벤트 TODO'), url: 'https://example.com/mock/event-plan.pdf' }
  ].filter((x) => x.taskId);

  await prisma.attachment.createMany({
    data: attachmentsData,
    skipDuplicates: true
  });

  console.log('✅ “참여중인 모든 프로젝트 할 일 목록” 테스트용 MOCK 데이터 생성 완료');
  console.log('userId=2 참여 프로젝트:', [p1.id, p2.id, p3.id, p4.id]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
