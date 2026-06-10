import { MetricsService } from './metrics.service';
import { CycleService } from '../cycle/cycle.service';
export declare class MetricsController {
    private readonly metricsService;
    private readonly cycleService;
    constructor(metricsService: MetricsService, cycleService: CycleService);
    getPredictions(req: any): Promise<{
        energyLevel: number;
        factors: {
            label: string;
            value: string;
            color: string;
        }[];
        recommendation: string;
        nextPeriodDate: string;
        ovulationWindow: string;
        highEnergyDays: string;
        pregnancyProbability: string;
        hasEnoughData: boolean;
        cyclesRegistered: number;
        phase?: undefined;
        currentDay?: undefined;
    } | {
        energyLevel: number;
        factors: any[];
        recommendation: string;
        phase: string;
        currentDay: number;
        nextPeriodDate: string;
        ovulationWindow: string;
        highEnergyDays: string;
        pregnancyProbability: string;
        hasEnoughData: boolean;
        cyclesRegistered: number;
    }>;
}
