import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CreateCategoriaDto {
    @ApiProperty({
        example: 'Juguetes',
        description: 'Nombre único de la categoría. Máximo 30 caracteres.',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 30) // Vital: Tu DB tiene límite de 30. Si mandan 31, fallará SQL.
    nombre: string;

    @ApiProperty({
        example: 'Juguetes de todos los tamaños y materiales para perros y gatos.',
        description: 'Breve descripción de la categoría.',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 140) // Validamos el límite de 140 caracteres de tu entidad
    descripcion: string;
}
