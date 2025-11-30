import { IsInt, IsPositive, Min } from 'class-validator';

// DTO Auxiliar: Representa cada item en el "carrito"
export class CreateDetalleVentaDto {
    @IsInt()
    @IsPositive()
    productoId: number;

    @IsInt()
    @Min(1)
    cantidad: number;
}