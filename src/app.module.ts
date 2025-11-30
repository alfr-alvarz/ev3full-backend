import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { CategoriasModule } from './categorias/categorias.module';
import { Categoria } from './categorias/entities/categoria.entity';
import { VentasModule } from './ventas/ventas.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { DetalleVenta } from './detalle-venta/entities/detalle-venta.entity';
import { Venta } from './ventas/entities/venta.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3307'),
      username: process.env.DB_USERNAME || 'mysql',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Producto, Categoria, DetalleVenta, Venta],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductosModule,
    CategoriasModule,
    VentasModule,
    DetalleVentaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
