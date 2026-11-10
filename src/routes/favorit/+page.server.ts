import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listFavoriteBooks } from '$lib/server/favorites';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw redirect(303, '/login?redirectTo=/favorit');

	try {
		const books = await listFavoriteBooks(session.user.id);
		return { books, dbAvailable: true };
	} catch (err) {
		console.error('[favorit] gagal memuat favorit:', err);
		return { books: [], dbAvailable: false };
	}
};
