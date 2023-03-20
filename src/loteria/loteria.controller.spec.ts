import { Test, TestingModule } from '@nestjs/testing';
import { LoteriaController } from './loteria.controller';
import { LoteriaService } from './loteria.service';

describe('LoteriaController', () => {
  let controller: LoteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoteriaController],
      providers: [LoteriaService],
    }).compile();

    controller = module.get<LoteriaController>(LoteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
