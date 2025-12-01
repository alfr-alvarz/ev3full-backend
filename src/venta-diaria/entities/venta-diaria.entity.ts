import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('venta_diaria')
export class VentaDiaria {
  @PrimaryGeneratedColumn()
  id: number;

  // unique: true evita que tengas dos registros estadísticos para el mismo día
  @Column({ type: 'date', unique: true })
  fecha: Date;

  @Column({ type: 'int', default: 0 })
  cantidad_ventas: number;

  @Column({ type: 'int', default: 0 })
  total_vendido: number;

  @Column({ type: 'int', default: 0 })
  total_productos_vendidos: number;

  // RELACIÓN OPCIONAL
  // Esto crea la relación con la tabla de productos
  @ManyToOne(() => Producto, { nullable: true })
  @JoinColumn({ name: 'producto_mas_vendido_id' }) // Especificamos el nombre exacto de la columna en la BD
  productoMasVendido: Producto;

  // OPCIONAL: Si quieres acceder directamente al ID sin cargar toda la relación
  @Column({ nullable: true })
  producto_mas_vendido_id: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}