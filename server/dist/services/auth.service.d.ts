export declare const signup: (email: string, password: string, name: string) => Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refresh: (token: string) => Promise<{
    accessToken: string;
}>;
export declare const logout: (token: string) => Promise<void>;
export declare const forgotPassword: (email: string) => Promise<{
    message: string;
    resetToken?: undefined;
    expiresInMinutes?: undefined;
} | {
    message: string;
    resetToken: string;
    expiresInMinutes: number;
}>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map