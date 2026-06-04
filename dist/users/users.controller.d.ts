import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        system: string;
        count: number;
        data: import("./user.entity").User[];
    }>;
}
