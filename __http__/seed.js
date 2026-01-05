import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("데이터 생성 시작...");

  // 1. 유저 생성
  const user = await prisma.user.create({
    data: {
      email: `test${Date.now()}@test.com`, // 중복 방지
      name: "테스트유저",
    },
  });

  // 2. 프로젝트 생성 (name과 description 필수)
  const project = await prisma.project.create({
    data: {
      name: "테스트 프로젝트",
      description: "프로젝트 설명입니다.", // 필수 필드 추가
      ownerId: user.id,
    },
  });

  // 3. 프로젝트 멤버 등록 (role 필수, Enum 값 사용)
  const member = await prisma.projectMember.create({
    data: {
      projectId: project.id,
      memberId: user.id,
      role: "OWNER", // MemberRole enum 값
    },
  });

  // 4. 할 일(Task) 생성 (날짜 및 작성자/담당자 관계 필수)
  // 스키마상 creator와 assignee는 ProjectMember와 연결되어야 합니다.
  const task = await prisma.task.create({
    data: {
      title: "첫 번째 할 일",
      description: "상세 내용입니다.",
      status: "TODO",
      startDate: new Date(), // 필수 필드 추가
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7일 뒤
      projectId: project.id,
      taskCreatorId: member.memberId, // ProjectMember의 ID
      assigneeProjectMemberId: member.memberId, // 담당자도 자신으로 설정
    },
  });

  console.log("------------------------------------------");
  console.log(`✅ 데이터 생성 완료!`);
  console.log(`유저 ID: ${user.id}`);
  console.log(`프로젝트 ID: ${project.id}`);
  console.log(`테스트할 Task ID: ${task.id}`);
  console.log("------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
