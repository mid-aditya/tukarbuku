import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBookById, listBooks } from '$lib/server/books';

export const load: PageServerLoad = async ({ params }) => {
	let book;
	try {
		book = await getBookById(params.id);
	} catch (err) {
		console.error('[buku] gagal memuat detail buku:', err);
		throw error(503, 'Database sedang tidak tersedia. Coba lagi sebentar lagi.');
	}

	if (!book) throw error(404, 'Buku tidak ditemukan');

	// Rekomendasi: listing lain di kota yang sama.
	let related: Awaited<ReturnType<typeof listBooks>>['items'] = [];
	try {
		const result = await listBooks({ city: book.city, pageSize: 4 });
		related = result.items.filter((item) => item.id !== book.id).slice(0, 3);
	} catch {
		related = [];
	}

	return { book, related };
};
