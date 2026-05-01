import { Request, Response, NextFunction } from 'express';
export declare const getProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMembers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map