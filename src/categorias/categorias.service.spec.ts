import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let repoMock: any;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    repoMock = { ...mockRepo };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: getRepositoryToken(Categoria), useValue: repoMock },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una categoría nueva', async () => {
      const dto = { nombre: 'Juguetes', descripcion: 'Para todos' } as any;
      const created = { id: 1, ...dto };

      repoMock.create.mockReturnValue(dto);
      repoMock.save.mockResolvedValue(created);

      const res = await service.create(dto);

      expect(res).toEqual(created);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(dto);
    });

    it('debería lanzar BadRequest si nombre duplicado', async () => {
      const dto = { nombre: 'Juguetes', descripcion: 'x' } as any;
      repoMock.create.mockReturnValue(dto);
      repoMock.save.mockRejectedValue({ errno: 1062 });

      await expect(service.create(dto)).rejects.toThrow(`La categoría '${dto.nombre}' ya existe.`);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las categorías', async () => {
      const datos = [{ id: 1 }, { id: 2 }];
      repoMock.find.mockResolvedValue(datos);

      const res = await service.findAll();
      expect(res).toBe(datos);
      expect(repoMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar una categoría por id', async () => {
      const cat = { id: 5, nombre: 'A' };
      repoMock.findOne.mockResolvedValue(cat);

      const res = await service.findOne(5);
      expect(res).toBe(cat);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      repoMock.findOne.mockResolvedValue(undefined);
      await expect(service.findOne(99)).rejects.toThrow('Categoría con ID 99 no encontrada.');
    });
  });

  describe('update', () => {
    it('debería actualizar una categoría existente', async () => {
      const existing = { id: 2, nombre: 'Old' } as any;
      const dto = { nombre: 'Nuevo' } as any;
      repoMock.findOne.mockResolvedValue(existing);
      // repo.merge no necesita devolver nada específico, pero lo mockeamos
      repoMock.merge.mockImplementation((a, b) => Object.assign(a, b));
      repoMock.save.mockResolvedValue({ id: 2, nombre: 'Nuevo' });

      const res = await service.update(2, dto);
      expect(res).toEqual({ id: 2, nombre: 'Nuevo' });
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(repoMock.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequest si el nuevo nombre ya existe', async () => {
      const existing = { id: 3, nombre: 'A' } as any;
      const dto = { nombre: 'Duplicado' } as any;
      repoMock.findOne.mockResolvedValue(existing);
      repoMock.merge.mockImplementation((a, b) => Object.assign(a, b));
      repoMock.save.mockRejectedValue({ errno: 1062 });

      await expect(service.update(3, dto)).rejects.toThrow(`Ya existe otra categoría con el nombre '${dto.nombre}'.`);
    });
  });

  describe('remove', () => {
    it('debería eliminar una categoría existente y devolver mensaje', async () => {
      const cat = { id: 9, nombre: 'ToDelete' } as any;
      repoMock.findOne.mockResolvedValue(cat);
      repoMock.remove.mockResolvedValue(cat);

      const res = await service.remove(9);
      expect(res).toEqual({ deleted: true, message: expect.stringContaining('Categoría ToDelete eliminada') });
      expect(repoMock.remove).toHaveBeenCalledWith(cat);
    });
  });
});
