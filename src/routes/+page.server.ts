import type { PageServerLoad } from './$types';
import { books } from '$lib/data/books';

export const load: PageServerLoad = async ({ locals }) => {
	// TODO: replace with DB query + pagination when database has data.
	// Example:
	//   const db = getDb();
	//   const rows = await db.select().from(bookTable).where(eq(bookTable.status, 'tersedia')).limit(50);
	return { books };
};
