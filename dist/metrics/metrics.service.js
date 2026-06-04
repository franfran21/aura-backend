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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const metric_entity_1 = require("./metric.entity");
let MetricsService = class MetricsService {
    constructor(metricRepository) {
        this.metricRepository = metricRepository;
    }
    async saveMetrics(userId, data) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const existing = await this.metricRepository.findOne({
            where: { user: { id: userId }, date: (0, typeorm_2.Between)(start, end) }
        });
        if (existing) {
            Object.assign(existing, data);
            return this.metricRepository.save(existing);
        }
        const metric = this.metricRepository.create(Object.assign(Object.assign({}, data), { user: { id: userId } }));
        return this.metricRepository.save(metric);
    }
    async getDailyMetrics(userId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return this.metricRepository.findOne({
            where: { user: { id: userId }, date: (0, typeorm_2.Between)(start, end) }
        });
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(metric_entity_1.Metric)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map