export class TagService {
  constructor(tagRepository, projectRepository, taskRepository) {
    this.tagRepository = tagRepository;
    // 테스트를 위해 주석 처리: 아직 정의되지 않은 레포 참조 에러 방지
    // this.projectRepository = projectRepository;
    this.taskRepository = taskRepository;
  }

  // 1. 할 일에 태그 추가 (권한 확인 포함)

  createTag = async (userId, taskId, tagName) => {
    // [인가 단계 1] 해당 Task가 존재하는지, 담당자가 누구인지 조회
    // 테스트를 위해 잠시 주석: taskRepository.findTaskById가 준비될 때까지
    /*
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) throw new Error('존재하지 않는 할 일입니다.');

    // [인가 단계 2] 할 일을 담당한 유저(작성자)와 현재 로그인한 유저가 일치하는지 확인
    // 변수명은 추후 조정
    if (task.userId !== userId) {
      throw new Error('할 일의 담당자만 태그를 추가할 수 있습니다.');
    }
    */

    // [인가 단계 3] 모든 검증이 끝나면 레포 호출
    return await this.tagRepository.addTagToTask(taskId, tagName);
  };

  // 2. 할 일에서 태그 삭제 (권한 확인 포함)

  deleteTag = async (userId, taskId, tagId) => {
    // [인가] 삭제 시에도 동일하게 '담당자 본인'인지 확인해야함.
    // 테스트를 위해 잠시 주석
    /*
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) throw new Error('존재하지 않는 할 일입니다.');  

    if (task.userId !== userId) {
      throw new Error('할 일의 담당자만 태그를 삭제할 수 있습니다.');
    }
    */

    // 연결만 삭제하는 리포지토리 메서드 호출
    return await this.tagRepository.removeTagFromTask(taskId, tagId);
  };

  // 3. 특정 할 일의 태그 목록 조회

  getTagsByTaskId = async (taskId) => {
    return await this.tagRepository.findAllByTaskId(taskId);
  };
}
