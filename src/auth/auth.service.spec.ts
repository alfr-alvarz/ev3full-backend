import { AuthService } from './auth.service';

// Mock bcryptjs BEFORE importing the service (jest hoisting works in test environment)
jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn().mockResolvedValue('hashed-pass'),
    compare: jest.fn().mockResolvedValue(true),
  },
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: any;
  let jwtMock: any;

  beforeEach(() => {
    usersServiceMock = {
      findOneByEmail: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      createwithrol: jest.fn().mockResolvedValue({}),
    };

    jwtMock = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };

    service = new AuthService(usersServiceMock as any, jwtMock as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register throws if email exists', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue({ id: 1, correo: 'a@b' });

    await expect(service.register({ nombre: 't', correo: 'a@b', contrasena: 'x' } as any)).rejects.toThrow();
    expect(usersServiceMock.findOneByEmail).toHaveBeenCalledWith('a@b');
  });

  it('register successfully creates user', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue(null);

    const res = await service.register({ nombre: 't', correo: 'ok@x', contrasena: 'x' } as any);

    expect(usersServiceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ message: 'Usuario creado exitosamente' });
  });

  it('registerWithRol throws if email exists', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue({ id: 1 });

    await expect(service.registerWithRol({ nombre: 't', correo: 'a@b', contrasena: 'x', rol: 'ADMIN' } as any)).rejects.toThrow();
  });

  it('registerWithRol creates new user', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue(null);

    const res = await service.registerWithRol({ nombre: 't', correo: 'ok@x', contrasena: 'x', rol: 'ADMIN' } as any);

    expect(usersServiceMock.createwithrol).toHaveBeenCalled();
    expect(res).toEqual({ message: 'Usuario con rol registrado exitosamente' });
  });

  it('login returns admin token for admin email', async () => {
    const payload = { correo: 'admin@tienda.com', contrasena: '123456' } as any;

    const out = await service.login(payload);

    expect(out).toHaveProperty('access_token', 'signed-token');
    expect(out.correo).toBe('admin@tienda.com');
    expect(out.rol).toBe('ADMIN');
  });

  it('login returns vendor token for vendor email', async () => {
    const payload = { correo: 'juan@tienda.com', contrasena: '123456' } as any;

    const out = await service.login(payload);

    expect(out).toHaveProperty('access_token', 'signed-token');
    expect(out.correo).toBe('juan@tienda.com');
    expect(out.rol).toBe('VENDEDOR');
  });

  it('login throws when user not found', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue(null);

    await expect(service.login({ correo: 'noexist@x', contrasena: 'x' } as any)).rejects.toThrow();
  });

  it('login throws on invalid password', async () => {
    // user exists but compare returns false
    usersServiceMock.findOneByEmail.mockResolvedValue({ id: 9, correo: 'x', contrasena: 'hashed' });
    const bcrypt = require('bcryptjs').default;
    bcrypt.compare.mockResolvedValue(false);

    await expect(service.login({ correo: 'x', contrasena: 'wrong' } as any)).rejects.toThrow();
  });

  it('login returns token for valid user', async () => {
    usersServiceMock.findOneByEmail.mockResolvedValue({ id: 9, correo: 'x@x', contrasena: 'hashed', nombre: 'N', rol: 'VENDEDOR' });
    const bcrypt = require('bcryptjs').default;
    bcrypt.compare.mockResolvedValue(true);

    const out = await service.login({ correo: 'x@x', contrasena: 'ok' } as any);
    expect(out).toHaveProperty('access_token', 'signed-token');
    expect(out.correo).toBe('x@x');
  });
});
