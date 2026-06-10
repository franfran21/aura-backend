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
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const cycle_service_1 = require("../cycle/cycle.service");
const auth_guard_1 = require("../auth/auth.guard");
let MetricsController = class MetricsController {
    constructor(metricsService, cycleService) {
        this.metricsService = metricsService;
        this.cycleService = cycleService;
    }
    async getPredictions(req) {
        const userId = req.user.sub;
        const cycle = await this.cycleService.getCurrentCycle(userId);
        const stats = await this.cycleService.getStats(userId);
        const totalCycles = stats.totalCycles;
        if (!cycle) {
            return {
                energyLevel: 50,
                factors: [
                    { label: 'Estrógeno', value: 'Pendiente de registro', color: '#F2C4D0' },
                    { label: 'Progesterona', value: 'Pendiente de registro', color: '#534AB7' },
                    { label: 'Fase', value: 'Desconocida', color: '#8B2252' }
                ],
                recommendation: 'Registra tu último periodo para que Luna pueda predecir tus niveles hormonales.',
                nextPeriodDate: 'Pendiente',
                ovulationWindow: 'Pendiente',
                highEnergyDays: 'Pendiente',
                pregnancyProbability: 'Desconocida',
                hasEnoughData: false,
                cyclesRegistered: 0
            };
        }
        let energy = 50;
        let factors = [];
        let recommendation = '';
        if (cycle.phase === 'Menstrual') {
            energy = 30;
            factors = [
                { label: 'Estrógeno', value: 'Nivel bajo', color: '#F2C4D0' },
                { label: 'Progesterona', value: 'Nivel bajo', color: '#534AB7' },
                { label: 'Hierro', value: 'Necesidad alta', color: '#8B2252' }
            ];
            recommendation = 'Tu cuerpo está en modo limpieza. Prioriza el descanso profundo y alimentos ricos en hierro.';
        }
        else if (cycle.phase === 'Folicular') {
            energy = 70;
            factors = [
                { label: 'Estrógeno', value: 'En ascenso', color: '#F2C4D0' },
                { label: 'Testosterona', value: 'Subiendo', color: '#8B2252' },
                { label: 'Energía', value: 'Alta', color: '#4CAF50' }
            ];
            recommendation = 'Tus estrógenos están subiendo. Es el mejor momento para iniciar proyectos y actividad física intensa.';
        }
        else if (cycle.phase === 'Ovulatoria') {
            energy = 95;
            factors = [
                { label: 'Estrógeno', value: 'Pico máximo', color: '#F2C4D0' },
                { label: 'LH', value: 'Pico de ovulación', color: '#8B2252' },
                { label: 'Libido', value: 'Muy alta', color: '#C0527A' }
            ];
            recommendation = 'Estás en tu punto máximo de energía y sociabilidad. ¡Aprovéchalo!';
        }
        else {
            energy = 55;
            factors = [
                { label: 'Progesterona', value: 'Pico máximo', color: '#534AB7' },
                { label: 'Estrógeno', value: 'En descenso', color: '#F2C4D0' },
                { label: 'Metabolismo', value: 'Acelerado', color: '#FF9800' }
            ];
            recommendation = 'La progesterona domina. Es normal sentir más hambre y necesidad de calma. Escucha a tu cuerpo.';
        }
        const nextPeriodDate = cycle.nextPeriodDate;
        const lastPeriod = new Date(cycle.lastPeriodDate);
        let targetPeriod = new Date(lastPeriod);
        if (cycle.currentDay > cycle.fertileWindow.end) {
            targetPeriod.setDate(lastPeriod.getDate() + cycle.avgCycleLength);
        }
        const fertileStart = new Date(targetPeriod);
        fertileStart.setDate(targetPeriod.getDate() + cycle.fertileWindow.start - 1);
        const fertileEnd = new Date(targetPeriod);
        fertileEnd.setDate(targetPeriod.getDate() + cycle.fertileWindow.end - 1);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const formatCustomDate = (d) => `${d.getDate()} de ${months[d.getMonth()]}`;
        const ovulationWindow = `${formatCustomDate(fertileStart)} - ${formatCustomDate(fertileEnd)}`;
        const highEnergyDays = 'Días 6 al 16 de tu ciclo';
        let pregnancyProbability = 'Baja';
        const currentDay = cycle.currentDay;
        if (currentDay >= cycle.fertileWindow.start && currentDay <= cycle.fertileWindow.end) {
            pregnancyProbability = 'Alta';
        }
        else if (Math.abs(currentDay - cycle.fertileWindow.start) <= 2 ||
            Math.abs(currentDay - cycle.fertileWindow.end) <= 2) {
            pregnancyProbability = 'Media';
        }
        const hasEnoughData = totalCycles >= 2;
        return {
            energyLevel: energy,
            factors,
            recommendation,
            phase: cycle.phase,
            currentDay: cycle.currentDay,
            nextPeriodDate,
            ovulationWindow,
            highEnergyDays,
            pregnancyProbability,
            hasEnoughData,
            cyclesRegistered: totalCycles
        };
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('predictions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getPredictions", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)('metrics'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService,
        cycle_service_1.CycleService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map