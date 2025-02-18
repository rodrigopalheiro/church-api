import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getPrisma } from './lib/db';
import { getAuth } from './lib/auth';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string;
	};
	Variables: {
		prisma: ReturnType<typeof getPrisma>;
		auth: ReturnType<typeof getAuth>;
	};
}>();

app.use(async (c, next) => {
	const prisma = getPrisma(c.env.DATABASE_URL);
	const auth = getAuth(prisma);
	c.set('prisma', prisma);
	c.set('auth', auth);
	await next();
});

app.use(
	'*',
	cors({
		origin: 'http://localhost:3000',
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	})
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return c.get('auth').handler(c.req.raw);
});

app.get('/api/test', async (c) => {
	const prisma = c.get('prisma');
	const result = await prisma.meetingType.findMany({
		cacheStrategy: { ttl: 60 },
	});
	return c.json({ result, success: false });
});

export default app;
