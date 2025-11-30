import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VentaDiariaService } from './venta-diaria.service';
import { CreateVentaDiariaDto } from './dto/create-venta-diaria.dto';
import { UpdateVentaDiariaDto } from './dto/update-venta-diaria.dto';

@Controller('venta-diaria')
export class VentaDiariaController {
  constructor(private readonly ventaDiariaService: VentaDiariaService) {}

  // ENDPOINT: Generar reporte automático
  // Ruta: POST /venta-diaria/generar
  // Puedes enviarle un body: { "fecha": "2025-11-20" }
  // Si no envías nada, calculará el reporte de HOY.
  @Post('generar')
  generarReporte(@Body('fecha') fechaString?: string) {
    // Si viene fecha en el body la usamos, si no, usamos la fecha actual
    const fecha = fechaString ? new Date(fechaString) : new Date();
    return this.ventaDiariaService.generarReporteDiario(fecha);
  }

  // =================================================================
  // ENDPOINTS ESTÁNDAR (CRUD)
  // =================================================================

  // Crear/Actualizar manualmente (si fuera necesario inyectar datos a mano)
  @Post()
  create(@Body() createVentaDiariaDto: CreateVentaDiariaDto) {
    return this.ventaDiariaService.registrarVentaDiaria(createVentaDiariaDto);
  }

  // Obtener historial completo
  @Get()
  findAll() {
    return this.ventaDiariaService.findAll();
  }

  // Obtener un reporte específico por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventaDiariaService.findOne(id);
  }

  // Corregir un reporte manualmente
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVentaDiariaDto: UpdateVentaDiariaDto
  ) {
    return this.ventaDiariaService.update(id, updateVentaDiariaDto);
  }

  // Eliminar un reporte
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventaDiariaService.remove(id);
  }
}