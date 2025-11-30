import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    try {
      const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(nuevaCategoria);
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`La categoría '${createCategoriaDto.nombre}' ya existe.`);
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      // Opcional: Si se quiere ver qué productos tiene cada categoría al listarlas
      // relations: ['productos'] 
    });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      // Opcional: Descomentar esto si al consultar 1 categoría se quieren ver sus productos
      // relations: ['productos'] 
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada.`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoriaExistente = await this.findOne(id);

    try {
      this.categoriaRepository.merge(categoriaExistente, updateCategoriaDto);
      return await this.categoriaRepository.save(categoriaExistente);
    } catch (error) {

      if (error.errno === 1062) {
        throw new BadRequestException(`Ya existe otra categoría con el nombre '${updateCategoriaDto.nombre}'.`);
      }
      throw new InternalServerErrorException('Error al actualizar la categoría');
    }
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {

    const categoria = await this.findOne(id);

    await this.categoriaRepository.remove(categoria);
    return {
      deleted: true,
      message: `Categoría ${categoria.nombre} eliminada. Los productos asociados quedaron sin categoría.`
    };
  }
}