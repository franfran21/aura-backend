import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password?: string) {
    const [users] = await this.usersService.findAll();
    let user = users.find(u => u.name === username || u.email === username);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = { username: user.name, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      system: 'AURAHEALTH+ HYBRID AI',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
