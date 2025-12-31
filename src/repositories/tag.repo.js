export class TagRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  
// 1. 할 일에 태그 연결 (생성 또는 기존 태그 사용)
// Prisma의 connectOrCreate를 사용하여 태그가 없으면 만들고, 있으면 바로 연결 (태그 데이터 파편화 막기 위함)
   
  addTagToTask = async (taskId, tagName) => {
    return await this.prisma.taskTag.create({
      data: {
        taskId: +taskId,
        tag: {
          connectOrCreate: {
            where: { name: tagName },
            create: { name: tagName },
          },
        },
      },
      include: {
        tag: true, // 생성된 후 태그의 상세 정보(id, name)를 함께 반환
      },
    });
  };

// 2. 특정 할 일(Task)에 달린 모든 태그 조회
// 할 일 상세 정보 페이지 등에서 태그 목록을 보여줄 때 사용합니다.

  findAllByTaskId = async (taskId) => {
    return await this.prisma.taskTag.findMany({
      where: { taskId: +taskId },
      include: {
        tag: true, // 연결 테이블 정보뿐만 아니라 실제 태그 이름까지 가져옴
      },
    });
  };

// 3. 할 일에서 특정 태그 연결 제거 (삭제)
// 태그 본체(Tag)는 지우지 않고, 해당 할 일과의 연결만 제거

  removeTagFromTask = async (taskId, tagId) => {
    return await this.prisma.taskTag.delete({
      where: {
        taskId_tagId: {
          taskId: +taskId,
          tagId: +tagId,
        },
      },
    });
  };

// 할 일 상세 조회 시 태그 정보 불러오기 (옵션)

  taskTagInclude = {
    taskTags: {
      include: {
        tag: true,
      },
    },
  };
}