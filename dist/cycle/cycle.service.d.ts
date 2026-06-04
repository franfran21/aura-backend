import { Repository } from 'typeorm';
import { Cycle } from './cycle.entity';
export declare class CycleService {
    private readonly cycleRepository;
    constructor(cycleRepository: Repository<Cycle>);
    getCurrentCycle(userId: number): Promise<{
        currentDay: number;
        phase: string;
        id: number;
        lastPeriodDate: Date;
        avgCycleLength: number;
        user: import("../users/user.entity").User;
    }>;
}
