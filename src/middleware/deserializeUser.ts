import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt';

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) return next();

  const refreshToken = get(req, 'headers.x-refresh', '') as string;

  const decoded = verifyJwt(accessToken, 'accessTokenPublicKey');
  if (decoded) {
    res.locals.user = decoded;
  }
  return next();
}
