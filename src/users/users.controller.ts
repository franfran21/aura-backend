import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    const [users, count] = await this.usersService.findAll();
    return {
      system: 'AURAHEALTH+ HYBRID AI',
      count,
      data: users,
    };
  }
}