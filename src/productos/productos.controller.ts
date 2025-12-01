import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imagen'))
  create(@Body() createProductoDto: CreateProductoDto, @UploadedFile() file?: any,) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file?: any,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
