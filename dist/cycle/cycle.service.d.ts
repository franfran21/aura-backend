import { Repository } from 'typeorm';
import { Cycle } from './cycle.entity';
import { CycleLog } from './cycle-log.entity';
export declare class CycleService {
    private readonly cycleRepository;
    private readonly cycleLogRepository;
    constructor(cycleRepository: Repository<Cycle>, cycleLogRepository: Repository<CycleLog>);
    getCurrentCycle(userId: number): Promise<{
        id: number;
        lastPeriodDate: string;
        avgCycleLength: number;
        avgPeriodLength: number;
        currentDay: number;
        phase: string;
        ovulationDay: number;
        fertileWindow: {
            start: number;
            end: number;
        };
        nextPeriodDate: string;
    }>;
    getCalendarMonth(userId: number, year: number, month: number): Promise<{
        year: number;
        month: number;
        days: any[];
        cycleLength: number;
    }>;
    logDay(userId: number, data: {
        date: string;
        flow?: string;
        energy?: string;
        mood?: string;
        painLevel?: string;
        skin?: string;
        sleep?: string;
        symptoms?: string[];
        intercourse?: boolean;
        protected?: boolean;
        notes?: string;
    }): Promise<{
        success: boolean;
        id: number;
    }>;
    setPeriodDate(userId: number, data: {
        date: string;
    }): Promise<{
        success: boolean;
    }>;
    getStats(userId: number): Promise<{
        trackedDays: number;
        intercourseCount: number;
        avgEnergy: number;
        totalCycles: number;
    }>;
    logCycle(userId: number, data: {
        startDate: string;
        endDate?: string;
        symptoms?: string[];
        mood?: string;
        energy?: string;
        flow?: string;
        painLevel?: string;
        skin?: string;
        sleep?: string;
        intercourse?: boolean;
        protected?: boolean;
        notes?: string;
    }): Promise<{
        success: boolean;
        id: number;
    }>;
}
