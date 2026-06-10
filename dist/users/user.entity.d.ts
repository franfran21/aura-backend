export declare class User {
    id: number;
    email: string;
    password: string;
    name?: string;
    role: string;
    status: string;
    pushToken?: string;
    hashPassword(): Promise<void>;
}
