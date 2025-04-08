export declare class User {
    id: string;
    username: string;
    name: string;
    email: string;
    password: string;
    role: string;
    preferences: {
        theme?: string;
        notifications?: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
