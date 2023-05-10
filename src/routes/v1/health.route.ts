import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

router.get('/', (_: Request, res: Response) => res.sendStatus(200));

export { router as HealthRoutes };
