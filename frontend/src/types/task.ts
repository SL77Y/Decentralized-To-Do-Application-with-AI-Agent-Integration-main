export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: number;
  task_hash: string;
  due_date?: Date;
  completed_at?: Date;
}

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}
