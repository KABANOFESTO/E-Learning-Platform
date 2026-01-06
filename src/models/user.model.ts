import 'dotenv/config';
import { Role } from './role.enum';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export type User = ReturnType<typeof prisma.user['findFirst']> extends Promise<infer T> ? T : never;

