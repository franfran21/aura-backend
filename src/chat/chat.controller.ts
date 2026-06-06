import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CycleService } from '../cycle/cycle.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cycleService: CycleService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('message')
  async sendMessage(@Body() body: { message: string }, @Request() req) {
    const userId = req.user.sub;
    const cycle = await this.cycleService.getCurrentCycle(userId);
    return await this.chatService.processMessage(userId, body.message, cycle?.phase);
  }
}
