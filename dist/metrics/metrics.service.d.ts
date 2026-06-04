import { Repository } from 'typeorm';
import { Metric } from './metric.entity';
export declare class MetricsService {
    private readonly metricRepository;
    constructor(metricRepository: Repository<Metric>);
    saveMetrics(userId: number, data: any): Promise<Metric | Metric[]>;
    getDailyMetrics(userId: number, date: Date): Promise<Metric>;
}
