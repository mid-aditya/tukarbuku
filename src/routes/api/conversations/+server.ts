import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { conversations, users, books } from '$lib/server/db/schema';
import { eq, desc, or, and } from 'drizzle-orm';
import { uuid } from '$lib/server/uuid';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const db = getDb();
	const userId = session.user.id;

	// Find all conversations where user is participant one or two.
	const rows = await db
		.select({
			id: conversations.id,
			bookId: conversations.bookId,
			participantOneId: conversations.participantOneId,
			participantTwoId: conversations.participantTwoId,
			createdAt: conversations.createdAt,
		})
		.from(conversations)
		.where(
			or(
				eq(conversations.participantOneId, userId),
				eq(conversations.participantTwoId, userId),
			),
		)
		.orderBy(desc(conversations.createdAt));

	// Enrich with book title and other participant name.
	const enriched = await Promise.all(
		rows.map(async (row) => {
			const otherUserId =
				row.participantOneId === userId ? row.participantTwoId : row.participantOneId;
			const [bookRow, userRow] = await Promise.all([
				row.bookId
					? db.select({ title: books.title }).from(books).where(eq(books.id, row.bookId)).then(r => r[0])
					: Promise.resolve(null),
				db.select({ name: users.name }).from(users).where(eq(users.id, otherUserId)).then(r => r[0]),
			]);

			return {
				...row,
				bookTitle: bookRow?.title ?? null,
				otherUserName: userRow?.name ?? 'Tanpa nama',
			};
		}),
	);

	return json(enriched);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { bookId, recipientId } = body as { bookId?: string; recipientId?: string };

	if (!recipientId) throw error(400, 'recipientId is required');

	const db = getDb();
	const userId = session.user.id;

	// Check for existing conversation with this recipient.
	const existing = await db
		.select({ id: conversations.id })
		.from(conversations)
		.where(
			or(
				and(eq(conversations.participantOneId, userId), eq(conversations.participantTwoId, recipientId)),
				and(eq(conversations.participantTwoId, userId), eq(conversations.participantOneId, recipientId)),
			),
		);

	if (existing.length) {
		return json({ id: existing[0].id });
	}

	const id = uuid();
	await db.insert(conversations).values({
		id,
		bookId: bookId ?? null,
		participantOneId: userId,
		participantTwoId: recipientId,
	});

	return json({ id });
};
