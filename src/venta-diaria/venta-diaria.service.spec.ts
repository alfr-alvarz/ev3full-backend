import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VentaDiariaService } from './venta-diaria.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VentaDiaria } from './entities/venta-diaria.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-venta/entities/detalle-venta.entity';

describe('VentaDiariaService', () => {
  let service: VentaDiariaService;
  let ventaDiariaRepo: any;
  let ventaRepo: any;
  let detalleVentaRepo: any;

  beforeEach(async () => {
    ventaDiariaRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };
    ventaRepo = {
      createQueryBuilder: jest.fn(),
    };
    detalleVentaRepo = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentaDiariaService,
        { provide: getRepositoryToken(VentaDiaria), useValue: ventaDiariaRepo },
        { provide: getRepositoryToken(Venta), useValue: ventaRepo },
        { provide: getRepositoryToken(DetalleVenta), useValue: detalleVentaRepo },
      ],
    }).compile();

    service = module.get<VentaDiariaService>(VentaDiariaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar ventas diarias ordenadas', async () => {
      const ventas = [{ id: 1, fecha: '2025-12-01' }];
      ventaDiariaRepo.find.mockResolvedValue(ventas);
      const res = await service.findAll();
      expect(res).toBe(ventas);
      expect(ventaDiariaRepo.find).toHaveBeenCalledWith({ order: { fecha: 'DESC' }, relations: ['productoMasVendido'] });
    });

    it('debería lanzar error si falla la consulta', async () => {
      ventaDiariaRepo.find.mockRejectedValue(new Error('DB error'));
      await expect(service.findAll()).rejects.toThrow('Error al recuperar el historial de ventas');
    });
  });

  describe('findOne', () => {
    it('debería retornar una venta diaria por id', async () => {
      const venta = { id: 2 };
      ventaDiariaRepo.findOne.mockResolvedValue(venta);
      const res = await service.findOne(2);
      expect(res).toBe(venta);
      expect(ventaDiariaRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 }, relations: ['productoMasVendido'] });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      ventaDiariaRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow('No se encontró el registro de venta diaria con ID #99');
    });

    it('debería lanzar error 500 si ocurre un error inesperado', async () => {
      ventaDiariaRepo.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('debería actualizar una venta diaria existente', async () => {
      const venta = { id: 3 };
      const dto = { total_vendido: 100 };
      ventaDiariaRepo.preload.mockResolvedValue({ id: 3, ...dto });
      ventaDiariaRepo.save.mockResolvedValue({ id: 3, ...dto });
      const res = await service.update(3, dto as any);
      expect(res).toEqual({ id: 3, ...dto });
      expect(ventaDiariaRepo.preload).toHaveBeenCalledWith({ id: 3, ...dto });
      expect(ventaDiariaRepo.save).toHaveBeenCalledWith({ id: 3, ...dto });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      ventaDiariaRepo.preload.mockResolvedValue(undefined);
      await expect(service.update(4, { total_vendido: 200 } as any)).rejects.toThrow('no encontrada');
    });

    it('debería lanzar error 500 si ocurre un error inesperado', async () => {
      ventaDiariaRepo.preload.mockRejectedValue(new Error('DB error'));
      await expect(service.update(5, { total_vendido: 300 } as any)).rejects.toThrow('Error al actualizar el registro');
    });
  });

  describe('remove', () => {
    it('debería eliminar una venta diaria existente', async () => {
      const venta = { id: 6 };
      jest.spyOn(service, 'findOne').mockResolvedValue(venta as any);
      ventaDiariaRepo.remove.mockResolvedValue(venta);
      const res = await service.remove(6);
      expect(res).toEqual({ message: expect.stringContaining('eliminado exitosamente') });
      expect(ventaDiariaRepo.remove).toHaveBeenCalledWith(venta);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('No existe'));
      await expect(service.remove(7)).rejects.toThrow('No existe');
    });

    it('debería lanzar error 500 si ocurre un error inesperado', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 8 } as any);
      ventaDiariaRepo.remove.mockRejectedValue(new Error('DB error'));
      await expect(service.remove(8)).rejects.toThrow('No se pudo eliminar el registro');
    });
  });
});
