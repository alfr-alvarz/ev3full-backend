import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity'; 

describe('ProductosService', () => {
  let service: ProductosService;
  let repositoryMock: any; 

  
  const mockProductoRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve([
        {
          id: 1,
          nombre: 'Coca Cola Test',
          precio_base: 2500,
          stock_actual: 50,
        },
      { id: 2, nombre: 'Sprite Test', precio_base: 2000, stock_actual: 40 },
    ])),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((producto) =>
        Promise.resolve({ id: Date.now(), ...producto }),
      ),
    // Si tu servicio usa 'findOne', agrega esto:
    findOne: jest.fn().mockImplementation((options) => {
      return Promise.resolve({
        id: 1,
        nombre: 'Producto Encontrado',
        precio_base: 1000,
      });
    }),
  };

  beforeEach(async () => {
    // Instanciamos el servicio a mano pasando el mock del repositorio
    service = new ProductosService(mockProductoRepository as any);
    repositoryMock = mockProductoRepository;
  });

  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('findAll debe retornar una lista de productos', async () => {
    const resultado = await service.findAll();


    expect(resultado).toHaveLength(2);
    expect(resultado[0].nombre).toEqual('Coca Cola Test');
        expect(repositoryMock.find).toHaveBeenCalled();
  });

  
  it('create debe guardar un nuevo producto', async () => {
    const nuevoProducto = {
      nombre: 'Nuevo Item',
      precio_base: 5000,
      stock_actual: 10,
      categoria_id: 1,
      
    };

    
    const resultado = await service.create(nuevoProducto as any);

    expect(resultado).toEqual(expect.objectContaining({ nombre: 'Nuevo Item' }));
    expect(repositoryMock.create).toHaveBeenCalledWith(nuevoProducto);
    expect(repositoryMock.save).toHaveBeenCalled();
  });
});