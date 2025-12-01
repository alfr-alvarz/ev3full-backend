import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Venta } from 'src/ventas/entities/venta.entity';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta', description: 'Descuenta stock y genera snapshots de precios.' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente.', type: () => Venta })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o datos inválidos.' })
  @UseGuards(AuthGuard('jwt')) // <--- 3. Protegemos la ruta (Esto llena req.user)
  create(@Body() createVentaDto: CreateVentaDto, @Req() req: any) {
    
    // req.user es el usuario que extrajo el Guard desde el Token JWT
    const user = req.user; 

    // 4. Ahora sí podemos enviarlo al servicio
    return this.ventasService.crearVenta(createVentaDto, user);
  }
  
  @Get('mis-ventas') // <--- Ruta fija: /ventas/mis-ventas
  @UseGuards(AuthGuard('jwt')) 
  async findMisVentas(@Req() req: any) {
    const user = req.user;
    return this.ventasService.findVentasByUsuario(user.id);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una venta' })
  @ApiResponse({ status: 200, description: 'Venta encontrada.', type: () => Venta })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.ventasService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }
}
