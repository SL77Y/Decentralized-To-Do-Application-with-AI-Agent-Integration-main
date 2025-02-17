import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';
import { TaskModule } from './task/task.module';
import { AISuggestionModule } from './ai-suggestion/ai-suggestion.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    AuthModule,
    ContractModule,
    TaskModule,
    AISuggestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
