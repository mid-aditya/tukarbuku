import { getDb } from '$lib/server/db';
import { conversations } from '$lib/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { uuid } from '$lib/server/uuid';

/**
 * Cari percakapan dua orang yang sudah ada, atau buat baru. Idempotent —
 * dipakai ulang oleh REST API dan server action halaman detail buku.
 */
export async function findOrCreateConversation(params: {
	userId: string;
	recipientId: string;
	bookId?: string | null;
}): Promise<string> {
	const db = getDb();

	const existing = await db
		.select({ id: conversations.id, bookId: conversations.bookId })
		.from(conversations)
		.where(
			or(
				and(
					eq(conversations.participantOneId, params.userId),
					eq(conversations.participantTwoId, params.recipientId)
				),
				and(
					eq(conversations.participantTwoId, params.userId),
					eq(conversations.participantOneId, params.recipientId)
				)
			)
		);
	if (existing.length) {
		// Percakapan lama yang belum terikat buku (mis. hasil REST POST tanpa
		// bookId) diikat ke buku yang sedang dibuka, agar fitur "ajukan
		// kesepakatan" di chat tahu konteksnya.
		if (!existing[0].bookId && params.bookId) {
			await db
				.update(conversations)
				.set({ bookId: params.bookId })
				.where(eq(conversations.id, existing[0].id));
		}
		return existing[0].id;
	}

	const id = uuid();
	await db.insert(conversations).values({
		id,
		bookId: params.bookId ?? null,
		participantOneId: params.userId,
		participantTwoId: params.recipientId
	});
	return id;
}
