import { Test, TestingModule } from '@nestjs/testing';
import { LoteriaService } from './loteria.service';

describe('LoteriaService', () => {
  let service: LoteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoteriaService],
    }).compile();

    service = module.get<LoteriaService>(LoteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
