import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('detalle-venta')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  // Endpoint para ver TODO el historial (Reportes)
  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  // Endpoint para ver UN detalle específico (Auditoría)
  // Usamos ParseIntPipe para asegurar que el id sea un número
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }
}