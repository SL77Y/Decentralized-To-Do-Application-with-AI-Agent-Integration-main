import { Module } from '@nestjs/common';
import { TaskService } from './service/task.service';
import { TaskController } from './controller/task.controller';
import { TaskRepository } from './repository/task.repository';
import { ContractModule } from '../contract/contract.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ContractModule, DatabaseModule],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
})
export class TaskModule {}
