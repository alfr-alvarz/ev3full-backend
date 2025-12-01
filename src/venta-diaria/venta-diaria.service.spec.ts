import { Test, TestingModule } from '@nestjs/testing';
import { VentaDiariaService } from './venta-diaria.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VentaDiaria } from './entities/venta-diaria.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-venta/entities/detalle-venta.entity';

describe('VentaDiariaService', () => {
  let service: VentaDiariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentaDiariaService,
        { provide: getRepositoryToken(VentaDiaria), useValue: {} },
        { provide: getRepositoryToken(Venta), useValue: {} },
        { provide: getRepositoryToken(DetalleVenta), useValue: {} },
      ],
    }).compile();

    service = module.get<VentaDiariaService>(VentaDiariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
