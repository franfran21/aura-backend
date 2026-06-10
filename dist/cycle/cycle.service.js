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
exports.CycleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cycle_entity_1 = require("./cycle.entity");
const cycle_log_entity_1 = require("./cycle-log.entity");
let CycleService = class CycleService {
    constructor(cycleRepository, cycleLogRepository) {
        this.cycleRepository = cycleRepository;
        this.cycleLogRepository = cycleLogRepository;
    }
    async getCurrentCycle(userId) {
        const cycle = await this.cycleRepository.findOne({
            where: { user: { id: userId } },
            order: { lastPeriodDate: 'DESC' },
        });
        if (!cycle)
            return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastPeriod = new Date(cycle.lastPeriodDate);
        lastPeriod.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - lastPeriod.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        let phase = 'Folicular';
        if (diffDays <= cycle.avgPeriodLength)
            phase = 'Menstrual';
        else if (diffDays > cycle.avgCycleLength - 7 && diffDays <= cycle.avgCycleLength)
            phase = 'Lútea';
        else if (diffDays >= 11 && diffDays <= 16)
            phase = 'Ovulatoria';
        const ovulationDay = cycle.avgCycleLength - 14;
        const fertileStart = Math.max(1, ovulationDay - 5);
        const fertileEnd = Math.min(cycle.avgCycleLength, ovulationDay + 1);
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(lastPeriod.getDate() + cycle.avgCycleLength);
        return {
            id: cycle.id,
            lastPeriodDate: cycle.lastPeriodDate,
            avgCycleLength: cycle.avgCycleLength,
            avgPeriodLength: cycle.avgPeriodLength,
            currentDay: diffDays,
            phase,
            ovulationDay,
            fertileWindow: { start: fertileStart, end: fertileEnd },
            nextPeriodDate: nextPeriod.toISOString().split('T')[0],
        };
    }
    async getCalendarMonth(userId, year, month) {
        var _a, _b;
        const cycle = await this.cycleRepository.findOne({
            where: { user: { id: userId } },
            order: { lastPeriodDate: 'DESC' },
        });
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${daysInMonth}`;
        const logs = await this.cycleLogRepository.find({
            where: { user: { id: userId }, date: (0, typeorm_2.Between)(startStr, endStr) },
        });
        const logMap = new Map(logs.map(l => [l.date, l]));
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const log = logMap.get(dateStr);
            let phase = 'normal';
            let isPeriod = false;
            let isFertile = false;
            let isOvulation = false;
            if (cycle) {
                const d1 = new Date(dateStr);
                d1.setHours(0, 0, 0, 0);
                const d2 = new Date(cycle.lastPeriodDate);
                d2.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                if (diffDays >= 1 && diffDays <= cycle.avgPeriodLength) {
                    phase = 'menstruacion';
                    isPeriod = true;
                }
                const ovulationDay = cycle.avgCycleLength - 14;
                if (diffDays >= 11 && diffDays <= 16) {
                    isFertile = true;
                    if (diffDays === ovulationDay) {
                        phase = 'ovulacion';
                        isOvulation = true;
                    }
                    else {
                        phase = 'fertil';
                    }
                }
                else if (diffDays > cycle.avgCycleLength - 7 && diffDays <= cycle.avgCycleLength) {
                    phase = 'lutea';
                }
                else if (diffDays > cycle.avgPeriodLength && diffDays < 11) {
                    phase = 'folicular';
                }
            }
            days.push({
                date: dateStr,
                day,
                phase,
                isPeriod,
                isFertile,
                isOvulation,
                energy: (log === null || log === void 0 ? void 0 : log.energy) || null,
                flow: (log === null || log === void 0 ? void 0 : log.flow) || null,
                mood: (log === null || log === void 0 ? void 0 : log.mood) || null,
                symptoms: (log === null || log === void 0 ? void 0 : log.symptoms) ? log.symptoms.split(',').map(s => s.trim()) : [],
                intercourse: (_a = log === null || log === void 0 ? void 0 : log.intercourse) !== null && _a !== void 0 ? _a : null,
                protected: (_b = log === null || log === void 0 ? void 0 : log.protected) !== null && _b !== void 0 ? _b : null,
                notes: (log === null || log === void 0 ? void 0 : log.notes) || null,
            });
        }
        return { year, month, days, cycleLength: (cycle === null || cycle === void 0 ? void 0 : cycle.avgCycleLength) || 28 };
    }
    async logDay(userId, data) {
        var _a;
        const existing = await this.cycleLogRepository.findOne({
            where: { user: { id: userId }, date: data.date },
        });
        if (existing) {
            if (data.flow !== undefined)
                existing.flow = data.flow;
            if (data.energy !== undefined)
                existing.energy = data.energy;
            if (data.mood !== undefined)
                existing.mood = data.mood;
            if (data.painLevel !== undefined)
                existing.painLevel = data.painLevel;
            if (data.skin !== undefined)
                existing.skin = data.skin;
            if (data.sleep !== undefined)
                existing.sleep = data.sleep;
            if (data.symptoms !== undefined)
                existing.symptoms = data.symptoms ? data.symptoms.join(', ') : existing.symptoms;
            if (data.intercourse !== undefined)
                existing.intercourse = data.intercourse;
            if (data.protected !== undefined)
                existing.protected = data.protected;
            if (data.notes !== undefined)
                existing.notes = data.notes;
            await this.cycleLogRepository.save(existing);
            return { success: true, id: existing.id };
        }
        const log = this.cycleLogRepository.create({
            date: data.date,
            flow: data.flow,
            energy: data.energy,
            mood: data.mood,
            painLevel: data.painLevel,
            skin: data.skin,
            sleep: data.sleep,
            symptoms: (_a = data.symptoms) === null || _a === void 0 ? void 0 : _a.join(', '),
            intercourse: data.intercourse,
            protected: data.protected,
            notes: data.notes,
            user: { id: userId },
        });
        await this.cycleLogRepository.save(log);
        return { success: true, id: log.id };
    }
    async setPeriodDate(userId, data) {
        const user = { id: userId };
        const existing = await this.cycleRepository.findOne({
            where: { user },
            order: { lastPeriodDate: 'DESC' },
        });
        if (existing) {
            existing.lastPeriodDate = data.date;
            await this.cycleRepository.save(existing);
        }
        else {
            const newCycle = this.cycleRepository.create({ lastPeriodDate: data.date, user });
            await this.cycleRepository.save(newCycle);
        }
        const cycle = await this.getCurrentCycle(userId);
        for (let i = 0; i < ((cycle === null || cycle === void 0 ? void 0 : cycle.avgPeriodLength) || 5); i++) {
            const d = new Date(data.date);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const existingLog = await this.cycleLogRepository.findOne({
                where: { user: { id: userId }, date: dateStr },
            });
            if (!existingLog) {
                const log = this.cycleLogRepository.create({
                    date: dateStr,
                    flow: i === 0 ? 'fuerte' : i <= 2 ? 'moderado' : 'leve',
                    user: { id: userId },
                });
                await this.cycleLogRepository.save(log);
            }
        }
        return { success: true };
    }
    async getStats(userId) {
        const cycles = await this.cycleRepository.find({
            where: { user: { id: userId } },
            order: { lastPeriodDate: 'DESC' },
        });
        const logs = await this.cycleLogRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
            take: 30,
        });
        const intercourseCount = logs.filter(l => l.intercourse).length;
        const avgEnergy = logs.filter(l => l.energy).reduce((acc, l) => {
            const val = l.energy === 'alta' ? 3 : l.energy === 'media' ? 2 : 1;
            return acc + val;
        }, 0) / Math.max(1, logs.filter(l => l.energy).length);
        return {
            trackedDays: logs.length,
            intercourseCount,
            avgEnergy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : 0,
            totalCycles: cycles.length,
        };
    }
    async logCycle(userId, data) {
        await this.setPeriodDate(userId, { date: data.startDate });
        return await this.logDay(userId, {
            date: data.startDate,
            flow: data.flow,
            energy: data.energy,
            mood: data.mood,
            painLevel: data.painLevel,
            skin: data.skin,
            sleep: data.sleep,
            symptoms: data.symptoms,
            intercourse: data.intercourse,
            protected: data.protected,
            notes: data.notes,
        });
    }
};
exports.CycleService = CycleService;
exports.CycleService = CycleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cycle_entity_1.Cycle)),
    __param(1, (0, typeorm_1.InjectRepository)(cycle_log_entity_1.CycleLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CycleService);
//# sourceMappingURL=cycle.service.js.map