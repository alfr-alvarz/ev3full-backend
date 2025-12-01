import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle-venta/entities/detalle-venta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class VentasService {

  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    /*
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    Ya no se usa porque el QueryRunner se encarga.
    */

    // Inyectamos DataSource para manejar transacciones
    private readonly dataSource: DataSource,
  ) { }

  async crearVenta(crearVentaDto: CreateVentaDto, user: User) {
    // Iniciar la "burbuja" de la transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // --- DENTRO DE ESTE TRY, TODO SE HACE CON queryRunner.manager ---

      const venta = new Venta();
      venta.user = user;
      venta.metodo_pago = crearVentaDto.metodo_pago;
      venta.detalles = [];

      let sumaSubtotal = 0;
      let sumaIva = 0;
      let sumaTotal = 0;

      for (const item of crearVentaDto.productos) {
        // BUSCAR: Usamos queryRunner.manager (dentro de la transacción)
        const producto = await queryRunner.manager.findOneBy(Producto, { id: item.productoId });

        if (!producto) {
          throw new NotFoundException(`El producto con ID ${item.productoId} no fue encontrado`);
        }

        // --- VALIDACIÓN DE STOCK ---
        if (producto.stock_actual < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para '${producto.nombre}'. Solicitado: ${item.cantidad}, Disponible: ${producto.stock_actual}`
          );
        }

        // --- DESCUENTO DE STOCK ---
        producto.stock_actual -= item.cantidad;
        // Guardamos el cambio de stock usando el manager
        await queryRunner.manager.save(producto);

        // --- LÓGICA DE SNAPSHOT ---
        const detalle = new DetalleVenta();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.precio_unitario_base = producto.precio_base;
        detalle.iva = producto.iva ? producto.iva : 19; // Fallback a 19 si no hay IVA definido

        // Cálculos manuales
        const precioBase = Number(detalle.precio_unitario_base);
        const ivaPorcentaje = Number(detalle.iva);

        // Precio unitario con IVA (snapshot por unidad)
        detalle.precio_unitario_con_iva = Math.round(precioBase * (1 + ivaPorcentaje / 100));

        // Subtotal final (usa precio_unitario_con_iva por unidad para evitar desajustes)
        detalle.subtotal_con_iva = Math.round(detalle.cantidad * detalle.precio_unitario_con_iva);
        detalle.subtotal_sin_iva = Math.round(precioBase * detalle.cantidad);
        detalle.subtotal_iva = Math.round(detalle.subtotal_sin_iva * (ivaPorcentaje / 100));
        detalle.subtotal_con_iva = Math.round(detalle.subtotal_sin_iva + detalle.subtotal_iva);

        venta.detalles.push(detalle);

        // Acumulamos
        sumaSubtotal += detalle.subtotal_sin_iva;
        sumaIva += detalle.subtotal_iva;
        sumaTotal += detalle.subtotal_con_iva;
      }

      // Asignar totales a la Venta
      venta.subtotal = sumaSubtotal;
      venta.total_iva = sumaIva;
      venta.total = sumaTotal;

      // GUARDAR VENTA: Usamos manager.save para que sea parte de la transacción
      // (Gracias al cascade: true, esto guarda también los detalles)
      const ventaGuardada = await queryRunner.manager.save(venta);

      // SI LLEGAMOS AQUÍ SIN ERRORES, CONFIRMAMOS CAMBIOS
      await queryRunner.commitTransaction();

      return ventaGuardada;

    } catch (error) {
      // SI ALGO FALLA, DESHACEMOS TODO
      await queryRunner.rollbackTransaction();

      // Manejo de errores para saber qué pasó
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // Re-lanzar errores de lógica (como falta de stock)
      }

      console.error('Error en transacción de venta:', error);
      throw new InternalServerErrorException('Error al procesar la venta');

    } finally {
      // SIEMPRE liberamos la conexión al final
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.ventaRepository.find({
      relations: {
        user: true, // Mantenemos el usuario para saber de quién es
      },
      order: {
        fecha_hora: 'DESC', // Opcional: Para ver las más recientes primero
      },
    });
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: {
        user: true,
        detalles: {
          producto: true, // Drill-down: Venta -> Detalle -> Producto
        },
      },
    });

    if (!venta) {
      throw new NotFoundException(`La venta #${id} no existe`);
    }

    return venta;
  }

  async findVentasByUsuario(userId: number) {
    return await this.ventaRepository.find({
      where: {
        user: { id: userId }, // <--- Aquí filtramos para que solo traiga las de ese usuario
      },
      relations: {
        // Traemos los detalles para que el usuario pueda ver QUÉ compró en la lista
        detalles: {
          producto: true,
        },
      },
      order: {
        fecha_hora: 'DESC', // Muestra las compras más recientes primero
      },
    });
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    // preload busca la entidad por id y reemplaza SOLO los datos que se envian en el DTO
    const venta = await this.ventaRepository.preload({
      id: id,
      ...updateVentaDto,
    });

    if (!venta) {
      throw new NotFoundException(`La venta #${id} no existe`);
    }

    // Nota: Si en el futuro se necesita permitir editar productos, 
    // tendrías que implementar lógica de devolución de stock aquí.
    return await this.ventaRepository.save(venta);
  }

  async remove(id: number) {
    // Reutilizamos findOne para asegurarnos de que existe antes de borrar
    const venta = await this.findOne(id);
    return await this.ventaRepository.remove(venta);
  }
}
