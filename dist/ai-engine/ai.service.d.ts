import { AiClient } from './ai.client';
import { InsightsService } from '../insights/insights.service';
import { User } from '../users/user.entity';
export declare class AiService {
    private readonly aiClient;
    private readonly insightsService;
    constructor(aiClient: AiClient, insightsService: InsightsService);
    processMetricsAndSave(metrics: string, user: User): Promise<import("../insights/insight.entity").Insight>;
}
