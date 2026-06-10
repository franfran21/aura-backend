import { User } from '../users/user.entity';
export declare class Cycle {
    id: number;
    lastPeriodDate: string;
    avgCycleLength: number;
    avgPeriodLength: number;
    user: User;
}
