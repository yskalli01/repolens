export type AuthResponse = {
    token: string;
    email: string;
    role: string;
};

export type User = {
    id: number;
    email: string;
    role: string;
};