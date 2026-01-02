export class TagService {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  // 생성
  createTag = async (userId, taskId, tagName) => {
    return await this.tagRepository.addTagToTask(taskId, tagName);
  };

  // 삭제
  deleteTag = async (userId, taskId, tagId) => {
    return await this.tagRepository.removeTagFromTask(taskId, tagId);
  };

  // 조회
  getTagsByTaskId = async (taskId) => {
    return await this.tagRepository.findAllByTaskId(taskId);
  };
}
