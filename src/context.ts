import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();

export interface Context {
  prismaClient: PrismaClient;
}

export const context: Context = { prismaClient };
