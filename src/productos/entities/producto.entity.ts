import { Categoria } from "src/categorias/entities/categoria.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    nombre: string;

    @Column({type: 'varchar', length: 500})
    descripcion: string;

    @Column({ type: 'int'})
    precio_base: number; //sin IVA

    //number o float?
    //Debería definirse en otro lado para que aplique automático después?
    @Column({ type: 'int', default: 0 })
    iva: number; //porcentaje de IVA. Ej: usar 19 o 21

    @Column({})
    precio_con_iva: number;

    @Column({ type: 'int', default: 0 })
    stock_actual: number;

    
    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { 
        onDelete: 'SET NULL' //si se borra una categoría, productos quedan sin categoría
    })
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @Column({ nullable: true, name: 'categoria_id'})
    categoriaId: number;

    @Column({})
    ruta_imagen: string;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fecha_creacion: Date;

    @BeforeInsert()
    @BeforeUpdate()
    calcularPrecioConIVA() {
        //Si iva > 1 tomar como % y pasarlo a decimal, sino dejarlo como está.
        const ivaDecimal = this.iva > 1 ? this.iva / 100 : this.iva;
        this.precio_con_iva = Math.round((this.precio_base * (1 + ivaDecimal)));
    }
    

}
