import { Producto } from '../../productos/entities/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, unique: true })
    nombre: string;

    @Column({type: 'varchar', length: 140})
    descripcion: string;

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];
}
