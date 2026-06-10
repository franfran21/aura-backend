import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CycleModule } from '../cycle/cycle.module';
import { AiModule } from '../ai-engine/ai.module';

@Module({
  imports: [CycleModule, AiModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
