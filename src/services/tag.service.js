export class TagService {
  constructor(tagRepository, projectRepository, taskRepository) {
    this.tagRepository = tagRepository;
    this.projectRepository = projectRepository;
    this.taskRepository = taskRepository;
  }

  // 1. 할 일에 태그 추가 (권한 확인 포함)

  createTag = async (userId, taskId, tagName) => {
    // [인가 단계 1] 해당 Task가 어느 프로젝트에 속해 있는지 조회
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) throw new Error('존재하지 않는 할 일입니다.');

    // [인가 단계 2] 로그인한 유저가 해당 프로젝트의 멤버인지 확인
    const isMember = await this.projectRepository.findProjectMember(task.projectId, userId);
    if (!isMember) {
      throw new Error('해당 프로젝트의 멤버만 태그를 추가할 수 있습니다.');
    }

    // [인가 단계 3] 모든 검증이 끝나면 리포지토리 호출
    return await this.tagRepository.addTagToTask(taskId, tagName);
  };

  // 2. 할 일에서 태그 삭제 (권한 확인 포함)

  deleteTag = async (userId, taskId, tagId) => {
    // [인가] 삭제 시에도 동일하게 프로젝트 멤버인지 확인해야 합니다. 근데 수정 권한은 어디까지 주는거지?
    const task = await this.taskRepository.findTaskById(taskId);
    const isMember = await this.projectRepository.findProjectMember(task.projectId, userId);

    if (!isMember) {
      throw new Error('해당 프로젝트의 멤버만 태그를 삭제할 수 있습니다.');
    }

    // 연결만 삭제하는 리포지토리 메서드 호출
    return await this.tagRepository.removeTagFromTask(taskId, tagId);
  };

  // 3. 특정 할 일의 태그 목록 조회

  getTagsByTaskId = async (taskId) => {
    return await this.tagRepository.findAllByTaskId(taskId);
  };
}
