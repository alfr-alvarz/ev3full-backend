import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleVentaDto } from 'src/detalle-venta/dto/create-detalle-venta.dto';
import { ApiProperty } from '@nestjs/swagger';

// DTO Principal: Lo que recibe el Controller
export class CreateVentaDto {
    @ApiProperty({ 
        description: 'Forma en la que el cliente pagó', 
        example: 'transbank',
        enum: ['efectivo', 'transbank', 'transferencia'] // Opcional: si tienes valores fijos
    })
    @IsString()
    @IsNotEmpty()
    metodo_pago: string; // Ej: "transbank", "efectivo", "transferencia"

    @ApiProperty({ 
        description: 'Lista de productos a comprar',
        type: [CreateDetalleVentaDto] // <--- MAGIA: Esto muestra la estructura interna en Swagger
    })
    @IsArray()
    @ValidateNested({ each: true }) // Valida cada objeto dentro del array
    @Type(() => CreateDetalleVentaDto) // Convierte el JSON plano a instancias de la clase CreateDetalleVentaDto
    productos: CreateDetalleVentaDto[];
}