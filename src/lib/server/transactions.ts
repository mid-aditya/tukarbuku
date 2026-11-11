import { getDb } from '$lib/server/db';
import { books, conversations, transactions, users } from '$lib/server/db/schema';
import { and, desc, eq, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { uuid } from '$lib/server/uuid';
import type { TransactionAction } from '$lib/validation/transaction';

/** Error domain transaksi; endpoint memetakan `code` ke status HTTP. */
export class TransactionError extends Error {
	code: 'forbidden' | 'no-book' | 'unavailable' | 'self' | 'invalid-state';
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

/** Status transisi yang diizinkan per aksi, beserta siapa yang boleh. */
type Transition = {
	from: ('pending' | 'disepakati')[];
	actor: 'seller' | 'buyer' | 'either';
	to: 'disepakati' | 'batal' | 'selesai';
	bookTo: 'proses' | 'tersedia' | 'selesai';
};

const TRANSITIONS: Record<TransactionAction, Transition> = {
	accept: { from: ['pending'], actor: 'seller', to: 'disepakati', bookTo: 'proses' },
	decline: { from: ['pending'], actor: 'seller', to: 'batal', bookTo: 'tersedia' },
	// Membatalkan bisa dari pending (pembeli) maupun disepakati (kedua pihak).
	cancel: { from: ['pending', 'disepakati'], actor: 'either', to: 'batal', bookTo: 'tersedia' },
	complete: { from: ['disepakati'], actor: 'either', to: 'selesai', bookTo: 'selesai' }
};

/**
 * Mesin status transaksi. Semua verifikasi (peserta + state) di sini; update
 * status pakai guard kondisional agar klik ganda tidak dobel-transisi.
 */
export async function transitionTransaction(params: {
	transactionId: string;
	actorId: string;
	action: TransactionAction;
}) {
	const db = getDb();

	const [tx] = await db
		.select({
			id: transactions.id,
			status: transactions.status,
			buyerId: transactions.buyerId,
			sellerId: transactions.sellerId,
			bookId: transactions.bookId
		})
		.from(transactions)
		.where(eq(transactions.id, params.transactionId));

	if (!tx || (tx.buyerId !== params.actorId && tx.sellerId !== params.actorId)) {
		throw new TransactionError('forbidden', 'Transaksi tidak ditemukan.');
	}

	const rule = TRANSITIONS[params.action];
	if (!(rule.from as string[]).includes(tx.status)) {
		throw new TransactionError(
			'invalid-state',
			`Aksi "${params.action}" tidak bisa dilakukan dari status transaksi ini.`
		);
	}
	if (rule.actor === 'seller' && tx.sellerId !== params.actorId) {
		throw new TransactionError('forbidden', 'Hanya penjual yang bisa melakukan aksi ini.');
	}
	if (rule.actor === 'buyer' && tx.buyerId !== params.actorId) {
		throw new TransactionError('forbidden', 'Hanya pembeli yang bisa melakukan aksi ini.');
	}
	if (tx.status === rule.to) {
		return { status: tx.status }; // idempotent
	}

	const updated = await db
		.update(transactions)
		.set({ status: rule.to, updatedAt: new Date() })
		.where(and(eq(transactions.id, tx.id), eq(transactions.status, tx.status)))
		.returning({ id: transactions.id });
	if (!updated.length) {
		throw new TransactionError('invalid-state', 'Status transaksi baru saja berubah. Muat ulang halaman.');
	}

	// Buku mengikuti transaksi selama masih 'proses' (status sebelum
	// transisinya selalu proses, baik dari pending maupun disepakati).
	if (tx.bookId && rule.bookTo !== 'proses') {
		await db
			.update(books)
			.set({ status: rule.bookTo, updatedAt: new Date() })
			.where(and(eq(books.id, tx.bookId), eq(books.status, 'proses')));
	}

	return { status: rule.to };
}

/** Daftar transaksi yang melibatkan user, terbaru dulu. */
export async function listTransactionsForUser(userId: string) {
	const db = getDb();
	const buyer = alias(users, 'buyer');
	const seller = alias(users, 'seller');

	const rows = await db
		.select({
			id: transactions.id,
			status: transactions.status,
			type: transactions.type,
			createdAt: transactions.createdAt,
			updatedAt: transactions.updatedAt,
			buyerId: transactions.buyerId,
			sellerId: transactions.sellerId,
			buyerName: buyer.name,
			sellerName: seller.name,
			bookId: books.id,
			bookTitle: books.title,
			bookCover: books.coverImageUrl,
			bookPrice: books.price,
			bookListingType: books.listingType,
			bookStatus: books.status
		})
		.from(transactions)
		.innerJoin(books, eq(books.id, transactions.bookId))
		.innerJoin(buyer, eq(buyer.id, transactions.buyerId))
		.innerJoin(seller, eq(seller.id, transactions.sellerId))
		.where(or(eq(transactions.buyerId, userId), eq(transactions.sellerId, userId)))
		.orderBy(desc(transactions.updatedAt));

	return rows.map((row) => ({ ...row, role: row.buyerId === userId ? ('buyer' as const) : ('seller' as const) }));
}
