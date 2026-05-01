export type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};
export declare const ok: <T>(data: T) => {
    success: true;
    data: T;
};
export declare const fail: (error: string) => {
    success: false;
    error: string;
};
//# sourceMappingURL=api.d.ts.map