import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }, // Asegúrate que expiresIn exista en tu archivo de constantes
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PassportModule
  ],
  exports: [AuthService],
})
export class AuthModule {}
