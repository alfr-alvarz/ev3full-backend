import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, unique: true })
    nombre: string;

    @Column({type: 'varchar', length: 140})
    descripcion: string;
}
