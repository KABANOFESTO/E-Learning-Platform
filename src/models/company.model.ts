import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export type Company = ReturnType<typeof prisma.company['findFirst']> extends Promise<infer T> ? T : never;