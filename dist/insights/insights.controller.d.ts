import { InsightsService } from './insights.service';
export declare class InsightsController {
    private readonly insightsService;
    constructor(insightsService: InsightsService);
    registerMetrics(body: {
        metricsRaw: string;
    }, req: any): Promise<import("./insight.entity").Insight>;
    getHistory(req: any): Promise<{
        system: string;
        count: number;
        data: import("./insight.entity").Insight[];
    }>;
}
