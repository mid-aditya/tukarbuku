import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { conversations, users, books } from '$lib/server/db/schema';
import { eq, desc, or, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { uuid } from '$lib/server/uuid';
import { conversationInputSchema, conversationIdSchema } from '$lib/validation/conversation';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const db = getDb();
	const userId = session.user.id;

	// Single query: conversation + book title + both participant names.
	// Avoids the previous 1 + 2N query pattern.
	const participantOne = alias(users, 'participant_one');
	const participantTwo = alias(users, 'participant_two');

	const rows = await db
		.select({
			id: conversations.id,
			bookId: conversations.bookId,
			participantOneId: conversations.participantOneId,
			participantTwoId: conversations.participantTwoId,
			createdAt: conversations.createdAt,
			bookTitle: books.title,
			participantOneName: participantOne.name,
			participantTwoName: participantTwo.name,
		})
		.from(conversations)
		.leftJoin(books, eq(books.id, conversations.bookId))
		.leftJoin(participantOne, eq(participantOne.id, conversations.participantOneId))
		.leftJoin(participantTwo, eq(participantTwo.id, conversations.participantTwoId))
		.where(
			or(
				eq(conversations.participantOneId, userId),
				eq(conversations.participantTwoId, userId),
			),
		)
		.orderBy(desc(conversations.createdAt));

	const enriched = rows.map((row) => {
		const otherUserName =
			row.participantOneId === userId ? row.participantTwoName : row.participantOneName;

		return {
			id: row.id,
			bookId: row.bookId,
			participantOneId: row.participantOneId,
			participantTwoId: row.participantTwoId,
			createdAt: row.createdAt,
			bookTitle: row.bookTitle ?? null,
			otherUserName: otherUserName ?? 'Tanpa nama',
		};
	});

	return json(enriched);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const raw = (await request.json().catch(() => null)) as unknown;
	const parsed = conversationInputSchema.safeParse(raw);
	if (!parsed.success) {
		throw error(400, parsed.error.issues[0]?.message ?? 'Input tidak valid');
	}
	const { recipientId, bookId: bookIdRaw } = parsed.data;
	const bookId = bookIdRaw ?? null;
	const userId = session.user.id;

	if (recipientId === userId) throw error(400, 'Tidak bisa memulai percakapan dengan diri sendiri');

	const db = getDb();

	const [recipient] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, recipientId))
		.limit(1);
	if (!recipient) throw error(400, 'Penerima tidak ditemukan');

	if (bookId) {
		const [bookRow] = await db.select({ id: books.id }).from(books).where(eq(books.id, bookId)).limit(1);
		if (!bookRow) throw error(400, 'Buku yang dituju tidak ditemukan');
	}

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
