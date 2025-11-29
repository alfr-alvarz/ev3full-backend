import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
//import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //Post no está debido a que se hace en register.

    @Get()
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
    removeByEmail(@Param('correo') correo: string) {
        return this.usersService.removeByEmail(correo);
    }
}