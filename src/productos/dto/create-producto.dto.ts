import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    descripcion: string;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio_base: number;

    @IsPositive()
    @IsNumber()
    iva: number;

    @IsNumber()
    stock_actual: number;
    
    @IsString()
    ruta_imagen?: string;
}
