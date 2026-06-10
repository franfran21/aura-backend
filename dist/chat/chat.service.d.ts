import { AiClient } from '../ai-engine/ai.client';
import { CycleService } from '../cycle/cycle.service';
export declare class ChatService {
    private readonly aiClient;
    private readonly cycleService;
    constructor(aiClient: AiClient, cycleService: CycleService);
    private conversations;
    private readonly MAX_HISTORY;
    processMessage(userId: number, userMessage: string): Promise<{
        response: string;
        phase: string;
        timestamp: string;
    }>;
    private getOrCreateHistory;
    private trimHistory;
    clearHistory(userId: number): void;
}
