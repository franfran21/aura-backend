export declare class AiClient {
    private readonly SYSTEM_PROMPT;
    dispatchAnalysis(payload: string, phase?: string): Promise<string>;
    dispatchChat(contents: any[]): Promise<string>;
}
