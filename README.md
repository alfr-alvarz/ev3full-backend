## Indicaciones del proyecto
Link del Front-end: https://github.com/fernandocamus/ev3full-frontend/

Base de Datos hecha en XAMPP con MySQL. Utilizando el puerto 3306. Se conecta a test.

Este backend tiene como url http://localhost:8080/

Incluye Swagger para ver los distintos endpoints, y posee dos roles ('ADMIN' y 'VENDEDOR') para definir autorizaciones en los endpoints.


## Instalación del proyecto

```
# Instalar CLI de NestJS de forma global
$ npm install -g @nestjs/cli

#Verificar instalación
$ nest --version

#Creado proyecto en carpeta actual
$ nest new .

#Dependencias para conectar con MySQL
$ npm install --save @nestjs/typeorm typeorm mysql2

#Modulo de configuración
$ npm install @nestjs/config

#Instalaciones para JWT
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install --save-dev @types/passport-jwt
npm install bcryptjs

#Instalación de validadores
npm install class-validator class-transformer

#Instalación del Swagger
npm install --save @nestjs/swagger swagger-ui-express

```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

You can run just the sales `VentasService` unit test (this project includes a test which asserts that
`detalle.precio_unitario_con_iva` is computed and persisted when creating a venta):

```bash
npx jest src/ventas/ventas.service.spec.ts -i
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
