import { User } from '../users/user.entity';
export type EnergyLevel = 'baja' | 'media' | 'alta';
export type FlowLevel = 'leve' | 'moderado' | 'fuerte' | null;
export type MoodType = 'feliz' | 'tranquila' | 'triste' | 'irritable' | 'ansiosa' | 'cansada' | 'energetica' | 'neutral';
export declare class CycleLog {
    id: number;
    date: string;
    flow?: string;
    energy?: string;
    mood?: string;
    painLevel?: string;
    skin?: string;
    sleep?: string;
    symptoms?: string;
    intercourse?: boolean;
    protected?: boolean;
    notes?: string;
    createdAt: Date;
    user: User;
}
