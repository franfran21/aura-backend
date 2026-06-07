import { Controller, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('message')
  async sendMessage(@Body() body: { message: string }, @Request() req) {
    const userId = req.user.sub;
    return await this.chatService.processMessage(userId, body.message);
  }

  @UseGuards(AuthGuard)
  @Delete('history')
  async clearHistory(@Request() req) {
    const userId = req.user.sub;
    this.chatService.clearHistory(userId);
    return { success: true, message: 'Historial de chat borrado' };
  }
}
