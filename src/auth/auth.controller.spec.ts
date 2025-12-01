import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      register: jest.fn().mockResolvedValue({ message: 'Usuario creado exitosamente' }),
      registerWithRol: jest.fn().mockResolvedValue({ message: 'Usuario con rol registrado exitosamente' }),
      login: jest.fn().mockResolvedValue({ access_token: 't', correo: 'a', nombre: 'N', rol: 'VENDEDOR' }),
    };

    controller = new AuthController(authServiceMock as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register proxies to service', async () => {
    const res = await controller.register({ correo: 'a', nombre: 'n', contrasena: 'x' } as any);
    expect(authServiceMock.register).toHaveBeenCalled();
    expect(res).toEqual({ message: 'Usuario creado exitosamente' });
  });

  it('registerWithRol proxies to service', async () => {
    const res = await controller.registerWithRol({ correo: 'a', nombre: 'n', contrasena: 'x', rol: 'ADMIN' } as any);
    expect(authServiceMock.registerWithRol).toHaveBeenCalled();
    expect(res).toEqual({ message: 'Usuario con rol registrado exitosamente' });
  });

  it('login proxies to service', async () => {
    const res = await controller.login({ correo: 'a', contrasena: 'x' } as any);
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(res).toEqual({ access_token: 't', correo: 'a', nombre: 'N', rol: 'VENDEDOR' });
  });

  it('getProfile returns req.user', () => {
    const user = { correo: 'a', nombre: 'n' };
    const fakeReq: any = { user };
    const res = controller.getProfile(fakeReq);
    expect(res).toBe(user);
  });
});
