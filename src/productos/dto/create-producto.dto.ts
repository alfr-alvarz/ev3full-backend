import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { Type } from 'class-transformer';

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
  @IsOptional()
  descripcion: string;

  @ApiProperty({
    example: 4500,
    description: 'Precio base del producto sin IVA. Debe ser un número positivo.',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  precio_base: number;

  @ApiProperty({
    example: 19,
    description:
      'IVA expresado como porcentaje. Por ejemplo: 19 para un 19% de IVA.',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  iva: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría a la que pertenece el producto.',
    required: false // Indica en Swagger que es opcional (POR AHORA)
  })
  @IsOptional()
  @IsNumber() 
  @IsPositive()
  @Type(() => Number)
  categoriaId: number; 

  @ApiProperty({
    example: 120,
    description: 'Cantidad disponible actualmente en inventario.',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock_actual: number;

  @ApiProperty({
    example: '/images/productos/cafe-premium.png',
    description: 'Ruta o URL de la imagen del producto.',
  })
  @IsString()
  @IsOptional()
  ruta_imagen: string;
}
