import { IsString } from 'class-validator';

export class HealthCheckResponseDTO {
  @IsString()
  message: string;
}
