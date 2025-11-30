import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  // 1. Endpoint para ver TODO el historial (Reportes)
  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  // 2. Endpoint para ver UN detalle específico (Auditoría)
  // Usamos ParseIntPipe para asegurar que el id sea un número
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }
}