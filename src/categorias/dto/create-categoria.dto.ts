import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoriaDto {
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MaxLength(30, { message: 'El nombre no puede exceder los 30 caracteres.' })
    nombre: string;

    @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @MaxLength(140, { message: 'La descripción no puede exceder los 140 caracteres.' })
    descripcion: string;
}
