import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServices extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    
    const exitHandler = () => app.close()
    
    process.on('exit', exitHandler)
    process.on('beforeExit', exitHandler)
    process.on('SIGINT', exitHandler)
    process.on('SIGTERM', exitHandler)
    process.on('SIGUSR2', exitHandler)
  }
}