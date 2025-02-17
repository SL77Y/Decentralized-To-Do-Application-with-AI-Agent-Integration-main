import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ContractService } from '../../contract/service/contract.service';
import { TaskRepository } from '../repository/task.repository';
import { CreateTaskDto, VerifyTaskUpdateDto } from '../dtos/task.dto';
import { generateTaskHash } from 'src/common/utils/hash.util';
import { TaskStatus } from '@prisma/client';
import { BlockchainTask } from '../type';
import { ethers } from 'ethers';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly contractService: ContractService,
    private readonly taskRepository: TaskRepository,
  ) {}

  /**
   * Gets current server timestamp for consistent hash generation
   * @returns Object containing current timestamp
   */
  getServerTimestamp() {
    return { timestamp: Date.now() };
  }

  /**
   * Creates a new task in the database after validating the hash
   * @param userId User ID
   * @param data Task creation data
   * @returns Created task
   * @throws BadRequestException if hash is invalid
   */
  async createTask(userId: string, data: CreateTaskDto) {
    try {
      const isValid = await this.validateTaskHash(data);
      if (!isValid) {
        throw new BadRequestException('Invalid task hash');
      }

      return this.taskRepository.create({
        title: data.title,
        task_hash: data.task_hash,
        user_id: userId,
        priority: data.priority,
        due_date: data.due_date,
      });
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Verifies and updates task status in database based on blockchain state
   * @param userId User ID
   * @param data Task update verification data
   * @returns Updated task
   * @throws NotFoundException if task not found
   * @throws BadRequestException if status mismatch or unauthorized
   */
  async verifyTaskUpdate(userId: string, data: VerifyTaskUpdateDto) {
    try {
      const onChainTask: BlockchainTask = await this.contractService.getTask(
        data.task_hash,
      );
      if (!onChainTask || onChainTask.owner === ethers.ZeroAddress) {
        throw new NotFoundException('Task not found on blockchain');
      }

      if (
        (data.isCompleted !== undefined &&
          onChainTask.isCompleted !== data.isCompleted) ||
        (data.isDeleted !== undefined &&
          onChainTask.isDeleted !== data.isDeleted)
      ) {
        throw new BadRequestException('Task status mismatch with blockchain');
      }

      const task = await this.taskRepository.findByHash(data.task_hash);
      if (!task) {
        throw new NotFoundException('Task not found in database');
      }

      if (task.user_id !== userId) {
        throw new BadRequestException('Not authorized to update this task');
      }

      const updates: any = {};

      if (data.isCompleted) {
        updates.status = TaskStatus.COMPLETED;
        updates.completed_at = new Date(Number(onChainTask.completedAt) * 1000);
      }

      if (data.isDeleted) {
        updates.status = TaskStatus.ARCHIVED;
        updates.deleted_at = new Date();
      }

      return this.taskRepository.updateByHash(data.task_hash, updates);
    } catch (error) {
      this.logger.error(
        `Failed to verify task update: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Gets user tasks with pagination and blockchain state verification
   * @param userId User ID
   * @param status Optional status filter
   * @param page Page number
   * @param limit Items per page
   * @returns Tasks and total count
   */
  async getUserTasks(
    userId: string,
    status?: TaskStatus,
    page = 1,
    limit = 10,
  ) {
    try {
      const skip = (page - 1) * limit;
      const { tasks, total } = await this.taskRepository.findAllByUser(
        userId,
        status,
        skip,
        limit,
      );

      const tasksWithBlockchainState = await Promise.all(
        tasks.map(async (task) => {
          const onChainTask = await this.contractService.getTask(
            task.task_hash,
          );

          // Sync with blockchain state if different
          if (onChainTask.isCompleted && task.status !== TaskStatus.COMPLETED) {
            return this.taskRepository.update(task.id, {
              status: TaskStatus.COMPLETED,
              completed_at: new Date(Number(onChainTask.completedAt) * 1000),
            });
          }

          if (onChainTask.isDeleted && task.status !== TaskStatus.ARCHIVED) {
            return this.taskRepository.update(task.id, {
              status: TaskStatus.ARCHIVED,
              deleted_at: new Date(),
            });
          }

          return task;
        }),
      );

      return {
        tasks: tasksWithBlockchainState,
        total,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get user tasks: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validates task ownership in both database and blockchain
   * @param userId User ID
   * @param taskHash Task hash
   * @returns Task if ownership is valid
   * @throws NotFoundException if task not found
   * @throws BadRequestException if unauthorized
   */
  async verifyUserOwnership(userId: string, taskHash: string) {
    try {
      const task = await this.taskRepository.findByHash(taskHash);
      if (!task) {
        throw new NotFoundException('Task not found in database');
      }

      if (task.user_id !== userId) {
        throw new BadRequestException('Not authorized to access this task');
      }

      const onChainTask = await this.contractService.getTask(taskHash);
      if (!onChainTask || onChainTask.owner === ethers.ZeroAddress) {
        throw new NotFoundException('Task not found on blockchain');
      }

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to verify ownership: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validates the task hash matches the provided data
   * @param dto Task data
   * @returns boolean indicating if hash is valid
   */
  private async validateTaskHash(data: CreateTaskDto): Promise<boolean> {
    const computedHash = generateTaskHash(
      data.title,
      data.user_address,
      data.timestamp,
    );
    return computedHash === data.task_hash;
  }
}
