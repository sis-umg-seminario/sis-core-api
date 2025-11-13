// src/modules/auth/controllers/auth.controller.ts

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller('/api/v1/auth')
export class AuthController {
  // -----------------------------
  // MOCK: Inicio de sesión
  // POST /api/v1/auth/login
  // Body:
  // {
  //   "usuario": "axel.veliz",
  //   "contrasena": "123456"
  // }
  // Regla mock: cualquier usuario con contrasena "123456" inicia sesión
  // -----------------------------
  // @Post('/login')
  // login(@Body() body: { usuario?: string; contrasena?: string }) {
  //   const usuario = (body?.usuario ?? '').trim();
  //   const contrasena = body?.contrasena ?? '';
  //   // Validaciones básicas de request
  //   if (!usuario || !contrasena) {
  //     throw new HttpException(
  //       {
  //         error: 'Bad Request',
  //         message: 'Los campos "usuario" y "contrasena" son requeridos',
  //         statusCode: HttpStatus.BAD_REQUEST,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   // Regla mock de autenticación
  //   if (contrasena !== '123456') {
  //     throw new HttpException(
  //       {
  //         error: 'Unauthorized',
  //         message: 'Credenciales inválidas',
  //         statusCode: HttpStatus.UNAUTHORIZED,
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   // Datos mock del usuario autenticado
  //   const usuarioMock = {
  //     id: 2001,
  //     nombre: 'Axel Mauricio Véliz Poom',
  //     correo: 'axel.veliz@umg.edu.gt',
  //     programa: 'Ingeniería de Sistemas',
  //     roles: ['STUDENT'], // Ej: ADMIN, TEACHER, STUDENT
  //   };
  //   // Tokens mock (strings fijos). En real, aquí iría JWT/exp dinámica.
  //   const token = 'mock-token-umg-abc123';
  //   const refreshToken = 'mock-refresh-xyz789';
  //   const expiraEnSegundos = 7200; // 2 horas
  //   return {
  //     autenticado: true,
  //     token,
  //     tipoToken: 'Bearer',
  //     expiraEnSegundos,
  //     refreshToken,
  //     usuario: usuarioMock,
  //   };
  // }
  // -----------------------------
  // MOCK: Cambio de contraseña
  // POST /api/v1/auth/change-password
  // Body:
  // {
  //   "usuario": "axel.veliz",
  //   "contrasenaActual": "123456",
  //   "nuevaContrasena": "NuevaClave2025",
  //   "confirmarContrasena": "NuevaClave2025"
  // }
  // Reglas mock:
  //  - contrasenaActual debe ser "123456"
  //  - nuevaContrasena debe cumplir criterios mínimos y coincidir con confirmarContrasena
  // -----------------------------
  // @Post('/change-password')
  // changePassword(
  //   @Body()
  //   body: {
  //     usuario?: string;
  //     contrasenaActual?: string;
  //     nuevaContrasena?: string;
  //     confirmarContrasena?: string;
  //   },
  // ) {
  //   const usuario = (body?.usuario ?? '').trim();
  //   const contrasenaActual = body?.contrasenaActual ?? '';
  //   const nuevaContrasena = body?.nuevaContrasena ?? '';
  //   const confirmarContrasena = body?.confirmarContrasena ?? '';
  //   // Validaciones básicas
  //   if (
  //     !usuario ||
  //     !contrasenaActual ||
  //     !nuevaContrasena ||
  //     !confirmarContrasena
  //   ) {
  //     throw new HttpException(
  //       {
  //         error: 'Bad Request',
  //         message:
  //           'Los campos "usuario", "contrasenaActual", "nuevaContrasena" y "confirmarContrasena" son requeridos',
  //         statusCode: HttpStatus.BAD_REQUEST,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   // Validar contraseña actual (mock)
  //   if (contrasenaActual !== '123456') {
  //     throw new HttpException(
  //       {
  //         error: 'Unauthorized',
  //         message: 'La contraseña actual es incorrecta',
  //         statusCode: HttpStatus.UNAUTHORIZED,
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   // Validar coincidencia
  //   if (nuevaContrasena !== confirmarContrasena) {
  //     throw new HttpException(
  //       {
  //         error: 'Bad Request',
  //         message: 'La nueva contraseña y la confirmación no coinciden',
  //         statusCode: HttpStatus.BAD_REQUEST,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   // Validar reglas mínimas de complejidad (mock):
  //   //  - al menos 8 caracteres
  //   //  - contiene letras y números
  //   //  - distinta a la contraseña actual
  //   const tieneLongitudValida = nuevaContrasena.length >= 8;
  //   const tieneLetra = /[A-Za-z]/.test(nuevaContrasena);
  //   const tieneNumero = /[0-9]/.test(nuevaContrasena);
  //   const esDistinta = nuevaContrasena !== contrasenaActual;
  //   if (!tieneLongitudValida || !tieneLetra || !tieneNumero || !esDistinta) {
  //     throw new HttpException(
  //       {
  //         error: 'Bad Request',
  //         message:
  //           'La nueva contraseña debe tener al menos 8 caracteres, incluir letras y números, y ser distinta a la contraseña actual',
  //         statusCode: HttpStatus.BAD_REQUEST,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   // Respuesta mock de éxito
  //   return {
  //     actualizado: true,
  //     mensaje: 'Contraseña actualizada correctamente',
  //     usuario: {
  //       id: 2001,
  //       nombre: 'Axel Mauricio Véliz Poom',
  //       correo: 'axel.veliz@umg.edu.gt',
  //     },
  //     fecha: new Date().toISOString(),
  //   };
  // }
}
