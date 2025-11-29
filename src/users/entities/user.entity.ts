import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, nullable: false })
  correo: string;

  @Column({nullable: false })
  contrasena: string;

  @Column({default: 'CLIENTE'})
  rol: string;

  //Lo hago number o string?
  @Column({ nullable: true})
  telefono: number;

  @Column({ nullable: true})
  direccion: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;
}