import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  task_hash: string;

  @IsString()
  user_address: string;

  @IsNumber()
  timestamp: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsDate()
  due_date?: Date;
}

export class VerifyTaskDto {
  @IsString()
  task_hash: string;
}

export class VerifyTaskUpdateDto {
  @IsString()
  task_hash: string;

  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsDate()
  due_date?: Date;
}

export class FetchTaskListDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
