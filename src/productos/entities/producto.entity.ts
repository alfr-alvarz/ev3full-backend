import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    nombre: string;

    @Column({length: 500})
    descripcion: string;

    @Column({ })
    precio_base: number; //sin IVA

    //number o float?
    //Debería definirse en otro lado para que aplique automático después
    @Column({ })
    iva: number; //porcentaje de IVA

    @Column({ })
    precio_con_iva: number;

    @Column({})
    stock_actual: number;

    @Column({})
    ruta_imagen: string;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fecha_creacion: Date;
}
