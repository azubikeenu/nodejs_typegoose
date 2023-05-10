import { Request, Response } from 'express';
import {
  createUserInput,
  forgotPasswordInput,
  resetPasswordInput,
  verifyUserInput,
} from '../schema/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../service/user.service';

import { v4 as uuid } from 'uuid';

import sendEmail from '../utils/mailer';
import Logger from '../utils/logger';

export async function createUserHandler(
  req: Request<{}, {}, createUserInput>,
  res: Response
) {
  try {
    const user = await createUser({ ...req.body });

    // send email on successful creation
    await sendEmail({
      from: 'test@api.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `verification code ${user.verificationCode} id : ${user._id}`,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message });
  }
}

export async function verfiyUserHandler(
  req: Request<verifyUserInput>,
  res: Response
) {
  const { id, verificationCode } = req.params;
  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ` Could not verify user with id ${id}`,
      });
    }
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: `User is already verified`,
      });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: `Invalid verification code`,
      });
    }
    user.verified = true;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: 'Successfully verified the user' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message });
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, forgotPasswordInput>,
  res: Response
) {
  const { email } = req.body;
  try {
    const user = await findUserByEmail({ email });

    if (!user) {
      Logger.debug(`user with email : ${email} not found`);

      return res.status(200).json({
        success: true,
        message: `you would receive a password reset token if the email is registered`,
      });
    }
    if (!user.verified) {
      return res
        .status(400)
        .json({ success: false, message: 'User not verified' });
    }

    user.passwordResetCode = uuid();

    await user.save();

    await sendEmail({
      to: user.email,
      from: 'test@api.com',
      subject: 'Reset password',
      text: `Password reset code is ${user.passwordResetCode} and user id is ${user._id}`,
    });

    Logger.debug(
      `password reset token successfully sent to email ${user.email}`
    );

    return res.status(200).json({
      success: true,
      message: `you would receive a password reset token if the email is registered`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message });
  }
}

export async function resetPasswordHandler(
  req: Request<resetPasswordInput['params'], {}, resetPasswordInput['body']>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Could not reset user password' });
  }
  user.passwordResetCode = null;
  const { password } = req.body;
  user.password = password;

  await user.save();

  return res
    .status(200)
    .json({ success: true, message: 'Successfully updated user password' });
}
