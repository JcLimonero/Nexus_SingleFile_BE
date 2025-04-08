export declare class CreateUserDto {
    username: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    preferences?: {
        theme?: string;
        notifications?: boolean;
    };
}
