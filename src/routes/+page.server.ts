import type { PageServerLoad } from './$types';
import { listBooks, listCities } from '$lib/server/books';

export const load: PageServerLoad = async () => {
	try {
		const [{ items }, cities] = await Promise.all([
			listBooks({ pageSize: 24, sort: 'terbaru' }),
			listCities()
		]);
		return { books: items, cities, dbAvailable: true };
	} catch (err) {
		console.error('[home] gagal memuat buku dari database:', err);
		return { books: [], cities: [], dbAvailable: false };
	}
};
