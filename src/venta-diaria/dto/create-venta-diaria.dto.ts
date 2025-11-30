
export class CreateVentaDiariaDto {
  fecha: Date;
  cantidad_ventas: number;
  total_vendido: number;
  total_productos_vendidos: number;
  producto_mas_vendido_id?: number; // Opcional
  observaciones?: string;
}