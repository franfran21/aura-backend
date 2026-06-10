import { CycleService } from './cycle.service';
export declare class CycleController {
    private readonly cycleService;
    constructor(cycleService: CycleService);
    logCycleData(body: {
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
    }, req: any): Promise<{
        success: boolean;
        id: number;
    }>;
    getCurrentCycle(req: any): Promise<{
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
    getCalendar(year: number, month: number, req: any): Promise<{
        year: number;
        month: number;
        days: any[];
        cycleLength: number;
    }>;
    logDay(body: {
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
    }, req: any): Promise<{
        success: boolean;
        id: number;
    }>;
    setPeriodDate(body: {
        date: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
    getStats(req: any): Promise<{
        trackedDays: number;
        intercourseCount: number;
        avgEnergy: number;
        totalCycles: number;
    }>;
}
