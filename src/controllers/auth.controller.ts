import { Request, Response } from 'express';
import { createSessionInput } from '../schema/auth.schema';
import { validatePassword } from '../service/user.service';
import { signAccessToken, signRefreshToken } from '../service/auth.service';
export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await validatePassword(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'invalid credentials' });
    }
    if (!user.verified) {
      return res
        .status(400)
        .json({ success: false, message: 'please verify your email' });
    }
    // sign access token
    const accessToken = signAccessToken(user.toJSON());
    // sign refresh token
    const refreshToken = await signRefreshToken(String(user._id));
    return res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message });
  }
}
