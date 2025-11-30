import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleVentaDto } from 'src/detalle-venta/dto/create-detalle-venta.dto';

// DTO Principal: Lo que recibe el Controller
export class CreateVentaDto {
    @IsString()
    @IsNotEmpty()
    metodo_pago: string; // Ej: "transbank", "efectivo", "transferencia"

    @IsArray()
    @ValidateNested({ each: true }) // Valida cada objeto dentro del array
    @Type(() => CreateDetalleVentaDto) // Convierte el JSON plano a instancias de la clase CreateDetalleVentaDto
    productos: CreateDetalleVentaDto[];
}