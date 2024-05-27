import express, { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();
// health routes not passed via api gateway can be excessed from anywhere.
export function healthRoutes(): Router {
  router.get('/notification-health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification service is healthy and Ok.');
  });
  return router;
}