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
  //   "username": "axel.veliz",
  //   "password": "123456"
  // }
  // Regla mock: cualquier usuario con contrasena "123456" inicia sesión
  // -----------------------------
  @Post('/login')
  login(@Body() body: { username?: string; password?: string }) {
    const username = (body?.username ?? '').trim();
    const password = body?.password ?? '';

    // Validaciones básicas de request
    if (!username || !password) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message: 'Los campos "username" y "password" son requeridos',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Regla mock de autenticación
    if (password !== '123456') {
      throw new HttpException(
        {
          error: 'Unauthorized',
          message: 'Credenciales inválidas',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Datos mock del usuario autenticado
    const userMock = {
      id: 2001,
      name: 'Axel Mauricio Véliz Poom',
      email: 'axel.veliz@umg.edu.gt',
      program: 'Ingeniería de Sistemas',
      roles: ['STUDENT'], // Ej: ADMIN, TEACHER, STUDENT
    };

    // Tokens mock (strings fijos). En real, aquí iría JWT/exp dinámica.
    const token = 'mock-token-umg-abc123';
    const refreshToken = 'mock-refresh-xyz789';
    const expiresInSeconds = 7200; // 2 horas

    return {
      authenticated: true,
      token,
      tokenType: 'Bearer',
      expiresInSeconds,
      refreshToken,
      user: userMock,
    };
  }

  // -----------------------------
  // MOCK: Cambio de contraseña
  // POST /api/v1/auth/change-password
  // Body:
  // {
  //   "username": "axel.veliz",
  //   "currentPassword": "123456",
  //   "newPassword": "NuevaClave2025",
  //   "confirmPassword": "NuevaClave2025"
  // }
  // Reglas mock:
  //  - contrasenaActual debe ser "123456"
  //  - nuevaContrasena debe cumplir criterios mínimos y coincidir con confirmarContrasena
  // -----------------------------
  @Post('/change-password')
  changePassword(
    @Body()
    body: {
      username?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    },
  ) {
    const username = (body?.username ?? '').trim();
    const currentPassword = body?.currentPassword ?? '';
    const newPassword = body?.newPassword ?? '';
    const confirmPassword = body?.confirmPassword ?? '';

    // Validaciones básicas
    if (!username || !currentPassword || !newPassword || !confirmPassword) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message:
            'Los campos "username", "currentPassword", "newPassword" y "confirmPassword" son requeridos',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar contraseña actual (mock)
    if (currentPassword !== '123456') {
      throw new HttpException(
        {
          error: 'Unauthorized',
          message: 'La contraseña actual es incorrecta',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Validar coincidencia
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message: 'La nueva contraseña y la confirmación no coinciden',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar reglas mínimas de complejidad (mock):
    //  - al menos 8 caracteres
    //  - contiene letras y números
    //  - distinta a la contraseña actual
    const hasValidLength = newPassword.length >= 8;
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const isDifferent = newPassword !== currentPassword;

    if (!hasValidLength || !hasLetter || !hasNumber || !isDifferent) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message:
            'La nueva contraseña debe tener al menos 8 caracteres, incluir letras y números, y ser distinta a la contraseña actual',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Respuesta mock de éxito
    return {
      updated: true,
      message: 'Contraseña actualizada correctamente',
      user: {
        id: 2001,
        name: 'Axel Mauricio Véliz Poom',
        email: 'axel.veliz@umg.edu.gt',
      },
      date: new Date().toISOString(),
    };
  }
}
