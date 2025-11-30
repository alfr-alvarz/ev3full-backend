// category/categorias.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(nuevaCategoria);
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada.`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoriaExistente = await this.findOne(id);
    this.categoriaRepository.merge(categoriaExistente, updateCategoriaDto);
    return await this.categoriaRepository.save(categoriaExistente);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.categoriaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada para eliminar.`);
    }

    return { deleted: true, message: `Categoría con ID ${id} eliminada correctamente.` };
  }
}