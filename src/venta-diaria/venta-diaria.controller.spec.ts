import { Test, TestingModule } from '@nestjs/testing';
import { VentaDiariaController } from './venta-diaria.controller';
import { VentaDiariaService } from './venta-diaria.service';

describe('VentaDiariaController', () => {
  let controller: VentaDiariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaDiariaController],
      providers: [VentaDiariaService],
    }).compile();

    controller = module.get<VentaDiariaController>(VentaDiariaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
