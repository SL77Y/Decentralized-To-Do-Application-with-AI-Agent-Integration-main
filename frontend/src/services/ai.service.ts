import { Task } from "../types/task";
import api from "./api.service";

export const aiService = {
  suggestPriorities: async (tasks: Task[]) => {
    const response = await api.post("/suggestion/suggest-priorities", {
      tasks,
    });
    return response.data;
  },

  getProductivityTip: async (completedTasks: number, totalTasks: number) => {
    const response = await api.get("/suggestion/productivity-tip", {
      params: { completedTasks, totalTasks },
    });
    return response.data;
  },

  generateReminders: async (tasks: Task[]) => {
    const response = await api.post("/suggestion/generate-reminders", {
      tasks,
    });
    return response.data;
  },
};
