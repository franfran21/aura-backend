import { User } from '../users/user.entity';
export declare class Metric {
    id: number;
    temperature: number;
    hrv: number;
    sleepQuality: number;
    date: Date;
    user: User;
}
