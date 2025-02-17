import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponseDTO } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check of the server.
   * @returns {Promise<HealthCheckResponseDTO>}
   */
  @Get(['/health'])
  async healthCheck(): Promise<HealthCheckResponseDTO> {
    await this.appService.healthCheck();
    return {
      message: 'Application is healthy.',
    };
  }
}
