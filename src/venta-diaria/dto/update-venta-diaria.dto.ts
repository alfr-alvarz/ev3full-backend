import { PartialType } from '@nestjs/swagger';
import { CreateVentaDiariaDto } from './create-venta-diaria.dto';

export class UpdateVentaDiariaDto extends PartialType(CreateVentaDiariaDto) {}
