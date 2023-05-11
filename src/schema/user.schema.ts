import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: 'firstName is required' }),
    lastName: string({ required_error: 'lastName is required' }),
    email: string({ required_error: 'email is required' }).email({
      message: 'provide a valid email',
    }),
    password: string({ required_error: 'password is required' }).min(
      4,
      'password must be a min of 6 characters'
    ),
    passwordConfirmation: string({
      required_error: 'password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string({ required_error: 'user id is required' }),
    verificationCode: string({
      required_error: ' email verfication code is required',
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: 'email is required' }).email({
      message: 'provide a valid email',
    }),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string({ required_error: 'user id is required' }),
    passwordResetCode: string({
      required_error: 'password reset code is required',
    }),
  }),
  body: object({
    password: string({ required_error: 'password is required' }).min(
      4,
      'password must be a min of 6 characters'
    ),
    passwordConfirmation: string({
      required_error: 'password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export const getCurrentUserSchema = object({
  params: object({
    id: string(),
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>['body'];

export type verifyUserInput = TypeOf<typeof verifyUserSchema>['params'];

export type forgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type resetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export type getCurrentUserInput = TypeOf<typeof getCurrentUserSchema>['params'];
