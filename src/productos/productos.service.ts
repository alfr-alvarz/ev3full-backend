import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) { }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
  try {
    const producto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(producto);
  } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException('Producto con ID ' + id + ' no encontrado');
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto>{
    const producto = await this.findOne(id);
    const productoActualizado = Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(productoActualizado);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.delete(id);
  }

}
