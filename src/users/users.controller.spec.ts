import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let userServiceMock: any;

  beforeEach(() => {
    userServiceMock = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, correo: 'a' }]),
      removeByEmail: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    controller = new UsersController(userServiceMock as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns list from service', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1, correo: 'a' }]);
    expect(userServiceMock.findAll).toHaveBeenCalled();
  });

  it('removeByEmail calls service delete', async () => {
    const res = await controller.removeByEmail('foo@bar');
    expect(userServiceMock.removeByEmail).toHaveBeenCalledWith('foo@bar');
    expect(res).toEqual({ affected: 1 });
  });
});
