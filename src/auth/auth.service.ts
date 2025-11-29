import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'node_modules/bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async register({ contrasena, correo, nombre}: RegisterDto) {
        const user = await this.usersService.findOneByEmail(correo);

        if (user) {
            throw new BadRequestException('El email ya existe');
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await this.usersService.create({
            nombre,
            correo,
            contrasena: hashedPassword,
        });

        return {
            message: 'Usuario creado exitosamente'
        };
    }

    async login ({ correo, contrasena}: LoginDto){
        const user = await this.usersService.findOneByEmail(correo);

        if (!user) {
            throw new UnauthorizedException('Correo inválido');
        }

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña inválida');
        }

        const payload = {
            sub: user.id,
            correo: user.correo,
            nombre: user.nombre
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            correo: user.correo,
            nombre: user.nombre
        };
    }
}
