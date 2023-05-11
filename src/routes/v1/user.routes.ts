import express, { Router } from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verfiyUserHandler,
} from '../../controllers/user.controller';
import validateSchema from '../../middleware/resource.validator';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../../schema/user.schema';

const router: Router = express.Router();
router.post('/', validateSchema(createUserSchema), createUserHandler);

router.get(
  '/verify/:id/:verificationCode',
  validateSchema(verifyUserSchema),
  verfiyUserHandler
);

router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  resetPasswordHandler
);

router.get('/me', getCurrentUserHandler);

export default router;
