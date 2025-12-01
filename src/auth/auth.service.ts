import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'node_modules/bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterWithRolDto } from './dto/register-with-rol.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register({ contrasena, correo, nombre }: RegisterDto) {
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

    async registerWithRol(registerWithRolDto: RegisterWithRolDto) {
        
        const { nombre, correo, contrasena, rol, telefono, direccion } = registerWithRolDto;

        
        const user = await this.usersService.findOneByEmail(correo);

        if (user) {
            throw new BadRequestException('El email ya existe');
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await this.usersService.createwithrol({
            nombre,
            correo,
            contrasena: hashedPassword,
            rol,
            telefono,
            direccion,
        });

        return {
            message: 'Usuario con rol registrado exitosamente'
        };
    }

    async login({ correo, contrasena }: LoginDto) {

        const ADMIN_EMAIL = 'admin@tienda.com';
        const ADMIN_PASS = '123456';

        const VENDEDOR_EMAIL = 'juan@tienda.com';
        const VENDEDOR_PASS = '123456';

        if (correo === ADMIN_EMAIL) {
            if (contrasena !== ADMIN_PASS) {
                throw new UnauthorizedException('Contraseña de administrador incorrecta');
            }

            const payload = {
                sub: 1, 
                correo: ADMIN_EMAIL,
                nombre: 'Super Admin',
                rol: 'ADMIN' 
            };
            const token = await this.jwtService.signAsync(payload);

            return {
                access_token: token,
                correo: payload.correo,
                nombre: payload.nombre,
                rol: payload.rol,
            };
        }

        else if (correo === VENDEDOR_EMAIL) {
            if (contrasena !== VENDEDOR_PASS) {
                throw new UnauthorizedException('Contraseña de vendedor incorrecta');
            }

            const payload = {
                sub: 2, 
                correo: VENDEDOR_EMAIL,
                nombre: 'Vendedor de Prueba',
                rol: 'VENDEDOR'
            };
            const token = await this.jwtService.signAsync(payload);

            return {
                access_token: token,
                correo: payload.correo,
                nombre: payload.nombre,
                rol: payload.rol,
            };
        }

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
            nombre: user.nombre,
            rol: user.rol,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            correo: user.correo,
            nombre: user.nombre,
            rol: user.rol,
        };
    }
}
