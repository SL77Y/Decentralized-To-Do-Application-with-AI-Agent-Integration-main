import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  serverHealthCheck(): Promise<void> {
    return Promise.resolve();
  }

  async databaseHealthCheck(): Promise<void> {
    await this.databaseService.$queryRaw`SELECT 1`;
  }

  async healthCheck(): Promise<boolean> {
    await Promise.all([this.serverHealthCheck(), this.databaseHealthCheck()]);
    return true;
  }
}
