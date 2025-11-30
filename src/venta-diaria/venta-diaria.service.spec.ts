import { Test, TestingModule } from '@nestjs/testing';
import { VentaDiariaService } from './venta-diaria.service';

describe('VentaDiariaService', () => {
  let service: VentaDiariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentaDiariaService],
    }).compile();

    service = module.get<VentaDiariaService>(VentaDiariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
