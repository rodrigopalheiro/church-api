import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getPrisma } from './db';

export const getAuth = (prisma: ReturnType<typeof getPrisma>) => {
	return betterAuth({
		database: prismaAdapter(prisma, {
			provider: 'postgresql',
		}),
		emailAndPassword: {
			enabled: true,
		},
	});
};
