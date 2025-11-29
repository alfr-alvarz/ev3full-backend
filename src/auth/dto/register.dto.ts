import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {

    @Transform(({ value }) => value?.trim()) //para eliminar espacios por si acaso
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    contrasena: string;
    
    @IsNumber()
    @IsOptional()
    telefono?: number;

    @IsString()
    @IsOptional()
    direccion?: string;

}