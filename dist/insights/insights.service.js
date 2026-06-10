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
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const insight_entity_1 = require("./insight.entity");
const metrics_service_1 = require("../metrics/metrics.service");
const cycle_service_1 = require("../cycle/cycle.service");
let InsightsService = class InsightsService {
    constructor(insightRepository, metricsService, cycleService) {
        this.insightRepository = insightRepository;
        this.metricsService = metricsService;
        this.cycleService = cycleService;
    }
    async findDaily(userId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return await this.insightRepository.find({
            where: {
                user: { id: userId },
                createdAt: (0, typeorm_2.Between)(start, end)
            },
            order: { createdAt: 'DESC' },
        });
    }
    async createInsight(metricsRaw, user, aiDiagnosis, title, description) {
        const today = new Date();
        const metrics = await this.metricsService.getDailyMetrics(user.sub || user.id, today);
        const cycle = await this.cycleService.getCurrentCycle(user.sub || user.id);
        const newInsight = this.insightRepository.create({
            title: title || 'Análisis Diario',
            description: description || 'Basado en tus registros de hoy.',
            metricsRaw: metricsRaw || JSON.stringify(metrics),
            aiDiagnosis,
            user: { id: user.sub || user.id },
        });
        return await this.insightRepository.save(newInsight);
    }
    async findByUserId(userId) {
        return await this.insightRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async getUserCycleContext(userId) {
        return await this.cycleService.getCurrentCycle(userId);
    }
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(insight_entity_1.Insight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        metrics_service_1.MetricsService,
        cycle_service_1.CycleService])
], InsightsService);
//# sourceMappingURL=insights.service.js.map