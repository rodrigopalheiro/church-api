import { Hono } from 'hono';
import { getPrisma } from './lib/db';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string;
	};
}>();

app.get('/', async (c) => {
	const prisma = getPrisma(c.env.DATABASE_URL);
	const result = await prisma.meetingType.findMany({
		cacheStrategy: { ttl: 60 },
	});
	return c.json({ result });
});

export default app;
