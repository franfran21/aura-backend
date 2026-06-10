"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const ai_client_1 = require("../ai-engine/ai.client");
const cycle_service_1 = require("../cycle/cycle.service");
let ChatService = class ChatService {
    constructor(aiClient, cycleService) {
        this.aiClient = aiClient;
        this.cycleService = cycleService;
        this.conversations = new Map();
        this.MAX_HISTORY = 10;
    }
    async processMessage(userId, userMessage) {
        const cycleData = await this.cycleService.getCurrentCycle(userId);
        let contextBlock = '';
        if (cycleData) {
            contextBlock = `
[CONTEXTO DEL CICLO DE LA USUARIA - NO MENCIONAR DIRECTAMENTE A MENOS QUE SEA RELEVANTE]
Día del ciclo: ${cycleData.currentDay} de ${cycleData.avgCycleLength}
Fase actual: ${cycleData.phase}
Último periodo: ${cycleData.lastPeriodDate}
Próxima ovulación estimada: día ${cycleData.ovulationDay} del ciclo
Próximo periodo estimado: ${cycleData.nextPeriodDate}
[FIN CONTEXTO]

Mensaje de la usuaria: ${userMessage}
`;
        }
        else {
            contextBlock = `
[La usuaria aún no ha registrado su ciclo. Si es relevante, puedes preguntarle amablemente.]

Mensaje de la usuaria: ${userMessage}
`;
        }
        const history = this.getOrCreateHistory(userId);
        const messageForAi = {
            role: 'user',
            parts: [{ text: contextBlock }]
        };
        history.push(messageForAi);
        const response = await this.aiClient.dispatchChat(history);
        history.push({
            role: 'model',
            parts: [{ text: response }]
        });
        this.trimHistory(userId);
        return {
            response,
            phase: (cycleData === null || cycleData === void 0 ? void 0 : cycleData.phase) || 'Desconocida',
            timestamp: new Date().toISOString()
        };
    }
    getOrCreateHistory(userId) {
        if (!this.conversations.has(userId)) {
            this.conversations.set(userId, []);
        }
        return this.conversations.get(userId);
    }
    trimHistory(userId) {
        const history = this.conversations.get(userId);
        if (history && history.length > this.MAX_HISTORY) {
            const first = history[0];
            const lastN = history.slice(-(this.MAX_HISTORY - 1));
            this.conversations.set(userId, [first, ...lastN]);
        }
    }
    clearHistory(userId) {
        this.conversations.delete(userId);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_client_1.AiClient,
        cycle_service_1.CycleService])
], ChatService);
//# sourceMappingURL=chat.service.js.map