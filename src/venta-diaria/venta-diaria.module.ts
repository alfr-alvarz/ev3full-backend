import { Module } from '@nestjs/common';
import { VentaDiariaService } from './venta-diaria.service';
import { VentaDiariaController } from './venta-diaria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaDiaria } from './entities/venta-diaria.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { DetalleVenta } from 'src/detalle-venta/entities/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    VentaDiaria,
    Venta,
    DetalleVenta
  ])],
  controllers: [VentaDiariaController],
  providers: [VentaDiariaService],
  exports: [VentaDiariaService],
})
export class VentaDiariaModule {}
