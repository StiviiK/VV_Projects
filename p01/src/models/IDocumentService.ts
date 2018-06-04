import { NextFunction, Request, Response } from "express";

export interface IDocumentService {
    find(req: Request, res: Response, next: NextFunction);
    findById(req: Request, res: Response, next: NextFunction);
    create(req: Request, res: Response, next: NextFunction);
    remove(req: Request, res: Response, next: NextFunction);
    update(req: Request, res: Response, next: NextFunction);
}
