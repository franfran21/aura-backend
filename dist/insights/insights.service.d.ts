import { Repository } from 'typeorm';
import { Insight } from './insight.entity';
import { MetricsService } from '../metrics/metrics.service';
import { CycleService } from '../cycle/cycle.service';
export declare class InsightsService {
    private readonly insightRepository;
    private readonly metricsService;
    private readonly cycleService;
    constructor(insightRepository: Repository<Insight>, metricsService: MetricsService, cycleService: CycleService);
    findDaily(userId: number, date: Date): Promise<Insight[]>;
    createInsight(metricsRaw: string, user: any, aiDiagnosis?: string, title?: string, description?: string): Promise<Insight>;
    findByUserId(userId: number): Promise<Insight[]>;
    getUserCycleContext(userId: number): Promise<{
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
}
