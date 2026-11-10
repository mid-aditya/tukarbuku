import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBookById } from '$lib/server/books';
import { listFavoriteIds, toggleFavorite } from '$lib/server/favorites';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	return json({ ids: await listFavoriteIds(session.user.id) });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) throw error(401, 'Unauthorized');

	const body = (await request.json().catch(() => null)) as { bookId?: unknown } | null;
	const bookId = typeof body?.bookId === 'string' ? body.bookId.trim() : '';

	if (!bookId) throw error(400, 'bookId is required');

	const book = await getBookById(bookId);
	if (!book) throw error(404, 'Buku tidak ditemukan');

	const favorited = await toggleFavorite(session.user.id, bookId);
	return json({ favorited });
};
