import { Request, Response } from 'express';

export interface AppContext {
    req: Request & { session: any};
    res: Response;
}