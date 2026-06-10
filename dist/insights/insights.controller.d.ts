import { InsightsService } from './insights.service';
import { AiClient } from '../ai-engine/ai.client';
export declare class InsightsController {
    private readonly insightsService;
    private readonly aiClient;
    constructor(insightsService: InsightsService, aiClient: AiClient);
    getDaily(req: any, dateQuery?: string): Promise<{
        id: number;
        title: string;
        description: string;
        aiDiagnosis: string;
        date: Date;
    }>;
    generateDaily(req: any, dateQuery?: string): Promise<{
        id: number;
        title: string;
        description: string;
        aiDiagnosis: string;
        date: Date;
    }>;
    getHistory(req: any): Promise<{
        system: string;
        count: number;
        data: import("./insight.entity").Insight[];
    }>;
}
