import { Repository } from 'typeorm';
import { Insight } from './insight.entity';
import { User } from '../users/user.entity';
import { MetricsService } from '../metrics/metrics.service';
import { CycleService } from '../cycle/cycle.service';
export declare class InsightsService {
    private readonly insightRepository;
    private readonly metricsService;
    private readonly cycleService;
    constructor(insightRepository: Repository<Insight>, metricsService: MetricsService, cycleService: CycleService);
    createInsight(metricsRaw: string, user: any, aiDiagnosis?: string): Promise<Insight>;
    findByUserId(userId: number): Promise<Insight[]>;
    getUserCycleContext(userId: number): Promise<{
        currentDay: number;
        phase: string;
        id: number;
        lastPeriodDate: Date;
        avgCycleLength: number;
        user: User;
    }>;
}
