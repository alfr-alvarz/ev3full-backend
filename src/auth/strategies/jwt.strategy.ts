import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants/jwt.constants'; // Asegúrate de importar tu secret

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Busca el token en el Header 'Authorization: Bearer ...'
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // Lo que se retorna aquí se inyectará en 'req.user' automáticamente
    return {
        id: payload.sub,
        correo: payload.correo, 
        nombre: payload.nombre,
        rol: payload.rol
    };
  }
}