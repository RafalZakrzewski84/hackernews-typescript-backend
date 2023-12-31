import * as jwt from 'jsonwebtoken';

export const APP_SECRET = 'XXXXXXXXXXXX';

export interface AuthTokenPayload {
  userId: string;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token found');
  }

  return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}
