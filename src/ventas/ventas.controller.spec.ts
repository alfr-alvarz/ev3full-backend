import { Test, TestingModule } from '@nestjs/testing';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';

const mockVentasService = {
  crearVenta: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findVentasByUsuario: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('VentasController', () => {
  let controller: VentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentasController],
      providers: [{ provide: VentasService, useValue: mockVentasService }],
    }).compile();

    controller = module.get<VentasController>(VentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
