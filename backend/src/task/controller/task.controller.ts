import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import {
  CreateTaskDto,
  FetchTaskListDto,
  VerifyTaskUpdateDto,
} from '../dtos/task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  /**
   * @route GET /tasks/timestamp
   * @desc Get server timestamp for hash generation
   * @access Private
   */
  @Get('timestamp')
  getServerTimestamp() {
    return this.taskService.getServerTimestamp();
  }

  /**
   * @route POST /tasks
   * @desc Create a new task
   * @access Private
   */
  @Post()
  async createTask(@GetUser('id') userId: string, @Body() dto: CreateTaskDto) {
    this.logger.log(`Creating task for user ${userId}`);
    return this.taskService.createTask(userId, dto);
  }

  /**
   * @route POST /tasks/verify-update
   * @desc Verify and update task status
   * @access Private
   */
  @Post('verify-update')
  async verifyTaskUpdate(
    @GetUser('id') userId: string,
    @Body() dto: VerifyTaskUpdateDto,
  ) {
    this.logger.log(`Verifying task update for user ${userId}`);
    return this.taskService.verifyTaskUpdate(userId, dto);
  }

  /**
   * @route GET /tasks/verify-ownership/:taskHash
   * @desc Verify task ownership
   * @access Private
   */
  @Get('verify-ownership/:taskHash')
  async verifyUserOwnership(
    @GetUser('id') userId: string,
    @Param('taskHash') taskHash: string,
  ) {
    this.logger.log(`Verifying ownership for task ${taskHash}`);
    return this.taskService.verifyUserOwnership(userId, taskHash);
  }

  /**
   * @route GET /tasks
   * @desc Get user's tasks with pagination and filters
   * @access Private
   */
  @Get()
  async getUserTasks(
    @GetUser('id') userId: string,
    @Body() data: FetchTaskListDto,
  ) {
    this.logger.log(`Fetching tasks for user ${userId}`);
    return this.taskService.getUserTasks(
      userId,
      data.status,
      data.limit,
      data.page,
    );
  }
}
