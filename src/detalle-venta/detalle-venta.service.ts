import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  // FIND ALL: Útil para reportes generales o auditoría.
  async findAll() {
    return await this.detalleVentaRepository.find({
      relations: {
        venta: true,    // Para saber a qué ticket pertenece
        producto: true, // Para saber qué producto es
      },
      order: {
        id: 'DESC', // Los últimos movimientos primero
      }
    });
  }

  // FIND ONE: Para ver un detalle específico (poco uso, pero válido)
  async findOne(id: number) {
    const detalle = await this.detalleVentaRepository.findOne({
      where: { id },
      relations: {
        venta: true,
        producto: true,
      },
    });

    if (!detalle) {
      throw new NotFoundException(`El detalle de venta #${id} no existe`);
    }

    return detalle;
  }
  
  //  EXTRA: Una función útil para el futuro (Opcional)
  // "Dime todas las veces que se vendió el Producto X"
  async findByProducto(productoId: number) {
    return await this.detalleVentaRepository.find({
      where: { producto: { id: productoId } },
      relations: { venta: true },
      order: { id: 'DESC' }
    });
  }
}