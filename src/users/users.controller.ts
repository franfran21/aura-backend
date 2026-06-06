import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

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

  @UseGuards(AuthGuard)
  @Post('push-token')
  async updatePushToken(@Body() body: { token: string }, @Request() req) {
    const userId = req.user.sub;
    await this.usersService.updatePushToken(userId, body.token);
    return { success: true };
  }
}
