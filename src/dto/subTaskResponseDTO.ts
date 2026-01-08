// 하위 할 일 응답 데이터 타입
export interface FormattedSubTask {
  id: number;
  taskId: number;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}