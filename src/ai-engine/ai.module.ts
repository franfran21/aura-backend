import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiClient } from './ai.client';
import { InsightsModule } from '../insights/insights.module';

@Module({
  imports: [InsightsModule],
  providers: [AiService, AiClient],
  exports: [AiService],
})
export class AiModule {}
