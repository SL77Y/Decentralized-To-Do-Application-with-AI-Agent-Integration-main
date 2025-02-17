import { TaskStatus } from "@/types/task";
import api from "./api.service";

export const taskService = {
  getTasks: async (params?: {
    status?: TaskStatus;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get("/tasks", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyUpdate: async (
    taskHash: string,
    data: { isCompleted?: boolean; isDeleted?: boolean }
  ) => {
    try {
      const response = await api.post("/tasks/verify-update", {
        task_hash: taskHash,
        ...data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTimestamp: async () => {
    const response = await api.get("/tasks/timestamp");
    return response.data;
  },

  createTask: async (data: {
    title: string;
    priority: number;
    due_date?: Date;
    task_hash: string;
    user_address: string;
    timestamp: number;
  }) => {
    try {
      const response = await api.post("/tasks", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
