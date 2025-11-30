import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { ApiProperty } from '@nestjs/swagger';


//YA NO USAMOS DTO DETALLE-VENTA, YA USAMOS EL DTO INTERNO create-venta.dto.ts

@Entity()
export class DetalleVenta {
    @ApiProperty({ example: 1, description: 'ID único del detalle' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ 
        type: () => Venta, // Esto evita el error que me arrojaba Swagger
        description: 'Venta a la que pertenece este detalle' 
    })
    @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'venta_id' })
    venta: Venta;

    @ApiProperty({ 
        type: () => Producto,
        description: 'Producto comprado' 
    })
    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @ApiProperty({ example: 2, description: 'Cantidad comprada' })
    @Column({ type: 'int'})
    cantidad: number;

    // precio del producto al momento de la venta
    // se define, pero en service se asigna (una snapshot)
    @ApiProperty({ 
        example: 1000, 
        description: 'Precio (sin IVA) congelado al momento de la venta' 
    })
    @Column({ type: 'int'})
    precio_unitario_base: number;

    @ApiProperty({ example: 19, description: 'Porcentaje de IVA aplicado' })
    @Column({type: 'int'})
    iva: number; //porcentaje de IVA en ese momento

    @ApiProperty({ example: 1190, description: 'Precio (con IVA) congelado al momento de la venta' })
    @Column({type: 'int'})
    precio_unitario_con_iva: number; // precio_unitario_base x (1 + iva/100)

    // cantidad x precio_unitario_base
    @ApiProperty({ example: 2000, description: 'Subtotal neto (Cantidad x Precio Base)' })
    @Column({ type: 'int'})
    subtotal_sin_iva: number;

    @ApiProperty({ 
        example: 300,
        description: 'Cantidad x (Precio sin IVA x IVA/100). Suma del IVA de la cantidad del producto'
    })
    @Column({ type: 'int'})
    subtotal_iva: number; //cantidad x (precio_unitario_base x iva/100)

    @ApiProperty({ 
        example: 2380,
        description: 'Subtotal final de esta línea (con IVA). Cantidad x Precio con IVA'
    })
    @Column({ type: 'int'})
    subtotal_con_iva: number; // cantidad x precio_unitario_con_iva

}
