import { getDb } from '$lib/server/db';
import { books, conversations, transactions } from '$lib/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { uuid } from '$lib/server/uuid';

/** Error domain transaksi; endpoint memetakan `code` ke status HTTP. */
export class TransactionError extends Error {
	code: 'forbidden' | 'no-book' | 'unavailable' | 'self';
	constructor(code: TransactionError['code'], message: string) {
		super(message);
		this.code = code;
	}
}

/** Muat percakapan yang diikuti `userId`, lengkap dengan konteks bukunya. */
export async function getConversationForParticipant(conversationId: string, userId: string) {
	const db = getDb();
	const [row] = await db
		.select({
			id: conversations.id,
			bookId: conversations.bookId,
			participantOneId: conversations.participantOneId,
			participantTwoId: conversations.participantTwoId,
			bookStatus: books.status,
			bookListingType: books.listingType,
			bookTitle: books.title,
			bookOwnerId: books.ownerId
		})
		.from(conversations)
		.leftJoin(books, eq(books.id, conversations.bookId))
		.where(
			and(
				eq(conversations.id, conversationId),
				or(
					eq(conversations.participantOneId, userId),
					eq(conversations.participantTwoId, userId)
				)
			)
		);
	return row ?? null;
}

/**
 * Ajukan kesepakatan dari sebuah percakapan: user adalah pembeli, pemilik
 * listing jadi penjual. Buku diklaim atomically (syarat masih 'tersedia')
 * supaya dua pembeli tidak bisa mengajukan bersamaan.
 */
export async function proposeTransaction(params: { conversationId: string; buyerId: string }) {
	const db = getDb();

	const conv = await getConversationForParticipant(params.conversationId, params.buyerId);
	if (!conv) throw new TransactionError('forbidden', 'Percakapan tidak ditemukan.');
	if (!conv.bookId || !conv.bookOwnerId || !conv.bookListingType) {
		throw new TransactionError('no-book', 'Percakapan ini tidak terkait listing buku.');
	}
	if (conv.bookListingType === 'DONASI') {
		throw new TransactionError('no-book', 'Transaksi belum didukung untuk listing donasi.');
	}
	if (conv.bookStatus !== 'tersedia') {
		throw new TransactionError('unavailable', 'Buku ini sedang tidak tersedia untuk transaksi.');
	}
	if (conv.bookOwnerId === params.buyerId) {
		throw new TransactionError('self', 'Tidak bisa bertransaksi dengan listing sendiri.');
	}

	const claimed = await db
		.update(books)
		.set({ status: 'proses', updatedAt: new Date() })
		.where(and(eq(books.id, conv.bookId), eq(books.status, 'tersedia')))
		.returning({ id: books.id });
	if (!claimed.length) {
		throw new TransactionError('unavailable', 'Buku baru saja diajukan orang lain.');
	}

	const id = uuid();
	await db.insert(transactions).values({
		id,
		bookId: conv.bookId,
		buyerId: params.buyerId,
		sellerId: conv.bookOwnerId,
		type: conv.bookListingType,
		status: 'pending'
	});

	return { id, bookId: conv.bookId, bookStatus: 'proses' as const };
}
