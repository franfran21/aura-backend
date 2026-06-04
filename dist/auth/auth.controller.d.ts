import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(userData: any): Promise<import("../users/user.entity").User>;
    login(body: {
        username: string;
        password?: string;
    }): Promise<{
        access_token: string;
        system: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
