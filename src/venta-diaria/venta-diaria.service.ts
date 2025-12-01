import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { CreateVentaDiariaDto } from './dto/create-venta-diaria.dto';
import { UpdateVentaDiariaDto } from './dto/update-venta-diaria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaDiaria } from './entities/venta-diaria.entity';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-venta/entities/detalle-venta.entity';

@Injectable()
export class VentaDiariaService {

  private readonly logger = new Logger(VentaDiariaService.name)

  constructor(
    @InjectRepository(VentaDiaria)
    private ventaDiariaRepo: Repository<VentaDiaria>,

    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private detalleVentaRepo: Repository<DetalleVenta>
  ) { }

  async generarReporteDiario(fecha: Date) {
    // Convertimos la fecha JS a string 'YYYY-MM-DD' para que SQL la entienda
    //Revisar si es UTC o es hora de Chile
    const fechaStr = fecha.toISOString().split('T')[0];

    this.logger.log(`📊 Generando reporte para el día: ${fechaStr}`);

    try {
      // ---------------------------------------------------------
      // 1. OBTENER DATOS DE LA TABLA 'VENTAS'
      // (Cantidad de ventas y Total de dinero recaudado)
      // ---------------------------------------------------------
      const datosVentas = await this.ventaRepo
        .createQueryBuilder('venta')
        .select('COUNT(venta.id)', 'cantidadVentas')
        .addSelect('SUM(venta.total)', 'totalDinero')
        .where('DATE(venta.fecha_hora) = :fecha', { fecha: fechaStr }) 
        .getRawOne();

      // ---------------------------------------------------------
      // 2. OBTENER TOTAL PRODUCTOS VENDIDOS
      // (Suma de 'cantidad' en DetalleVenta)
      // ---------------------------------------------------------
      const datosProductos = await this.detalleVentaRepo
        .createQueryBuilder('detalle')
        .leftJoin('detalle.venta', 'venta') // Unimos con venta para filtrar por fecha
        .select('SUM(detalle.cantidad)', 'totalItems')
        .where('DATE(venta.fecha_hora) = :fecha', { fecha: fechaStr })
        .getRawOne();

      // ---------------------------------------------------------
      // 3. OBTENER EL PRODUCTO MÁS VENDIDO (ID)
      // ---------------------------------------------------------
      const bestSeller = await this.detalleVentaRepo
        .createQueryBuilder('detalle')
        .leftJoin('detalle.venta', 'venta')
        .select('detalle.producto', 'productoId') // TypeORM entiende que esto es la FK
        .addSelect('SUM(detalle.cantidad)', 'cantidadTotal')
        .where('DATE(venta.fecha_hora) = :fecha', { fecha: fechaStr })
        .groupBy('detalle.producto') // Agrupamos por ID de producto
        .orderBy('cantidadTotal', 'DESC') // Orden descendente (el mayor primero)
        .limit(1) // Solo queremos el ganador
        .getRawOne();

      // ---------------------------------------------------------
      // 4. PREPARAR EL OBJETO
      // ---------------------------------------------------------
      // SQL devuelve strings en las funciones de agregación (SUM, COUNT),
      // así que usamos parseInt/parseFloat para asegurar tipos.
      
      const reporte = {
        fecha: fecha, // Guardamos la fecha completa, TypeORM manejará el tipo 'date'
        cantidad_ventas: parseInt(datosVentas.cantidadVentas) || 0,
        total_vendido: parseInt(datosVentas.totalDinero) || 0, // Usamos Int porque tu entidad usa Int
        total_productos_vendidos: parseInt(datosProductos.totalItems) || 0,
        producto_mas_vendido_id: bestSeller ? bestSeller.productoId : null,
        observaciones: `Cierre automático generado el ${new Date().toLocaleString()}`
      };

      this.logger.log(`✅ Datos calculados: Ventas=${reporte.cantidad_ventas}, Total=$${reporte.total_vendido}`);

      // ---------------------------------------------------------
      // 5. GUARDAR O ACTUALIZAR (Usando tu lógica anterior)
      // ---------------------------------------------------------
      return await this.registrarVentaDiaria(reporte);

    } catch (error) {
      this.logger.error(`❌ Error generando reporte: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al calcular las estadísticas del día');
    }
  }

  async registrarVentaDiaria(datos: any) {
    const ventaExistente = await this.ventaDiariaRepo.findOne({
      where: { fecha: datos.fecha }
    });

    if (ventaExistente) {
      const ventaActualizada = this.ventaDiariaRepo.merge(ventaExistente, datos);
      return await this.ventaDiariaRepo.save(ventaActualizada);
    } else {
      const nuevaVenta = this.ventaDiariaRepo.create(datos);
      return await this.ventaDiariaRepo.save(nuevaVenta);
    }
  }

  async findAll() {
    try {
      const ventas = await this.ventaDiariaRepo.find({
        // Ordenamos por fecha descendente (lo más reciente primero)
        order: { fecha: 'DESC' },
        // Cargamos la relación para ver los detalles del producto, no solo el ID
        relations: ['productoMasVendido'], 
      });
      return ventas;
    } catch (error) {
      this.logger.error(`Error al buscar ventas diarias: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al recuperar el historial de ventas');
    }
  }

  async findOne(id: number) {
    try {
      const venta = await this.ventaDiariaRepo.findOne({
        where: { id },
        relations: ['productoMasVendido'],
      });

      if (!venta) {
        throw new NotFoundException(`No se encontró el registro de venta diaria con ID #${id}`);
      }

      return venta;
    } catch (error) {
      // Si el error ya es NotFoundException, lo dejamos pasar. Si es otro (BD), lanzamos 500.
      if (error instanceof NotFoundException) throw error;
      
      this.logger.error(`Error buscando venta #${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateVentaDiariaDto: UpdateVentaDiariaDto) {
    try {
      // 'preload' crea una entidad basada en el DTO y verifica si el ID existe en la BD.
      // Es más limpio que hacer findOne + merge + save manualmente.
      const ventaPreload = await this.ventaDiariaRepo.preload({
        id: id,
        ...updateVentaDiariaDto,
      });

      if (!ventaPreload) {
        throw new NotFoundException(`No se puede actualizar: Venta diaria #${id} no encontrada`);
      }

      const ventaActualizada = await this.ventaDiariaRepo.save(ventaPreload);
      this.logger.log(`Venta diaria #${id} actualizada correctamente`);
      
      return ventaActualizada;

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      this.logger.error(`Error actualizando venta #${id}: ${error.message}`, error.stack);
      // Aquí podría fallar si intentan actualizar la fecha a una que ya existe (duplicate entry)
      throw new InternalServerErrorException('Error al actualizar el registro');
    }
  }

  async remove(id: number) {
    try {
      // Reutilizar findOne para asegurarnos de que existe (y lanzar 404 si no)
      const venta = await this.findOne(id);
      
      await this.ventaDiariaRepo.remove(venta);
      this.logger.log(`Venta diaria #${id} eliminada`);
      
      return { message: `Registro de venta #${id} eliminado exitosamente` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      this.logger.error(`Error eliminando venta #${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('No se pudo eliminar el registro');
    }
  }
}
