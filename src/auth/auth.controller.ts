import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() userData: any) {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return await this.usersService.create(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { username: string, password?: string }) {
    return await this.authService.login(body.username, body.password);
  }
}
