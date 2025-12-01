import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Ventas')
@Controller('ventas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}


  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta', description: 'Descuenta stock y genera snapshots de precios.' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente.', type: () => Venta })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o datos inválidos.' })
  @Roles(Role.VENDEDOR, Role.ADMIN) // <--- 3. Protegemos la ruta (Esto llena req.user)
  create(@Body() createVentaDto: CreateVentaDto, @Req() req: any) {
    
    // req.user es el usuario que extrajo el Guard desde el Token JWT
    const user = req.user; 

    // Ahora sí podemos enviarlo al servicio
    return this.ventasService.crearVenta(createVentaDto, user);
  }
  
  @Get('mis-ventas') // <--- Ruta fija: /ventas/mis-ventas 
  async findMisVentas(@Req() req: any) {
    const user = req.user;
    return this.ventasService.findVentasByUsuario(user.id);
  }

  @Get()
  @Roles(Role.ADMIN) //Solo admin
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VENDEDOR)
  @ApiOperation({ summary: 'Obtener detalle de una venta' })
  @ApiResponse({ status: 200, description: 'Venta encontrada.', type: () => Venta })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.ventasService.findOne(id);
  }
  

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }
}
