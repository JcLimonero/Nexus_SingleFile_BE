import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
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
    } & import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
