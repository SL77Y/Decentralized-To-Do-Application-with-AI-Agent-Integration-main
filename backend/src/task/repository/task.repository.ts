import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Task, TaskStatus, Prisma } from '@prisma/client';

@Injectable()
export class TaskRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Creates a new task in the database
   * @param data Task creation data
   * @returns Created task
   */
  async create(data: {
    title: string;
    task_hash: string;
    user_id: string;
    priority?: number;
    due_date?: Date;
  }): Promise<Task> {
    return this.db.task.create({
      data: {
        ...data,
        status: TaskStatus.IN_PROGRESS,
      },
    });
  }

  /**
   * Finds a task by its ID
   * @param id Task ID
   * @returns Task if found, null otherwise
   */
  async findById(id: string): Promise<Task | null> {
    return this.db.task.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a task by its blockchain hash
   * @param taskHash Task hash from blockchain
   * @returns Task if found, null otherwise
   */
  async findByHash(taskHash: string): Promise<Task | null> {
    return this.db.task.findUnique({
      where: { task_hash: taskHash },
    });
  }

  /**
   * Updates a task by its ID
   * @param id Task ID
   * @param data Update data
   * @returns Updated task
   */
  async update(
    id: string,
    data: {
      status?: TaskStatus;
      completed_at?: Date;
      deleted_at?: Date;
      priority?: number;
      due_date?: Date;
    },
  ): Promise<Task> {
    return this.db.task.update({
      where: { id },
      data,
    });
  }

  /**
   * Updates a task by its blockchain hash
   * @param taskHash Task hash from blockchain
   * @param data Update data
   * @returns Updated task
   */
  async updateByHash(
    taskHash: string,
    data: {
      status?: TaskStatus;
      completed_at?: Date;
      deleted_at?: Date;
    },
  ): Promise<Task> {
    return this.db.task.update({
      where: { task_hash: taskHash },
      data,
    });
  }

  /**
   * Finds all tasks for a user with pagination
   * @param userId User ID
   * @param status Optional status filter
   * @param skip Pagination offset
   * @param take Pagination limit
   * @returns Tasks and total count
   */
  async findAllByUser(
    userId: string,
    status?: TaskStatus,
    skip = 0,
    take = 10,
  ): Promise<{ tasks: Task[]; total: number }> {
    const where: Prisma.TaskWhereInput = {
      user_id: userId,
      deleted_at: null,
      ...(status && { status }),
    };

    const [tasks, total] = await Promise.all([
      this.db.task.findMany({
        where,
        skip,
        take,
        orderBy: [
          { priority: 'desc' },
          { due_date: 'asc' },
          { created_at: 'desc' },
        ],
      }),
      this.db.task.count({ where }),
    ]);

    return { tasks, total };
  }
}
