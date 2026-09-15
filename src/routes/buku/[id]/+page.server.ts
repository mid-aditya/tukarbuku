import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { books } from '$lib/data/books';

export const load: PageServerLoad = async ({ params }) => {
	// TODO: replace with DB query when database has data.
	// Example:
	//   const db = getDb();
	//   const row = await db.select().from(booksTable).where(eq(booksTable.id, params.id)).get();
	//   if (!row) throw error(404, 'Buku tidak ditemukan');
	//   return { book: row };

	// Seed lookup uses numeric id; DB uses string uuid.
	const id = Number(params.id);
	const book = books.find((b) => b.id === id);

	if (!book) {
		throw error(404, 'Buku tidak ditemukan');
	}

	return { book };
};
