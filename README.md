# sis-core-api

## Descripción

Servicio que conecta el **sis-ui** con los distintos módulos que conectan con los datos almacenados en **PostgreSQL**.

Este proyecto utiliza **NestJS**, para más información sobre el framework consultar la [documentación oficial](https://docs.nestjs.com/).

---

## Correr el proyecto localmente

## Requisitos

Se deben tener instalados los siguientes programas:

- NestJS
- Docker
- docker-compose
- NodeJS
- DBeaver, PGAdmin4 o algún otro editor de SQL.

## Pasos

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/sis-umg-seminario/sis-core-api
   ```

2. Instalar las librerías (solo la primera vez):

   ```bash
   npm install
   ```

3. Crear las variables de entorno:

   ```bash
   cp .env.example .env
   ```

4. Levantar Postgres con docker:

   ```bash
   docker-compose up
   ```

5. Ejecutar las migraciones de TypeORM (solo la primera vez o cada vez que se hacen cambios a las entidades de TypeORM):

   ```bash
   npm run migration:run
   ```

6. Cargar datos de prueba:

   ```bash
   npm run seed
   ```

7. Ejecutar el proyecto:
   ```bash
   npm run start:dev
   ```

---

# Estructura del proyecto

```
/src
  /common
  /config
  /migrations
  /modules
    /{module-name}/
      /controllers
      /dtos
      /services
      /entities
      /tests
/test
```

---

# Variables de entorno

Las variables de entorno se deben agregar en el archivo `.env`.

Para poder accederlas desde la aplicación se debe usar el servicio `ConfigService` de **NestJS**:

```typescript
export class ExampleClass {
  constructor(private configService: ConfigService) {}

  myFunc() {
    this.configService.get('MY_ENV_NAME');
  }
}
```

---

# TypeORM

## Migrations

**Migrations** es una herramienta que nos permite hacer cambios en la base de datos manteniendo un historial.  
Dado que estamos usando un ORM, debemos mantener un histórico de todos los cambios que se realizan para que, en caso de un comportamiento inesperado, podamos revertir los cambios en PostgreSQL sin problema.

### Generar una migración

```bash
npm run migration:generate src/migrations/{nombre-de-la-migracion}
```

### Ejecutar la migración

```bash
npm run migration:run
```

---

## Entidades

Una **entidad** es la representación de una tabla.  
¿Cómo identificarlas en el código?  
Son todos los archivos que terminan en `.entity.ts`.  
Ahí se definen las propiedades que contiene una tabla: campos, esquema, relaciones, etc.

### ¿Qué hacer cuando se hacen modificaciones a las entidades?

Cuando se hacen modificaciones se debe generar una **migration** para que quede historial y se pueda modificar la estructura de la base de datos desde el código.
