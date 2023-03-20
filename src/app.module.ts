import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './databases/prisma.module';
import { LoteriaModule } from './loteria/loteria.module';

@Module({
  imports: [PrismaModule, LoteriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
