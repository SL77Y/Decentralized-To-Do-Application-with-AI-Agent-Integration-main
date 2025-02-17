export interface BlockchainTask {
  id: string;
  owner: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: number;
  completedAt: number;
}
