import { Session } from 'inspector';
import SessionModel from '../model/session.model';
import { User, privateFields } from '../model/user.model';
import { signJwt } from '../utils/jwt';
import { omit } from 'lodash';

async function createSession(userId: string) {
  try {
    return await SessionModel.create({ user: userId });
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export function signAccessToken(payload: Partial<User>) {
  const accessToken = signJwt(
    omit(payload, privateFields),
    'accessTokenPrivateKey',
    { expiresIn: '15m' }
  );
  return accessToken;
}

export async function signRefreshToken(userId: string) {
  const session = await createSession(userId);
  const refreshToken = signJwt(
    { session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn: '1y' }
  );
  return refreshToken;
}
