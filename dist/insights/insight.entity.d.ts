import { User } from '../users/user.entity';
export declare class Insight {
    id: number;
    title: string;
    description: string;
    metricsRaw: string;
    aiDiagnosis: string;
    status: string;
    createdAt: Date;
    user: User;
}
