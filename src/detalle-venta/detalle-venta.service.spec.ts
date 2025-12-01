import { Test, TestingModule } from '@nestjs/testing';
import { DetalleVentaService } from './detalle-venta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';

describe('DetalleVentaService', () => {
  let service: DetalleVentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetalleVentaService,
        { provide: getRepositoryToken(DetalleVenta), useValue: {} },
      ],
    }).compile();

    service = module.get<DetalleVentaService>(DetalleVentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
