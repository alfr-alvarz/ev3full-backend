import { Test, TestingModule } from '@nestjs/testing';
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
    expect(service).toBeDefined();
  });
});
