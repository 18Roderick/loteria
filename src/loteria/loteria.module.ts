import { Module } from '@nestjs/common';
import { LoteriaService } from './loteria.service';
import { LoteriaController } from './loteria.controller';

@Module({
  controllers: [LoteriaController],
  providers: [LoteriaService]
})
export class LoteriaModule {}
