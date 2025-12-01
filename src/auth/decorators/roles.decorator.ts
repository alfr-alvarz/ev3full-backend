import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// llave para leer metadata despues
export const ROLES_KEY = 'roles';

// decorador recibe una lista de roles permitidos.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);