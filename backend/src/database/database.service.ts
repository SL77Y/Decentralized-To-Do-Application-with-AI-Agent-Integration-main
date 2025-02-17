import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
