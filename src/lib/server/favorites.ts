import { and, desc, eq } from 'drizzle-orm';
import { getDb } from './db';
import { books, favorites, users } from './db/schema';
import { bookColumns, mapBook } from './books';
import type { Book } from '$lib/data/books';

export async function listFavoriteIds(userId: string): Promise<string[]> {
	const db = getDb();
	const rows = await db
		.select({ bookId: favorites.bookId })
		.from(favorites)
		.where(eq(favorites.userId, userId));

	return rows.map((row) => row.bookId);
}

export async function listFavoriteBooks(userId: string): Promise<Book[]> {
	const db = getDb();
	const rows = await db
		.select(bookColumns)
		.from(favorites)
		.innerJoin(books, eq(books.id, favorites.bookId))
		.innerJoin(users, eq(users.id, books.ownerId))
		.where(eq(favorites.userId, userId))
		.orderBy(desc(favorites.createdAt));

	return rows.map(mapBook);
}

/** Toggle a saved book. Returns true when the book is favorited afterwards. */
export async function toggleFavorite(userId: string, bookId: string): Promise<boolean> {
	const db = getDb();
	const where = and(eq(favorites.userId, userId), eq(favorites.bookId, bookId));

	const removed = await db.delete(favorites).where(where).returning({ bookId: favorites.bookId });
	if (removed.length) return false;

	await db.insert(favorites).values({ userId, bookId }).onConflictDoNothing();
	return true;
}
