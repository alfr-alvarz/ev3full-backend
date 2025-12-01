import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';

describe('DetalleVentaService', () => {
  let service: DetalleVentaService;
  let repoMock: any;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    repoMock = { ...mockRepo };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetalleVentaService,
        { provide: getRepositoryToken(DetalleVenta), useValue: repoMock },
      ],
    }).compile();

    service = module.get<DetalleVentaService>(DetalleVentaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todos los detalles ordenados', async () => {
      const datos = [{ id: 1 }, { id: 2 }];
      repoMock.find.mockResolvedValue(datos);

      const res = await service.findAll();

      expect(res).toBe(datos);
      expect(repoMock.find).toHaveBeenCalledWith({ relations: { venta: true, producto: true }, order: { id: 'DESC' } });
    });

    it('debería propagar error si falla la consulta', async () => {
      repoMock.find.mockRejectedValue(new Error('DB error'));
      await expect(service.findAll()).rejects.toThrow('DB error');
    });
  });

  describe('findOne', () => {
    it('debería retornar un detalle por id', async () => {
      const detalle = { id: 5 };
      repoMock.findOne.mockResolvedValue(detalle);

      const res = await service.findOne(5);
      expect(res).toBe(detalle);
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 5 }, relations: { venta: true, producto: true } });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow('El detalle de venta #99 no existe');
    });

    it('debería propagar error si ocurre un fallo', async () => {
      repoMock.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.findOne(1)).rejects.toThrow('DB error');
    });
  });

  describe('findByProducto', () => {
    it('debería retornar los detalles del producto dado', async () => {
      const resultados = [{ id: 10 }, { id: 11 }];
      repoMock.find.mockResolvedValue(resultados);

      const res = await service.findByProducto(7);

      expect(res).toBe(resultados);
      expect(repoMock.find).toHaveBeenCalledWith({ where: { producto: { id: 7 } }, relations: { venta: true }, order: { id: 'DESC' } });
    });

    it('debería propagar error si falla la consulta', async () => {
      repoMock.find.mockRejectedValue(new Error('DB error'));
      await expect(service.findByProducto(7)).rejects.toThrow('DB error');
    });
  });
});
