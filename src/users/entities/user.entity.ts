import { ApiProperty } from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({ example: 5, description: 'ID único del usuario' })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ example: 'juan.perez@guaumiau.cl', description: 'Correo electrónico' })
  @Column({ unique: true, nullable: false })
  correo: string;

  @Column({nullable: false })
  contrasena: string;

  @ApiProperty({ example: 'VENDEDOR', description: 'Rol del usuario en el sistema' })
  @Column({default: 'VENDEDOR'})
  rol: string;

  
  @ApiProperty({ example: '912345678', description: 'Teléfono de contacto' })
  @Column({ nullable: true})
  telefono: number;

  @ApiProperty({ example: 'Av. Siempre Viva 742', description: 'Dirección de despacho' })
  @Column({ nullable: true})
  direccion: string;

  @ApiProperty({ example: '2023-11-30T10:00:00.000Z', description: 'Fecha y hora de registro del usuario' })
  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;
}