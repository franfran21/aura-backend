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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsController = void 0;
const common_1 = require("@nestjs/common");
const insights_service_1 = require("./insights.service");
const auth_guard_1 = require("../auth/auth.guard");
const ai_client_1 = require("../ai-engine/ai.client");
let InsightsController = class InsightsController {
    constructor(insightsService, aiClient) {
        this.insightsService = insightsService;
        this.aiClient = aiClient;
    }
    async getDaily(req, dateQuery) {
        const userId = req.user.sub;
        const date = dateQuery ? new Date(dateQuery) : new Date();
        let insights = await this.insightsService.findDaily(userId, date);
        if (insights.length === 0) {
            return await this.generateDaily(req, dateQuery);
        }
        return {
            id: insights[0].id,
            title: insights[0].title,
            description: insights[0].description,
            aiDiagnosis: insights[0].aiDiagnosis,
            date: insights[0].createdAt,
        };
    }
    async generateDaily(req, dateQuery) {
        const userPayload = req.user;
        const context = await this.insightsService.getUserCycleContext(userPayload.sub);
        const contextPrompt = `Genera un insight de salud para hoy en un tono empático y profesional como Luna. La usuaria está en el día ${(context === null || context === void 0 ? void 0 : context.currentDay) || 'desconocido'} de su ciclo, fase: ${(context === null || context === void 0 ? void 0 : context.phase) || 'desconocida'}.`;
        const diagnosis = await this.aiClient.dispatchAnalysis(contextPrompt, context === null || context === void 0 ? void 0 : context.phase);
        const title = `Insight: Fase ${(context === null || context === void 0 ? void 0 : context.phase) || 'Actual'}`;
        const description = `Día ${(context === null || context === void 0 ? void 0 : context.currentDay) || 'X'} · Análisis Hormonal Luna`;
        const insight = await this.insightsService.createInsight('', userPayload, diagnosis, title, description);
        return {
            id: insight.id,
            title: insight.title,
            description: insight.description,
            aiDiagnosis: insight.aiDiagnosis,
            date: insight.createdAt,
        };
    }
    async getHistory(req) {
        const userId = req.user.sub;
        const records = await this.insightsService.findByUserId(userId);
        return {
            system: 'AURAHEALTH+ LUNA AI',
            count: records.length,
            data: records,
        };
    }
};
exports.InsightsController = InsightsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('daily'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InsightsController.prototype, "getDaily", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('daily/generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InsightsController.prototype, "generateDaily", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsightsController.prototype, "getHistory", null);
exports.InsightsController = InsightsController = __decorate([
    (0, common_1.Controller)('insights'),
    __metadata("design:paramtypes", [insights_service_1.InsightsService,
        ai_client_1.AiClient])
], InsightsController);
//# sourceMappingURL=insights.controller.js.map