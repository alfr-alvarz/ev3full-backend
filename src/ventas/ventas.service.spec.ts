import { VentasService } from './ventas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DataSource } from 'typeorm';

const mockDataSource = {
  createQueryRunner: () => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    manager: {
      findOneBy: jest.fn(),
      save: jest.fn(),
    },
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  }),
};
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from 'src/productos/entities/producto.entity';

describe('VentasService', () => {
  let service: VentasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentasService,
        { provide: getRepositoryToken(Venta), useValue: {} },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<VentasService>(VentasService);
  });

  it('should be defined', () => {
    // create instance with minimal mocks
    const fakeRepo: any = {};
    const fakeDataSource: any = { createQueryRunner: () => ({}) };
    service = new VentasService(fakeRepo, fakeDataSource as any);
    expect(service).toBeDefined();
  });

  it('creates a venta and assigns precio_unitario_con_iva on details', async () => {
    // Prepare a product snapshot that would be returned by the queryRunner
    const producto: Producto = {
      id: 1,
      nombre: 'Producto Test',
      descripcion: '',
      precio_base: 1000,
      iva: 19,
      stock_actual: 10,
      stock_minimo: 0,
      createdAt: undefined,
      updatedAt: undefined,
    } as unknown as Producto;

    // Arrange: mocks for queryRunner and DataSource
    let savedVenta: any = null;

    const mockQueryRunner: any = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      manager: {
        findOneBy: jest.fn().mockImplementation(async (_: any, where: any) => {
          if (where && where.id === producto.id) return producto;
          return null;
        }),
        save: jest.fn().mockImplementation(async (entity: any) => {
          // If it's a product save, return it back
          if (entity && entity.stock_actual !== undefined) return entity;

          // Otherwise it's the venta being saved
          if (entity && entity.detalles !== undefined) {
            savedVenta = { ...entity, id: 42 };
            return savedVenta;
          }

          return entity;
        }),
      },
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
    };

    const mockDataSource: any = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const fakeRepo: any = {};
    service = new VentasService(fakeRepo, mockDataSource as any);

    // Build a CreateVentaDto matching controller payload
    const dto: CreateVentaDto = {
      metodo_pago: 'efectivo',
      productos: [
        {
          productoId: producto.id,
          cantidad: 2,
        },
      ],
    } as unknown as CreateVentaDto;

    const user = { id: 7 } as any;

    // Act
    const result = await service.crearVenta(dto, user);

    // Assert: service should have attempted to save and returned the savedVenta
    expect(savedVenta).not.toBeNull();
    expect(savedVenta.detalles).toHaveLength(1);
    const detalle = savedVenta.detalles[0];

    // precio_unitario_con_iva must equal precio_base * (1 + iva/100)
    const expectedUnitWithIva = Math.round(producto.precio_base * (1 + (producto.iva / 100)));
    expect(detalle.precio_unitario_con_iva).toBeDefined();
    expect(detalle.precio_unitario_con_iva).toBe(expectedUnitWithIva);

    // subtotal_con_iva must be cantidad * precio_unitario_con_iva
    expect(detalle.subtotal_con_iva).toBeDefined();
    expect(detalle.subtotal_con_iva).toBe(detalle.cantidad * detalle.precio_unitario_con_iva);
  });
});
