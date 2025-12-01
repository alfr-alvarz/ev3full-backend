import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leemos qué roles requiere este endpoint (la etiqueta @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta NO tiene decorador @Roles es pública
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos el usuario de la request
    // Esto asume que el AuthGuard ya corrió y puso el 'user' en la request
    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario o no tiene propiedad rol, denegamos acceso
    if (!user || !user.rol) {
        return false; 
    }

    // 3. Verificamos: ¿El rol del usuario (string) está en la lista de requeridos?
    // user.rol es un string único (ej: "VENDEDOR")
    // requiredRoles es un array (ej: ["ADMIN", "VENDEDOR"])
    return requiredRoles.includes(user.rol);
  }
}