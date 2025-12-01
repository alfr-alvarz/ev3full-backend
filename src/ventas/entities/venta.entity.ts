import { ApiProperty } from "@nestjs/swagger";
import { DetalleVenta } from '../../detalle-venta/entities/detalle-venta.entity';
import { User } from '../../users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";

@Entity('ventas')
export class Venta {
    @ApiProperty({ example: 501 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ 
        type: () => User, // Usamos () => User para evitar errores circulares
        description: 'Usuario que realizó la compra' 
    })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true, name: 'user_id' })
    userId: number;

    @ApiProperty({ example: '2025-11-30T14:00:00.000Z' })
    @CreateDateColumn()
    fecha_hora: Date;

    // --- SECCIÓN DE ESPERA ---
    // Estos campos esperarán recibir el valor final desde el Servicio.
    
    @Column('int')
    subtotal: number; // Suma de todos los subtotal_sin_iva de los detalles

    @Column('int')
    total_iva: number; // Suma de todos los subtotal_iva de los detalles

    @ApiProperty({ 
        example: 25000, 
        description: 'Suma total a pagar (incluye impuestos)' 
    })
    @Column('int')
    total: number; // Suma de todos los subtotal_con_iva (o subtotal + total_iva)
    // -----------------------

    @Column()
    metodo_pago: string;

    // cascade: true es VITAL aquí. 
    // Permite que al guardar la Venta, se guarden automáticamente sus detalles.
    @ApiProperty({ type: () => [DetalleVenta] })
    @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta, { cascade: true })
    detalles: DetalleVenta[];
}