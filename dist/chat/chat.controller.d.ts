import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(body: {
        message: string;
    }, req: any): Promise<{
        response: string;
        phase: string;
        timestamp: string;
    }>;
    clearHistory(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
