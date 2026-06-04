import { User } from '../users/user.entity';
export declare class Insight {
    id: number;
    metricsRaw: string;
    aiDiagnosis: string;
    status: string;
    createdAt: Date;
    user: User;
}
