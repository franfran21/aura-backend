import { Injectable } from '@nestjs/common';
import { AiClient } from './ai.client';
import { InsightsService } from '../insights/insights.service';
import { User } from '../users/user.entity';

@Injectable()
export class AiService {
  constructor(
    private readonly aiClient: AiClient,
    private readonly insightsService: InsightsService,
  ) {}

  async processMetricsAndSave(metrics: string, user: User) {
    const cycleInfo = await this.insightsService.getUserCycleContext(user.id);
    const aiReport = await this.aiClient.dispatchAnalysis(metrics, cycleInfo?.phase);
    return await this.insightsService.createInsight(metrics, user, aiReport);
  }
}
