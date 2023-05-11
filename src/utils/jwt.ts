import jwt from 'jsonwebtoken';
import config from 'config';
import Logger from './logger';

const accessToken = config.get<{
  publicKey: string;
  privateKey: string;
}>('accessToken');

const refreshToken = config.get<{
  publicKey: string;
  privateKey: string;
}>('refreshToken');

export function signJwt(
  payload: object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) {
  const signInKey =
    keyName === 'accessTokenPrivateKey'
      ? accessToken.privateKey
      : refreshToken.privateKey;

  return jwt.sign(payload, signInKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPrivateKey'
): T | null {
  const publicKey =
    keyName === 'accessTokenPublicKey'
      ? accessToken.publicKey
      : refreshToken.publicKey;

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (err: any) {
    Logger.error(err.message);
    return null;
  }
}
