import { PrismaClient } from '@prisma/client';
import { decodeAuthHeader, AuthTokenPayload } from './utils/auth';
import { Request } from 'express';

export const prismaClient = new PrismaClient();

export interface Context {
  prismaClient: PrismaClient;
  userId?: string;
}

export const context = ({ req }: { req: Request }): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;
  return { prismaClient, userId: token?.userId };
};
