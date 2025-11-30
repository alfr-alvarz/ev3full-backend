import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';


//YA NO USAMOS DTO DETALLE-VENTA, YA USAMOS EL DTO INTERNO create-venta.dto.ts

@Entity()
export class DetalleVenta {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'venta_id' })
    venta: Venta;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @Column({ type: 'int'})
    cantidad: number;

    // precio del producto al momento de la venta
    // se define, pero en service se asigna (una snapshot)
    @Column({ type: 'int'})
    precio_unitario_base: number;

    @Column({type: 'int'})
    iva: number; //porcentaje de IVA en ese momento

    @Column({type: 'int'})
    precio_unitario_con_iva: number; // precio_unitario_base x (1 + iva/100)

    // cantidad x precio_unitario_base
    @Column({ type: 'int'})
    subtotal_sin_iva: number;

    @Column({ type: 'int'})
    subtotal_iva: number; //cantidad x (precio_unitario_base x iva/100)

    @Column({ type: 'int'})
    subtotal_con_iva: number; // cantidad x precio_unitario_con_iva

}
