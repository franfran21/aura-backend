import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<[User[], number]>;
    create(userData: Partial<User>): Promise<User>;
    updatePushToken(userId: number, token: string): Promise<void>;
}
