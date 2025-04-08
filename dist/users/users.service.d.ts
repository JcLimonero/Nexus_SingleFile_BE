import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        username: string;
        name: string;
        email: string;
        password: string;
        role: string;
        preferences: {
            theme?: string;
            notifications?: boolean;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } & User>;
    remove(id: string): Promise<void>;
}
