import { AiClient } from './ai.client';
interface HormonalInsightPayload {
    metrics: any;
    cycle: any | null;
    date: Date;
}
export declare class AiService {
    private readonly aiClient;
    constructor(aiClient: AiClient);
    generateHormonalInsight(payload: HormonalInsightPayload): Promise<{
        title: string;
        description: string;
    }>;
}
export {};
