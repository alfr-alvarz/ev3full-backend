import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repoMock: any;

  const mockRepo = {
    save: jest.fn().mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findOneBy: jest.fn().mockImplementation((where) => Promise.resolve(where && where.correo ? { id: 5, correo: where.correo, nombre: 'Test' } : null)),
    find: jest.fn().mockResolvedValue([{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(() => {
    repoMock = { ...mockRepo };
    // The service expects a repository; in the project the repository is injected but here we pass the mock directly
    service = new UsersService(repoMock as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should save a new user', async () => {
    const dto = { nombre: 'Juan', correo: 'juan@test', contrasena: 'x' } as any;
    const res = await service.create(dto);

    expect(res).toEqual(expect.objectContaining({ nombre: 'Juan', correo: 'juan@test' }));
    expect(repoMock.save).toHaveBeenCalledWith(dto);
  });

  it('createwithrol should save a user with role', async () => {
    const dto = { nombre: 'Admin', correo: 'admin@test', contrasena: 'x', rol: 'ADMIN' } as any;
    const res = await service.createwithrol(dto as any);

    expect(res).toEqual(expect.objectContaining({ rol: 'ADMIN' }));
    expect(repoMock.save).toHaveBeenCalledWith(dto);
  });

  it('findOneByEmail should return a user when found', async () => {
    const res = await service.findOneByEmail('a@b');
    expect(res).toBeDefined();
    expect(res.correo).toBe('a@b');
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ correo: 'a@b' });
  });

  it('findOneById should return a user when found', async () => {
    // adjust mock to return by id
    repoMock.findOneBy = jest.fn().mockResolvedValue({ id: 8, correo: 'x' });
    const res = await service.findOneById(8);
    expect(res).toBeDefined();
    expect(res.id).toBe(8);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 8 });
  });

  it('findAll should return list', async () => {
    const res = await service.findAll();
    expect(res).toHaveLength(2);
    expect(repoMock.find).toHaveBeenCalled();
  });

  it('removeByEmail should call delete', async () => {
    const res = await service.removeByEmail('x@y');
    expect(repoMock.delete).toHaveBeenCalledWith({ correo: 'x@y' });
    expect(res).toEqual({ affected: 1 });
  });
});
