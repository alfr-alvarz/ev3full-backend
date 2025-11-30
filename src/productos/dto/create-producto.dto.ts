import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    descripcion: string;
    
    @IsNotEmpty()
    @IsNumber()
    precio_base: number;

    @IsNumber()
    iva: number;

    @IsNumber()
    precio_con_iva: number;

    @IsNumber()
    stock_actual: number;
    
    @IsString()
    ruta_imagen?: string;
}
