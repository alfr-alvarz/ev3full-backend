import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

// DTO Auxiliar: Representa cada item en el "carrito"
export class CreateDetalleVentaDto {
    @ApiProperty({ 
        description: 'ID del producto a comprar', 
        example: 5 
    })
    @IsInt()
    @IsPositive()
    productoId: number;

    @ApiProperty({ 
        description: 'Cantidad de unidades. Debe ser mayor a 0.', 
        example: 2,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    cantidad: number;
}