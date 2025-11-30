import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @ApiBearerAuth() //Para que aparezca el candado en Swagger
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Request() req) {
        return req.user;
    }

}
