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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_client_1 = require("./ai.client");
const insights_service_1 = require("../insights/insights.service");
let AiService = class AiService {
    constructor(aiClient, insightsService) {
        this.aiClient = aiClient;
        this.insightsService = insightsService;
    }
    async processMetricsAndSave(metrics, user) {
        const cycleInfo = await this.insightsService.getUserCycleContext(user.id);
        const aiReport = await this.aiClient.dispatchAnalysis(metrics, cycleInfo === null || cycleInfo === void 0 ? void 0 : cycleInfo.phase);
        return await this.insightsService.createInsight(metrics, user, aiReport);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_client_1.AiClient,
        insights_service_1.InsightsService])
], AiService);
//# sourceMappingURL=ai.service.js.map