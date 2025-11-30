import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductoDto {
    @ApiProperty({
    example: 'Café Molido Premium',
    description: 'Nombre del producto.',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'Café arábica 100% tostado de origen colombiano.',
    description: 'Descripción del producto.',
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: 4500,
    description: 'Precio base del producto sin IVA. Debe ser un número positivo.',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio_base: number;

  @ApiProperty({
    example: 19,
    description:
      'IVA expresado como porcentaje. Por ejemplo: 19 para un 19% de IVA.',
  })
  @IsPositive()
  @IsNumber()
  iva: number;

  @ApiProperty({
    example: 120,
    description: 'Cantidad disponible actualmente en inventario.',
  })
  @IsNumber()
  stock_actual: number;

  @ApiProperty({
    example: '/images/productos/cafe-premium.png',
    description: 'Ruta o URL de la imagen del producto.',
  })
  @IsString()
  ruta_imagen: string;
}
