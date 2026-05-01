import { UserRole } from '@prisma/client';
export interface JwtPayload {
    userId: string;
    role: UserRole;
}
export declare const signAccessToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map