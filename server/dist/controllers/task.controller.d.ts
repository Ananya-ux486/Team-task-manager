import { Request, Response, NextFunction } from 'express';
export declare const getTasks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const _default: {
    getTasks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
//# sourceMappingURL=task.controller.d.ts.map