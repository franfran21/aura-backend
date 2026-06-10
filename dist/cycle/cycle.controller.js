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
exports.CycleController = void 0;
const common_1 = require("@nestjs/common");
const cycle_service_1 = require("./cycle.service");
const auth_guard_1 = require("../auth/auth.guard");
let CycleController = class CycleController {
    constructor(cycleService) {
        this.cycleService = cycleService;
    }
    async logCycleData(body, req) {
        const userId = req.user.sub;
        return await this.cycleService.logCycle(userId, body);
    }
    async getCurrentCycle(req) {
        const userId = req.user.sub;
        return await this.cycleService.getCurrentCycle(userId);
    }
    async getCalendar(year, month, req) {
        const userId = req.user.sub;
        return await this.cycleService.getCalendarMonth(userId, +year, +month);
    }
    async logDay(body, req) {
        const userId = req.user.sub;
        return await this.cycleService.logDay(userId, body);
    }
    async setPeriodDate(body, req) {
        const userId = req.user.sub;
        return await this.cycleService.setPeriodDate(userId, body);
    }
    async getStats(req) {
        const userId = req.user.sub;
        return await this.cycleService.getStats(userId);
    }
};
exports.CycleController = CycleController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "logCycleData", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "getCurrentCycle", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('calendar'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "getCalendar", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('day'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "logDay", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('period'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "setPeriodDate", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CycleController.prototype, "getStats", null);
exports.CycleController = CycleController = __decorate([
    (0, common_1.Controller)('cycle'),
    __metadata("design:paramtypes", [cycle_service_1.CycleService])
], CycleController);
//# sourceMappingURL=cycle.controller.js.map