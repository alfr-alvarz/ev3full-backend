import { Test, TestingModule } from '@nestjs/testing';
import { VentaDiariaController } from './venta-diaria.controller';
import { VentaDiariaService } from './venta-diaria.service';

const mockVentaDiariaService = {
  generarReporteDiario: jest.fn(),
  registrarVentaDiaria: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('VentaDiariaController', () => {
  let controller: VentaDiariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaDiariaController],
      providers: [{ provide: VentaDiariaService, useValue: mockVentaDiariaService }],
    }).compile();

    controller = module.get<VentaDiariaController>(VentaDiariaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
