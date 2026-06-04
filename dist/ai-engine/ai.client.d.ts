export declare class AiClient {
    private readonly ollamaUrl;
    private readonly modelName;
    dispatchAnalysis(payload: string, phase?: string): Promise<string>;
}
