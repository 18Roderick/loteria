import { Module, Global } from '@nestjs/common';
import { PrismaServices } from './prisma.services';

@Global()
@Module({
  providers: [PrismaServices],
  exports: [PrismaServices],
})
export class PrismaModule {}
