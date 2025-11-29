import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto){
        return await this.usersRepository.save(createUserDto);
    }

    async findOneByEmail(correo: string) {
        return await this.usersRepository.findOneBy({ correo });
    }

    async findOneById(id: number) {
        return await this.usersRepository.findOneBy({ id });
    }

    async findAll() {
        return await this.usersRepository.find();
    }
    
    async removeByEmail(correo: string) {
        return await this.usersRepository.delete({ correo });
    }
}
