import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
//import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //Post no está debido a que se hace en register.

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    /*
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }
        Posible implementación futura de edicion de usuario
    */
    @Delete(':correo')
    @Roles(Role.ADMIN)
    removeByEmail(@Param('correo') correo: string) {
        return this.usersService.removeByEmail(correo);
    }
}