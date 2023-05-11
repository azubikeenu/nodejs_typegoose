import express, { Router, Request, Response } from 'express';
import validateSchema from '../../middleware/resource.validator';
import { createSessionSchema } from '../../schema/auth.schema';
import { createSessionHandler } from '../../controllers/auth.controller';
const router: Router = express.Router();

router.post('/', validateSchema(createSessionSchema), createSessionHandler);

export default router;
