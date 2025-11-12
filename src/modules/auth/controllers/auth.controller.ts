import { LoginRequestDto } from '@auth/dtos/login-request.dto';
import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() request: LoginRequestDto) {
    return this.authService.login(request.email, request.password);
  }

  @Post('/refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
