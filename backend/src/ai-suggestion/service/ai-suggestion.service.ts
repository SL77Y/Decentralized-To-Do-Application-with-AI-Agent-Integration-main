import { Injectable, Logger } from '@nestjs/common';
import { Task, TaskStatus, User } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class AISuggestionService {
  private readonly logger = new Logger(AISuggestionService.name);
  private readonly hfApiUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-large';

  async suggestPriorities(tasks: Task[]) {
    tasks = tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
    try {
      const prompt = `Analyze and prioritize these tasks from 0 to 5 based on their deadlines and importance:
        ${tasks
          .map(
            (task) =>
              `- Title: ${task.title}
           Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
           Current Priority: ${task.priority}`,
          )
          .join('\n')}
        Suggest priority levels with reasoning for each task.`;

      const response = await axios.post(
        this.hfApiUrl,
        { inputs: prompt, parameters: { max_new_tokens: 100 } },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.[0]?.generated_text || 'No response from AI.';
    } catch (error) {
      this.logger.error('Error suggesting priorities:', error.response?.data || error.message);
      throw new Error('AI service is temporarily unavailable.');
    }
  }

  async getProductivityTip(completedTasks: number, totalTasks: number) {
    try {
      const prompt = `Give a motivational tip for someone who has completed ${completedTasks} out of ${totalTasks} tasks.`;
      
      const response = await axios.post(
        this.hfApiUrl,
        { inputs: prompt, parameters: { max_new_tokens: 50 } },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.[0]?.generated_text || 'No AI response.';
    } catch (error) {
      this.logger.error('Error generating productivity tip:', error.response?.data || error.message);
      throw new Error('AI service is temporarily unavailable.');
    }
  }

  async generateReminders(tasks: Task[], user: User) {
    const overdueTasks = tasks.filter(
      (task) =>
        task.due_date &&
        new Date(task.due_date) < new Date() &&
        task.status !== 'COMPLETED',
    );

    if (overdueTasks.length === 0) return null;

    try {
      const prompt = `Create reminders for the following overdue tasks for user ${user.first_name} ${user.last_name}:
        ${overdueTasks.map((task) => `- ${task.title} (Due: ${new Date(task.due_date!).toLocaleDateString()})`).join('\n')}
        Each reminder should be friendly, motivational, and specific.`;

      const response = await axios.post(
        this.hfApiUrl,
        { inputs: prompt, parameters: { max_new_tokens: 100 } },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.[0]?.generated_text || 'No AI response.';
    } catch (error) {
      this.logger.error('Error generating reminders:', error.response?.data || error.message);
      throw new Error('AI service is temporarily unavailable.');
    }
  }
}
